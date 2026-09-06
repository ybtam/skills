// Explicit fallback only: run with node --test.
// Its sole input is CHANGESETS_WORKFLOW_CONTRACT, a reviewed target artifact.
// It checks local workflow shape only, not hidden release logic, remote Actions,
// tags, SHAs, or branch ancestry.

import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";

const contractEnvironment = "CHANGESETS_WORKFLOW_CONTRACT";

function requiredString(value, name) {
  assert.equal(typeof value, "string", name + " must be a string");
  assert.ok(value.trim(), name + " must not be empty");
  return value.trim();
}

function object(value, name) {
  assert.ok(
    value && typeof value === "object" && !Array.isArray(value),
    name + " must be an object",
  );
  return value;
}

function exactKeys(value, name, keys) {
  const candidate = object(value, name);
  for (const key of Object.keys(candidate)) {
    assert.ok(keys.includes(key), name + " has unsupported field " + key);
  }
  return candidate;
}

function stringList(value, name) {
  assert.ok(Array.isArray(value) && value.length > 0, name + " must be a non-empty array");
  const values = value.map((entry, index) => requiredString(entry, name + "[" + index + "]"));
  assert.equal(new Set(values).size, values.length, name + " cannot contain duplicates");
  return values;
}

function simpleValue(value, name) {
  const result = requiredString(value, name);
  assert.doesNotMatch(result, /[\r\n'"\\]/, name + " must be a simple unquoted value");
  return result;
}

function stableConcurrencyGroup(value, name) {
  const result = requiredString(value, name);
  const stableContexts = new Set([
    "github.workflow",
    "github.ref",
    "github.ref_name",
    "github.repository",
  ]);
  const interpolation = /\$\{\{\s*([^}]+?)\s*\}\}/g;
  let remaining = result;
  for (const match of result.matchAll(interpolation)) {
    assert.ok(
      stableContexts.has(match[1].trim()),
      name + " can interpolate only stable workflow, ref, or repository contexts",
    );
    remaining = remaining.replace(match[0], "");
  }
  assert.doesNotMatch(remaining, /\$\{\{|\}\}/, name + " has an incomplete interpolation");
  return result;
}

function contractFile() {
  const path = resolve(requiredString(process.env[contractEnvironment], contractEnvironment));
  assert.ok(statSync(path).isFile(), contractEnvironment + " must point to a JSON file");
  return path;
}

function workflowPath(contractPath, value, name) {
  const path = resolve(dirname(contractPath), requiredString(value, name));
  assert.ok(statSync(path).isFile(), name + " must point to a workflow file: " + path);
  return path;
}

function parseNativePermissions(value) {
  const permissions = object(value, "release.owner.native.permissions");
  const result = {};
  for (const [key, permission] of Object.entries(permissions)) {
    result[key] = requiredString(permission, "release.owner.native.permissions." + key);
  }
  assert.equal(result.contents, "write", "native release permissions must grant contents: write");
  assert.equal(
    result["pull-requests"],
    "write",
    "native release permissions must grant pull-requests: write",
  );
  return result;
}

function parseOwner(value) {
  const owner = exactKeys(value, "release.owner", ["native", "customRun"]);
  const native = owner.native;
  const customRun = owner.customRun;
  assert.notEqual(
    native === undefined,
    customRun === undefined,
    "release.owner selects exactly one owner",
  );
  if (native !== undefined) {
    const shape = exactKeys(native, "release.owner.native", [
      "action",
      "version",
      "publish",
      "permissions",
    ]);
    assert.ok("publish" in shape, "release.owner.native.publish must be null or an exact command");
    assert.ok(
      shape.publish === null || typeof shape.publish === "string",
      "release.owner.native.publish must be null or a string",
    );
    return {
      kind: "native",
      action: requiredString(shape.action, "release.owner.native.action"),
      version: requiredString(shape.version, "release.owner.native.version"),
      publish:
        shape.publish === null
          ? null
          : requiredString(shape.publish, "release.owner.native.publish"),
      permissions: parseNativePermissions(shape.permissions),
    };
  }
  return { kind: "custom", run: requiredString(customRun, "release.owner.customRun") };
}

function parseContract() {
  const file = contractFile();
  let raw;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    assert.fail(contractEnvironment + " must contain valid JSON: " + error.message);
  }

  const root = exactKeys(raw, "workflow contract", ["intent", "release", "manual", "production"]);
  const intent = exactKeys(root.intent, "intent", [
    "workflow",
    "job",
    "branch",
    "paths",
    "exemptionPredicates",
    "validationRun",
  ]);
  const release = exactKeys(root.release, "release", [
    "workflow",
    "job",
    "branch",
    "concurrencyScope",
    "concurrencyGroup",
    "owner",
  ]);
  const intentPaths = stringList(intent.paths, "intent.paths");
  assert.ok(
    !intentPaths.includes(".changeset/**"),
    "intent.paths must omit .changeset/**; the checker adds it",
  );
  const predicates = stringList(intent.exemptionPredicates, "intent.exemptionPredicates");
  for (const predicate of predicates) {
    assertNoBooleanLiteral(predicate, "intent exemption predicates cannot use boolean literals");
    assert.equal(
      parseCondition(predicate, "intent exemption predicate").kind,
      "atom",
      "intent exemption predicates must be individual expressions",
    );
    assert.ok(
      isAllowedExemptionPredicate(expression(predicate, "intent exemption predicate")),
      "intent exemption predicates must be a PR identity equality or owner-approved label predicate",
    );
  }
  assert.ok(
    predicates.some((predicate) =>
      isGeneratedVersionPrIdentity(expression(predicate, "intent exemption predicate")),
    ),
    "intent exemption predicates must include a generated-version-PR identity",
  );

  const concurrencyScope = requiredString(release.concurrencyScope, "release.concurrencyScope");
  assert.ok(
    ["workflow", "job"].includes(concurrencyScope),
    "release.concurrencyScope must be workflow or job",
  );

  let manual;
  if (root.manual !== undefined) {
    const shape = exactKeys(root.manual, "manual", ["job", "input", "value", "run"]);
    manual = {
      job: requiredString(shape.job, "manual.job"),
      input: simpleValue(shape.input, "manual.input"),
      value: simpleValue(shape.value, "manual.value"),
      run: requiredString(shape.run, "manual.run"),
    };
  }

  let production;
  if (root.production !== undefined) {
    const shape = exactKeys(root.production, "production", ["workflow", "job", "prereleaseGuard"]);
    const prereleaseGuard = expression(shape.prereleaseGuard, "production.prereleaseGuard");
    assert.equal(
      parseCondition(prereleaseGuard, "production.prereleaseGuard").kind,
      "atom",
      "production.prereleaseGuard must be one atom",
    );
    assert.ok(
      isPrereleaseGuardAtom(prereleaseGuard),
      "production.prereleaseGuard must be an explicit release prerelease boolean equality",
    );
    production = {
      workflow: workflowPath(file, shape.workflow, "production.workflow"),
      job: requiredString(shape.job, "production.job"),
      prereleaseGuard,
    };
  }

  return {
    intent: {
      workflow: workflowPath(file, intent.workflow, "intent.workflow"),
      job: requiredString(intent.job, "intent.job"),
      branch: simpleValue(intent.branch, "intent.branch"),
      paths: intentPaths,
      exemptionPredicates: predicates,
      validationRun: requiredString(intent.validationRun, "intent.validationRun"),
    },
    release: {
      workflow: workflowPath(file, release.workflow, "release.workflow"),
      job: requiredString(release.job, "release.job"),
      branch: simpleValue(release.branch, "release.branch"),
      concurrencyScope,
      concurrencyGroup: stableConcurrencyGroup(
        release.concurrencyGroup,
        "release.concurrencyGroup",
      ),
      owner: parseOwner(release.owner),
    },
    manual,
    production,
  };
}

function lines(source) {
  return source.split(/\r?\n/).map((raw, index) => ({ index, raw }));
}

function indentation(line) {
  assert.doesNotMatch(line.raw, /^\t/, "tabs are unsupported in workflow YAML");
  return line.raw.length - line.raw.trimStart().length;
}

function meaningful(line) {
  const value = line.raw.trim();
  return value.length > 0 && !value.startsWith("#");
}

function mapping(line) {
  const value = line.raw.trimStart();
  const match = value.match(/^([A-Za-z0-9_.-]+):(?:[ \t]*(.*))?$/);
  return match ? { key: match[1], value: match[2] ?? "" } : undefined;
}

function block(lines_, start, end, indent) {
  return { lines: lines_, start, end, indent };
}

function mappingEntries(block_) {
  const entries = [];
  for (let index = block_.start; index < block_.end; index += 1) {
    const line = block_.lines[index];
    if (!meaningful(line) || indentation(line) !== block_.indent) {
      continue;
    }
    const candidate = mapping(line);
    if (!candidate) {
      continue;
    }
    let end = index + 1;
    while (end < block_.end) {
      const next = block_.lines[end];
      if (meaningful(next) && indentation(next) <= block_.indent) {
        break;
      }
      end += 1;
    }
    entries.push({ ...candidate, index, end, indent: block_.indent, lines: block_.lines });
  }
  return entries;
}

function entry(block_, key, label) {
  const result = mappingEntries(block_).filter((candidate) => candidate.key === key);
  assert.ok(result.length > 0, "expected " + label);
  assert.equal(result.length, 1, "expected one " + label);
  return result[0];
}

function optionalEntry(block_, key) {
  const result = mappingEntries(block_).filter((candidate) => candidate.key === key);
  assert.ok(result.length <= 1, "expected at most one " + key);
  return result[0];
}

function childBlock(entry_) {
  for (let index = entry_.index + 1; index < entry_.end; index += 1) {
    const line = entry_.lines[index];
    if (meaningful(line)) {
      assert.ok(indentation(line) > entry_.indent, "expected indented body for " + entry_.key);
      return block(entry_.lines, entry_.index + 1, entry_.end, indentation(line));
    }
  }
  return undefined;
}

function stripComment(value) {
  let quote;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (character === quote && value[index - 1] !== "\\") {
        quote = undefined;
      }
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (character === "#" && /\s/.test(value[index - 1] ?? "")) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value.trimEnd();
}

function scalar(value) {
  const result = stripComment(value).trim();
  const quote = result[0];
  if ((quote === "'" || quote === '"') && result.endsWith(quote)) {
    return result.slice(1, -1);
  }
  return result;
}

function entryValue(entry_) {
  const inline = entry_.value.trim();
  if (inline && !/^[>|][+-]?$/.test(inline)) {
    return scalar(inline);
  }
  if (!inline) {
    return undefined;
  }
  const body = childBlock(entry_);
  assert.ok(body, "expected block value for " + entry_.key);
  const values = [];
  for (let index = body.start; index < body.end; index += 1) {
    const line = body.lines[index];
    if (!line.raw.trim()) {
      values.push("");
      continue;
    }
    assert.ok(indentation(line) >= body.indent, "malformed block value for " + entry_.key);
    values.push(line.raw.slice(body.indent));
  }
  return (inline.startsWith("|") ? values.join("\n") : values.join(" ")).trim();
}

function sequenceItems(block_) {
  const items = [];
  for (let index = block_.start; index < block_.end; index += 1) {
    const line = block_.lines[index];
    if (!meaningful(line) || indentation(line) !== block_.indent) {
      continue;
    }
    const match = line.raw.trimStart().match(/^-\s+(.*)$/);
    if (!match) {
      continue;
    }
    let end = index + 1;
    while (end < block_.end) {
      const next = block_.lines[end];
      if (meaningful(next) && indentation(next) < block_.indent) {
        break;
      }
      if (
        meaningful(next) &&
        indentation(next) === block_.indent &&
        /^-\s+/.test(next.raw.trimStart())
      ) {
        break;
      }
      end += 1;
    }
    items.push({ index, end, indent: block_.indent, value: match[1], lines: block_.lines });
  }
  return items;
}

function itemEntry(item, key) {
  const first = item.value.match(/^([A-Za-z0-9_.-]+):(?:[ \t]*(.*))?$/);
  if (first?.[1] === key) {
    return {
      key,
      value: first[2] ?? "",
      index: item.index,
      end: item.end,
      indent: item.indent,
      lines: item.lines,
    };
  }

  let childIndent;
  for (let index = item.index + 1; index < item.end; index += 1) {
    const line = item.lines[index];
    if (meaningful(line)) {
      childIndent = indentation(line);
      break;
    }
  }
  if (childIndent === undefined) {
    return undefined;
  }
  const entries = mappingEntries(block(item.lines, item.index + 1, item.end, childIndent)).filter(
    (candidate) => candidate.key === key,
  );
  assert.ok(entries.length <= 1, "expected at most one " + key + " in a step");
  return entries[0];
}

function flowList(value, label) {
  assert.ok(value.startsWith("[") && value.endsWith("]"), "expected flow list for " + label);
  const values = [];
  let current = "";
  let quote;
  for (let index = 1; index < value.length - 1; index += 1) {
    const character = value[index];
    if (quote) {
      current += character;
      if (character === quote && value[index - 1] !== "\\") {
        quote = undefined;
      }
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      current += character;
      continue;
    }
    assert.notEqual(character, "[", "nested flow lists are unsupported in " + label);
    assert.notEqual(character, "]", "nested flow lists are unsupported in " + label);
    if (character === ",") {
      values.push(scalar(current));
      current = "";
      continue;
    }
    current += character;
  }
  assert.ok(!quote, "unclosed quote in flow list for " + label);
  values.push(scalar(current));
  assert.ok(values.length > 0 && values.every(Boolean), "expected non-empty values in " + label);
  return values;
}

function flowMap(value, label) {
  assert.ok(value.startsWith("{") && value.endsWith("}"), "expected flow map for " + label);
  const pairs = [];
  let current = "";
  let quote;
  for (let index = 1; index < value.length - 1; index += 1) {
    const character = value[index];
    if (quote) {
      current += character;
      if (character === quote && value[index - 1] !== "\\") {
        quote = undefined;
      }
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      current += character;
      continue;
    }
    assert.notEqual(character, "{", "nested flow maps are unsupported in " + label);
    assert.notEqual(character, "}", "nested flow maps are unsupported in " + label);
    if (character === ",") {
      pairs.push(current);
      current = "";
      continue;
    }
    current += character;
  }
  assert.ok(!quote, "unclosed quote in flow map for " + label);
  pairs.push(current);
  const result = {};
  for (const pair of pairs) {
    const separator = pair.indexOf(":");
    assert.ok(separator > 0, "expected key/value pair in " + label);
    const key = pair.slice(0, separator).trim();
    const value_ = scalar(pair.slice(separator + 1));
    assert.match(key, /^[A-Za-z0-9_.-]+$/, "unsupported flow-map key in " + label);
    assert.ok(value_, "expected value for " + key + " in " + label);
    assert.equal(result[key], undefined, "duplicate " + key + " in " + label);
    result[key] = value_;
  }
  return result;
}

function mapValues(entry_, label) {
  const inline = entry_.value.trim();
  if (inline.startsWith("{")) {
    return flowMap(inline, label);
  }
  const body = childBlock(entry_);
  assert.ok(body, "expected mapping for " + label);
  const result = {};
  for (const candidate of mappingEntries(body)) {
    assert.equal(
      childBlock(candidate),
      undefined,
      "expected scalar " + candidate.key + " in " + label,
    );
    const value = entryValue(candidate);
    assert.ok(value, "expected value for " + candidate.key + " in " + label);
    assert.equal(result[candidate.key], undefined, "duplicate " + candidate.key + " in " + label);
    result[candidate.key] = value;
  }
  assert.ok(Object.keys(result).length > 0, "expected values for " + label);
  return result;
}

function list(entry_, label) {
  const inline = entry_.value.trim();
  if (inline.startsWith("[")) {
    return flowList(inline, label);
  }
  const body = childBlock(entry_);
  assert.ok(body, "expected list for " + label);
  const items = sequenceItems(body);
  assert.ok(items.length > 0, "expected values for " + label);
  const values = items.map((item) => {
    assert.ok(!mapping(item.lines[item.index]), "expected scalar list item in " + label);
    return scalar(item.value);
  });
  assert.ok(values.every(Boolean), "expected non-empty values in " + label);
  return values;
}

function jobs(source) {
  const sourceLines = lines(source);
  const root = block(sourceLines, 0, sourceLines.length, 0);
  const jobsEntry = entry(root, "jobs", "jobs mapping");
  const jobsBlock = childBlock(jobsEntry);
  assert.ok(jobsBlock, "expected jobs mapping");
  return mappingEntries(jobsBlock).map((candidate) => {
    const body = childBlock(candidate);
    assert.ok(body, "expected job body for " + candidate.key);
    return { name: candidate.key, block: body };
  });
}

function requiredJob(source, name) {
  const all = jobs(source);
  const matches = all.filter((job) => job.name === name);
  assert.equal(matches.length, 1, "expected configured job " + name);
  return { job: matches[0], jobs: all };
}

function jobValue(job, key) {
  const candidate = optionalEntry(job.block, key);
  return candidate ? entryValue(candidate) : undefined;
}

function steps(job) {
  const stepsEntry = entry(job.block, "steps", "steps for " + job.name);
  const stepsBlock = childBlock(stepsEntry);
  assert.ok(stepsBlock, "expected steps list for " + job.name);
  return sequenceItems(stepsBlock);
}

function stepValue(step, key) {
  const candidate = itemEntry(step, key);
  return candidate ? entryValue(candidate) : undefined;
}

function assertNotAdvisory(job, step, label) {
  const jobValue_ = jobValue(job, "continue-on-error");
  assert.ok(
    jobValue_ === undefined || jobValue_ === "false",
    label + " job cannot set continue-on-error",
  );
  if (step) {
    assert.equal(stepValue(step, "if"), undefined, label + " step cannot be conditional");
    const stepValue_ = stepValue(step, "continue-on-error");
    assert.ok(
      stepValue_ === undefined || stepValue_ === "false",
      label + " step cannot set continue-on-error",
    );
  }
}

function expression(value, label) {
  let result = requiredString(value, label);
  if (result.startsWith("$" + "{{")) {
    assert.ok(result.endsWith("}}"), label + " has an unclosed expression wrapper");
    result = result.slice(3, -2).trim();
  }
  return removeWhitespaceOutsideQuotes(result);
}

function removeWhitespaceOutsideQuotes(value) {
  let result = "";
  let quote;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      result += character;
      if (character === quote && value[index - 1] !== "\\") {
        quote = undefined;
      }
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      result += character;
      continue;
    }
    if (!/\s/.test(character)) {
      result += character;
    }
  }
  assert.ok(!quote, "expression has an unclosed quote");
  return result;
}

function stripQuotedValues(value) {
  let result = "";
  let quote;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (character === quote && value[index - 1] !== "\\") {
        quote = undefined;
      }
      result += " ";
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      result += " ";
      continue;
    }
    result += character;
  }
  return result;
}

function assertNoBooleanLiteral(value, message) {
  assert.doesNotMatch(stripQuotedValues(value), /\b(?:true|false)\b/i, message);
}

function parseCondition(value, label) {
  const input = expression(value, label);
  let index = 0;

  function consume(operator) {
    if (input.slice(index, index + operator.length) === operator) {
      index += operator.length;
      return true;
    }
    return false;
  }

  function primary() {
    if (consume("!")) {
      return { kind: "not", value: primary() };
    }
    if (consume("(")) {
      const value_ = or();
      assert.ok(consume(")"), label + " has an unclosed group");
      return value_;
    }

    const start = index;
    let depth = 0;
    let quote;
    while (index < input.length) {
      const character = input[index];
      if (quote) {
        if (character === quote && input[index - 1] !== "\\") {
          quote = undefined;
        }
        index += 1;
        continue;
      }
      if (character === "'" || character === '"') {
        quote = character;
        index += 1;
        continue;
      }
      if (character === "(") {
        depth += 1;
        index += 1;
        continue;
      }
      if (character === ")") {
        if (depth === 0) {
          break;
        }
        depth -= 1;
        index += 1;
        continue;
      }
      if (
        depth === 0 &&
        (input.slice(index, index + 2) === "&&" || input.slice(index, index + 2) === "||")
      ) {
        break;
      }
      index += 1;
    }
    assert.ok(!quote && depth === 0, label + " has an unclosed expression");
    const atom = input.slice(start, index);
    assert.ok(atom, label + " has an empty expression term");
    return { kind: "atom", value: atom };
  }

  function and() {
    let value_ = primary();
    while (consume("&&")) {
      value_ = { kind: "and", left: value_, right: primary() };
    }
    return value_;
  }

  function or() {
    let value_ = and();
    while (consume("||")) {
      value_ = { kind: "or", left: value_, right: and() };
    }
    return value_;
  }

  const result = or();
  assert.equal(index, input.length, label + " has unsupported trailing syntax");
  return result;
}

function flattenedOr(value) {
  return value.kind === "or" ? [...flattenedOr(value.left), ...flattenedOr(value.right)] : [value];
}

function requiresAtom(value, predicate) {
  if (value.kind === "atom") {
    return predicate(value.value);
  }
  if (value.kind === "and") {
    return requiresAtom(value.left, predicate) || requiresAtom(value.right, predicate);
  }
  if (value.kind === "or") {
    return requiresAtom(value.left, predicate) && requiresAtom(value.right, predicate);
  }
  return false;
}

function quoted(value) {
  return ["'" + value + "'", '"' + value + '"'];
}

function equality(value, names, expected) {
  return names.some((name) =>
    quoted(expected).some(
      (literal) => value === name + "==" + literal || value === literal + "==" + name,
    ),
  );
}

function inequality(value, names, expected) {
  return names.some((name) =>
    quoted(expected).some(
      (literal) => value === name + "!=" + literal || value === literal + "!=" + name,
    ),
  );
}

function branchEquality(value, branch) {
  return (
    equality(value, ["github.ref"], "refs/heads/" + branch) ||
    equality(value, ["github.ref_name"], branch)
  );
}

function isGeneratedVersionPrIdentity(value) {
  const field = "github\\.event\\.pull_request\\.user\\.login";
  const equalityToValue = new RegExp("^" + field + "==(['\"])[^'\"]+\\1$");
  const equalityFromValue = new RegExp("^(['\"])[^'\"]+\\1==" + field + "$");
  return equalityToValue.test(value) || equalityFromValue.test(value);
}

function isOwnerApprovedLabelPredicate(value) {
  return /^contains\(github\.event\.pull_request\.labels\.\*\.name,(['"])owner-approved[^'"]*\1\)$/.test(
    value,
  );
}

function isAllowedExemptionPredicate(value) {
  return isGeneratedVersionPrIdentity(value) || isOwnerApprovedLabelPredicate(value);
}

function isPrereleaseGuardAtom(value) {
  return (
    /^github\.event\.release\.prerelease==(?:true|false)$/.test(value) ||
    /^(?:true|false)==github\.event\.release\.prerelease$/.test(value)
  );
}

function gatedCondition(job, branch, label) {
  const condition = jobValue(job, "if");
  assert.ok(condition, label + " needs an if condition");
  assertNoBooleanLiteral(condition, label + " condition cannot use boolean literals");
  const parsed = parseCondition(condition, label + " condition");
  assert.ok(
    requiresAtom(parsed, (atom) => branchEquality(atom, branch)),
    label + " must require an equality for the configured branch on every path",
  );
  return parsed;
}

function exactList(actual, expected, label) {
  assert.equal(actual.length, expected.length, label + " has unexpected values");
  assert.deepEqual(
    [...actual].sort(),
    [...expected].sort(),
    label + " does not match the contract",
  );
}

function workflowRoot(source) {
  const sourceLines = lines(source);
  return block(sourceLines, 0, sourceLines.length, 0);
}

function workflowOn(source) {
  const onEntry = entry(workflowRoot(source), "on", "on trigger");
  const onBlock = childBlock(onEntry);
  assert.ok(onBlock, "expected mapping-style on trigger");
  return onBlock;
}

function assertIntent(contract, source) {
  const on = workflowOn(source);
  const pullRequest = entry(on, "pull_request", "pull_request trigger");
  const pullRequestBlock = childBlock(pullRequest);
  assert.ok(pullRequestBlock, "expected pull_request trigger mapping");
  exactList(
    list(entry(pullRequestBlock, "branches", "pull_request branches"), "pull_request branches"),
    [contract.branch],
    "pull_request branches",
  );
  exactList(
    list(entry(pullRequestBlock, "paths", "pull_request paths"), "pull_request paths"),
    [".changeset/**", ...contract.paths],
    "pull_request paths",
  );

  const { job } = requiredJob(source, contract.job);
  const condition = jobValue(job, "if");
  assert.ok(condition, "configured intent job needs an if condition");
  assertNoBooleanLiteral(condition, "intent condition cannot use boolean literals");
  const parsed = parseCondition(condition, "intent condition");
  assert.equal(parsed.kind, "not", "intent condition must be one negation");
  const expected = contract.exemptionPredicates
    .map((predicate) => expression(predicate, "intent exemption predicate"))
    .sort();
  const actual = flattenedOr(parsed.value).map((term) => {
    assert.equal(term.kind, "atom", "intent negation can contain only declared predicates");
    return term.value;
  });
  exactList(actual, expected, "intent exemption predicates");

  const validation = steps(job).filter((step) => stepValue(step, "run") === contract.validationRun);
  assert.equal(validation.length, 1, "configured intent validation run must occur once in its job");
  assertNotAdvisory(job, validation[0], "configured intent validation");
}

function assertNonCancellableConcurrency(candidate, label) {
  if (!candidate) {
    return;
  }
  const concurrency = childBlock(candidate);
  assert.ok(concurrency, "expected mapping-style " + label + " concurrency");
  assert.equal(
    entryValue(entry(concurrency, "cancel-in-progress", "cancel-in-progress")),
    "false",
    label + " concurrency must set cancel-in-progress to false",
  );
}

function assertConcurrency(contract, source, releaseJob) {
  const workflowConcurrency = optionalEntry(workflowRoot(source), "concurrency");
  const jobConcurrency = optionalEntry(releaseJob.block, "concurrency");
  assertNonCancellableConcurrency(workflowConcurrency, "workflow");
  assertNonCancellableConcurrency(jobConcurrency, "release job");
  const candidate = contract.concurrencyScope === "workflow" ? workflowConcurrency : jobConcurrency;
  assert.ok(candidate, "expected " + contract.concurrencyScope + " concurrency");
  const concurrency = childBlock(candidate);
  assert.ok(concurrency, "expected mapping-style " + contract.concurrencyScope + " concurrency");
  assert.equal(
    entryValue(entry(concurrency, "group", "release concurrency group")),
    contract.concurrencyGroup,
    "release concurrency group must match the contract",
  );
  assert.equal(
    entryValue(entry(concurrency, "cancel-in-progress", "cancel-in-progress")),
    "false",
    "release mutation must be non-cancellable at the configured concurrency scope",
  );
}

function ownerStep(step, owner) {
  return owner.kind === "native"
    ? stepValue(step, "uses") === owner.action
    : stepValue(step, "run") === owner.run;
}

function nativeWithValue(step, key) {
  const withEntry = itemEntry(step, "with");
  if (!withEntry) {
    return undefined;
  }
  return mapValues(withEntry, "native release owner inputs")[key];
}

function assertNativeOwnerConfiguration(step, owner) {
  if (owner.kind !== "native") {
    return;
  }
  assert.equal(
    nativeWithValue(step, "version"),
    owner.version,
    "native release owner version input must match the contract",
  );
  if (owner.publish === null) {
    assert.equal(
      nativeWithValue(step, "publish"),
      undefined,
      "version-PR-only owner cannot have a publish input",
    );
    return;
  }
  assert.equal(
    nativeWithValue(step, "publish"),
    owner.publish,
    "native release owner publish input must match the contract",
  );
}

function assertNativeWorkflowPermissions(source, releaseJob, owner) {
  if (owner.kind !== "native") {
    return;
  }
  const permissions = entry(workflowRoot(source), "permissions", "native workflow permissions");
  assert.deepEqual(
    mapValues(permissions, "native workflow permissions"),
    owner.permissions,
    "native workflow permissions must match the contract",
  );
  assert.equal(
    optionalEntry(releaseJob.block, "permissions"),
    undefined,
    "native release job cannot override its reviewed workflow permissions",
  );
}

function assertReleaseTriggers(contract, manual, source) {
  const on = workflowOn(source);
  exactList(
    mappingEntries(on).map((candidate) => candidate.key),
    manual ? ["push", "workflow_dispatch"] : ["push"],
    "release workflow triggers",
  );
  const push = childBlock(entry(on, "push", "push trigger"));
  assert.ok(push, "expected push trigger mapping");
  exactList(
    list(entry(push, "branches", "push branches"), "push branches"),
    [contract.branch],
    "push branches",
  );
}

function assertRelease(contract, manual, source) {
  assertReleaseTriggers(contract, manual, source);
  const { job, jobs: allJobs } = requiredJob(source, contract.job);
  assertNativeWorkflowPermissions(source, job, contract.owner);
  const condition = gatedCondition(job, contract.branch, "configured release job");
  assert.ok(
    requiresAtom(condition, (atom) => equality(atom, ["github.event_name"], "push")),
    "release owner job must require push",
  );
  assertConcurrency(contract, source, job);

  const matches = allJobs.flatMap((candidate) =>
    steps(candidate)
      .filter((step) => ownerStep(step, contract.owner))
      .map((step) => ({ job: candidate, step })),
  );
  assert.equal(matches.length, 1, "the declared release owner must occur exactly once");
  assert.equal(
    matches[0].job.name,
    job.name,
    "the declared release owner must occur in the configured release job",
  );
  assertNotAdvisory(job, matches[0].step, "configured release owner");
  assertNativeOwnerConfiguration(matches[0].step, contract.owner);
  return { job, condition, branch: contract.branch, owner: contract.owner };
}

function assertManual(contract, release, source) {
  const on = workflowOn(source);
  const dispatch = optionalEntry(on, "workflow_dispatch");
  if (!contract) {
    assert.equal(dispatch, undefined, "workflow_dispatch requires a declared manual dry-run shape");
    return;
  }
  assert.ok(dispatch, "manual dry-run requires workflow_dispatch");
  const dispatchBlock = childBlock(dispatch);
  assert.ok(dispatchBlock, "workflow_dispatch must declare its required input");
  const inputs = childBlock(entry(dispatchBlock, "inputs", "workflow_dispatch inputs"));
  assert.ok(inputs, "expected workflow_dispatch inputs");
  const input = childBlock(entry(inputs, contract.input, "configured manual input"));
  assert.ok(input, "expected configured manual input body");
  assert.equal(
    entryValue(entry(input, "required", "manual input required flag")),
    "true",
    "manual confirmation input must be required",
  );

  const { job } = requiredJob(source, contract.job);
  const condition = gatedCondition(job, release.branch, "manual dry-run job");
  assert.ok(
    requiresAtom(condition, (atom) => equality(atom, ["github.event_name"], "workflow_dispatch")),
    "manual dry-run must require workflow_dispatch",
  );
  assert.ok(
    requiresAtom(condition, (atom) =>
      equality(
        atom,
        ["inputs." + contract.input, "github.event.inputs." + contract.input],
        contract.value,
      ),
    ),
    "manual dry-run must require the configured confirmation value",
  );
  const runs = steps(job).filter((step) => stepValue(step, "run") === contract.run);
  assert.equal(runs.length, 1, "configured manual dry-run must occur once in its job");
  assertNotAdvisory(job, runs[0], "configured manual dry-run");
  assert.ok(
    !steps(job).some((step) => ownerStep(step, release.owner)),
    "manual dry-run job cannot contain the declared release owner",
  );
  assert.ok(
    requiresAtom(
      release.condition,
      (atom) =>
        inequality(atom, ["github.event_name"], "workflow_dispatch") ||
        equality(atom, ["github.event_name"], "push"),
    ),
    "release owner job must not execute for workflow_dispatch",
  );
}

function assertProduction(contract, source) {
  if (!contract) {
    return;
  }
  const on = workflowOn(source);
  exactList(
    mappingEntries(on).map((candidate) => candidate.key),
    ["release"],
    "production workflow triggers",
  );
  const release = childBlock(entry(on, "release", "release trigger"));
  assert.ok(release, "expected release trigger mapping");
  exactList(
    list(entry(release, "types", "release types"), "release types"),
    ["published"],
    "release types",
  );
  const { job } = requiredJob(source, contract.job);
  const condition = jobValue(job, "if");
  assert.ok(condition, "configured production job needs an if condition");
  const parsed = parseCondition(condition, "production job condition");
  assert.ok(
    requiresAtom(parsed, (atom) => atom === contract.prereleaseGuard),
    "configured production job must require its prerelease guard on every path",
  );
}

const contract = parseContract();
const intentSource = readFileSync(contract.intent.workflow, "utf8");
const releaseSource = readFileSync(contract.release.workflow, "utf8");
const productionSource = contract.production
  ? readFileSync(contract.production.workflow, "utf8")
  : undefined;

test("workflow shape matches the reviewed Changesets contract", () => {
  assertIntent(contract.intent, intentSource);
  const release = assertRelease(contract.release, contract.manual, releaseSource);
  assertManual(contract.manual, release, releaseSource);
  assertProduction(contract.production, productionSource);
});
