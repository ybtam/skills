import { execFile as execFileCallback } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, expect, test } from "vitest";
import { parseDocument } from "yaml";

type ChangesetRelease = { name: string; newVersion: string; type: string };
type OwnerKind = "native" | "custom";

const require = createRequire(import.meta.url);
const changesetsBin = require.resolve("@changesets/cli/bin.js");
const execFile = promisify(execFileCallback);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtures = resolve(root, "scripts/fixtures/release-with-changesets");
const workflowAssets = resolve(root, "skills/release-with-changesets/assets");
const checker = resolve(workflowAssets, "verify-workflow-shape.mjs");
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

async function command(
  executable: string,
  arguments_: string[],
  cwd: string,
  environment: Record<string, string> = {},
) {
  return execFile(executable, arguments_, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...environment },
  });
}

async function git(repository: string, ...arguments_: string[]) {
  await command("git", arguments_, repository);
}

async function changeset(repository: string, ...arguments_: string[]) {
  await command(process.execPath, [changesetsBin, ...arguments_], repository);
}

async function fixture(name: string) {
  const repository = await mkdtemp(resolve(tmpdir(), "release-with-changesets-"));
  temporaryDirectories.push(repository);
  await cp(resolve(fixtures, name), repository, { recursive: true });
  await git(repository, "init", "--initial-branch=main");
  await git(repository, "config", "user.email", "fixtures@example.test");
  await git(repository, "config", "user.name", "Fixture");
  await git(repository, "add", "--all");
  await git(repository, "commit", "--quiet", "--message", "fixture");
  return repository;
}

async function json(path: string) {
  return JSON.parse(await readFile(path, "utf8")) as unknown;
}

async function changesetStatus(repository: string) {
  const output = resolve(repository, "changeset-status.json");
  await changeset(repository, "status", "--output", output);
  return (await json(output)) as { releases: ChangesetRelease[] };
}

async function packageManifest(repository: string, path = ".") {
  return (await json(resolve(repository, path, "package.json"))) as Record<string, unknown>;
}

function releaseSummary(releases: ChangesetRelease[]) {
  return releases
    .map(({ name, newVersion, type }) => ({ name, newVersion, type }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

test("versions one private JavaScript release unit locally", async () => {
  const repository = await fixture("single-private");

  expect(releaseSummary((await changesetStatus(repository)).releases)).toEqual([
    { name: "@fixture/single-private", newVersion: "1.0.1", type: "patch" },
  ]);

  await changeset(repository, "version");

  expect(await packageManifest(repository)).toMatchObject({
    name: "@fixture/single-private",
    private: true,
    version: "1.0.1",
  });
  await expect(
    readFile(resolve(repository, ".changeset/quiet-parrots-sing.md"), "utf8"),
  ).rejects.toThrow();
});

test("versions only selected JavaScript monorepo release units", async () => {
  const repository = await fixture("js-monorepo");
  await command("bun", ["install", "--frozen-lockfile"], repository);

  expect(releaseSummary((await changesetStatus(repository)).releases)).toEqual([
    { name: "@fixture/private-app", newVersion: "1.0.1", type: "patch" },
    { name: "@fixture/public-library", newVersion: "1.0.1", type: "patch" },
  ]);

  await changeset(repository, "version");

  expect(await packageManifest(repository, "packages/public-library")).toMatchObject({
    version: "1.0.1",
  });
  expect(await packageManifest(repository, "apps/private-app")).toMatchObject({
    private: true,
    version: "1.0.1",
  });
  expect(await packageManifest(repository, "apps/unselected-private-app")).toMatchObject({
    private: true,
    version: "1.0.0",
  });
});

test("keeps Python metadata outside private sidecar release coordination", async () => {
  const repository = await fixture("python-sidecar");
  const before = await readFile(resolve(repository, "pyproject.toml"));

  await changeset(repository, "version");

  expect(await packageManifest(repository)).toMatchObject({
    name: "@fixture/python-sidecar-release-coordination",
    private: true,
    version: "1.0.1",
  });
  expect(Buffer.compare(await readFile(resolve(repository, "pyproject.toml")), before)).toBe(0);
});

test("uses a selected prerelease channel without publishing", async () => {
  const repository = await fixture("single-private");

  await changeset(repository, "pre", "enter", "preview");
  await changeset(repository, "version");

  expect(await packageManifest(repository)).toMatchObject({
    name: "@fixture/single-private",
    version: expect.stringMatching(/^1\.0\.1-preview\.\d+$/),
  });
  expect(await json(resolve(repository, ".changeset/pre.json"))).toMatchObject({ tag: "preview" });
});

const replacements: Record<string, string> = {
  __TARGET_CHANGESETS_ACTION__: "changesets/action",
  __TARGET_CHANGESETS_ACTION_REF__: "v1",
  __TARGET_CHANGESETS_TOKEN_ENV__: "GITHUB_TOKEN",
  __TARGET_CHANGESETS_TOKEN_SECRET__: "GITHUB_TOKEN",
  __TARGET_CHANGESETS_VERSION_COMMAND__: "bun run version-release",
  __TARGET_CHECKOUT_ACTION__: "actions/checkout",
  __TARGET_CHECKOUT_ACTION_REF__: "v4",
  __TARGET_CONFIRMED_RELEASE_BRANCH__: "main",
  __TARGET_EXPLICIT_PRERELEASE_PRODUCTION_GUARD__: "github.event.release.prerelease == false",
  __TARGET_EXISTING_PRODUCTION_GUARD__: "github.event.release.draft == false",
  __TARGET_MANUAL_DRY_RUN_COMMAND__: "bun run release-dry-run",
  __TARGET_MANUAL_RELEASE_CONFIRMATION__: "RELEASE",
  __TARGET_MANUAL_RELEASE_CONFIRMATION_DESCRIPTION__: "Type RELEASE to run a dry run",
  __TARGET_RELEASE_CONCURRENCY_GROUP__: "release-main",
  __TARGET_RELEASE_PERMISSIONS__: "{ contents: write }",
  __TARGET_RERUNNABLE_RELEASE_COMMAND_CONSUMING_CHANGESETS_VERSIONS__: "bun run release-owner",
  __TARGET_REVIEWED_PRODUCTION_HANDOFF_COMMAND__: "bun run production-handoff",
  __TARGET_RUNNER__: "ubuntu-latest",
  __TARGET_RUN_RELEASE_INTENT_VALIDATION__:
    "!(github.event.pull_request.user.login == 'github-actions[bot]' || contains(github.event.pull_request.labels.*.name, 'owner-approved-release-intent-exception'))",
  __TARGET_SELECTED_RELEASE_PATH__: "packages/released/**",
  __TARGET_SETUP_AND_INSTALL_COMMAND__: "bun install --frozen-lockfile",
  __TARGET_VALIDATE_CHANGESETS_INTENT_COMMAND__: "bun run changesets-intent",
};

async function templateSource(
  name: string,
  options: { nativePublish?: string; prereleaseGuard?: string } = {},
) {
  let source = await readFile(resolve(workflowAssets, "github-actions", name), "utf8");
  const values = {
    ...replacements,
    __TARGET_EXPLICIT_PRERELEASE_PRODUCTION_GUARD__:
      options.prereleaseGuard ?? replacements.__TARGET_EXPLICIT_PRERELEASE_PRODUCTION_GUARD__,
  };
  for (const [placeholder, value] of Object.entries(values)) {
    source = source.replaceAll(placeholder, value);
  }
  source = source.replace(
    "          # __TARGET_NATIVE_PUBLISH_INPUT_OR_EMPTY__",
    options.nativePublish ? "          publish: " + options.nativePublish : "",
  );
  expect(source.match(/__TARGET_[A-Z0-9_]+__/g) ?? []).toEqual([]);
  return source;
}

type MaterializedWorkflows = {
  contract: string;
  custom: string;
  directory: string;
  intent: string;
  native: string;
  production: string;
  release: string;
};

async function materializeWorkflows(
  owner: OwnerKind,
  options: { concurrencyScope?: "job" | "workflow"; nativePublish?: string } = {},
): Promise<MaterializedWorkflows> {
  const directory = await mkdtemp(resolve(tmpdir(), "release-with-changesets-workflows-"));
  temporaryDirectories.push(directory);

  const intent = resolve(directory, "intent.yml");
  const native = resolve(directory, "native.yml");
  const custom = resolve(directory, "custom.yml");
  const production = resolve(directory, "production.yml");
  const release = owner === "native" ? native : custom;
  const contract = resolve(directory, "workflow-contract.json");

  const intentSource = (await templateSource("release-intent.yml")).replace(
    /^  release-intent:/m,
    "  intent-check-42:",
  );
  const nativeSource = (
    await templateSource("native-changesets-release.yml", {
      nativePublish: options.nativePublish,
    })
  )
    .replace(/^  release:/m, "  owner-task-alpha:")
    .replace(/^  manual-dry-run:/m, "  inspect-release-beta:")
    .replace(
      "github.event_name == 'push' &&\n      github.ref == 'refs/heads/main'",
      "github.ref == 'refs/heads/main' &&\n      github.event_name == 'push'",
    );
  const customSource = (await templateSource("custom-release-owner.yml"))
    .replace(/^  release:/m, "  owner-task-alpha:")
    .replace(/^  manual-dry-run:/m, "  inspect-release-beta:");
  const productionSource = await templateSource("production-handoff-on-release.yml");

  await Promise.all([
    writeFile(intent, intentSource),
    writeFile(native, nativeSource),
    writeFile(custom, customSource),
    writeFile(production, productionSource),
  ]);

  await writeFile(
    contract,
    JSON.stringify(
      {
        intent: {
          workflow: "intent.yml",
          job: "intent-check-42",
          branch: "main",
          paths: ["packages/released/**"],
          exemptionPredicates: [
            "github.event.pull_request.user.login == 'github-actions[bot]'",
            "contains(github.event.pull_request.labels.*.name, 'owner-approved-release-intent-exception')",
          ],
          validationRun: "bun run changesets-intent",
        },
        release: {
          workflow: owner === "native" ? "native.yml" : "custom.yml",
          job: "owner-task-alpha",
          branch: "main",
          concurrencyScope: options.concurrencyScope ?? "workflow",
          concurrencyGroup: "release-main",
          owner:
            owner === "native"
              ? {
                  native: {
                    action: "changesets/action@v1",
                    version: "bun run version-release",
                    publish: options.nativePublish ?? null,
                    permissions: {
                      contents: "write",
                      "pull-requests": "write",
                    },
                  },
                }
              : { customRun: "bun run release-owner" },
        },
        manual: {
          job: "inspect-release-beta",
          input: "confirmation",
          value: "RELEASE",
          run: "bun run release-dry-run",
        },
        production: {
          workflow: "production.yml",
          job: "production-handoff",
          prereleaseGuard: "github.event.release.prerelease == false",
        },
      },
      null,
      2,
    ),
  );

  return { contract, custom, directory, intent, native, production, release };
}

async function verifyFallback(workflows: MaterializedWorkflows) {
  return command("node", ["--test", checker], workflows.directory, {
    CHANGESETS_WORKFLOW_CONTRACT: workflows.contract,
  });
}

async function replaceWorkflowText(workflow: string, from: string, to: string) {
  const source = await readFile(workflow, "utf8");
  expect(source).toContain(from);
  await writeFile(workflow, source.replace(from, to));
}

test("workflow templates support version PR-only and selected registry publication shapes", async () => {
  const intent = await templateSource("release-intent.yml");
  const versionOnly = await templateSource("native-changesets-release.yml");
  const registryPublication = await templateSource("native-changesets-release.yml", {
    nativePublish: "bun run publish-registry",
  });
  const custom = await templateSource("custom-release-owner.yml");
  const production = await templateSource("production-handoff-on-release.yml", {
    prereleaseGuard:
      "github.event.release.prerelease == true && github.event.repository.fork == false",
  });

  const versionDocument = parseDocument(versionOnly);
  const registryDocument = parseDocument(registryPublication);
  expect(versionDocument.errors).toEqual([]);
  expect(registryDocument.errors).toEqual([]);
  expect(versionOnly).not.toContain("publish:");
  expect(registryPublication).toContain("publish: bun run publish-registry");
  expect(intent).toContain("permissions:\n  contents: read");
  expect(intent).toContain("persist-credentials: false");
  expect(versionOnly).toContain("permissions:\n  contents: write\n  pull-requests: write");
  expect(custom).toContain("run: bun run release-dry-run");
  expect(custom).toContain("github.event_name == 'push'");
  expect(production).toContain("github.event.release.prerelease == true");
  expect(production).toContain("permissions:\n  contents: read");
  expect(
    await readFile(
      resolve(workflowAssets, "github-actions", "production-handoff-on-release.yml"),
      "utf8",
    ),
  ).toContain("github.event.release.prerelease == false");
});

test.each(["native", "custom"] as const)(
  "workflow-shape fallback validates a renamed %s owner through the JSON contract",
  async (owner) => {
    const workflows = await materializeWorkflows(owner);
    await expect(verifyFallback(workflows)).resolves.toMatchObject({ stderr: "" });
  },
);

test("workflow-shape fallback rejects a missing intent validation run", async () => {
  const workflows = await materializeWorkflows("native");
  await replaceWorkflowText(
    workflows.intent,
    "bun run changesets-intent",
    "bun run unrelated-check",
  );

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback rejects false and advisory intent validation", async () => {
  const falseIntent = await materializeWorkflows("native");
  await replaceWorkflowText(
    falseIntent.intent,
    "!(github.event.pull_request.user.login == 'github-actions[bot]' || contains(github.event.pull_request.labels.*.name, 'owner-approved-release-intent-exception'))",
    "false",
  );
  await expect(verifyFallback(falseIntent)).rejects.toThrow();

  const advisoryIntent = await materializeWorkflows("native");
  await replaceWorkflowText(
    advisoryIntent.intent,
    "run: bun run changesets-intent",
    "run: bun run changesets-intent\n        continue-on-error: true",
  );
  await expect(verifyFallback(advisoryIntent)).rejects.toThrow();
});

test("workflow-shape fallback rejects a branch bypass and wrong concurrency scope", async () => {
  const branchBypass = await materializeWorkflows("native");
  await replaceWorkflowText(
    branchBypass.native,
    "github.ref == 'refs/heads/main' &&\n      github.event_name == 'push'",
    "github.ref == 'refs/heads/main' ||\n      github.event_name == 'push'",
  );
  await expect(verifyFallback(branchBypass)).rejects.toThrow();

  const wrongScope = await materializeWorkflows("native", { concurrencyScope: "job" });
  await expect(verifyFallback(wrongScope)).rejects.toThrow();
});

test("workflow-shape fallback rejects absent, moved, and duplicate declared native owners", async () => {
  const absent = await materializeWorkflows("native");
  await replaceWorkflowText(
    absent.native,
    "uses: changesets/action@v1",
    "uses: changesets/action@v2",
  );
  await expect(verifyFallback(absent)).rejects.toThrow();

  const moved = await materializeWorkflows("native");
  await replaceWorkflowText(moved.native, "uses: changesets/action@v1", "uses: actions/cache@v4");
  await writeFile(
    moved.native,
    (await readFile(moved.native, "utf8")) +
      "\n  hidden-owner:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: changesets/action@v1\n",
  );
  await expect(verifyFallback(moved)).rejects.toThrow();

  const duplicate = await materializeWorkflows("native");
  await replaceWorkflowText(
    duplicate.native,
    "          version: bun run version-release",
    "          version: bun run version-release\n      - uses: changesets/action@v1",
  );
  await expect(verifyFallback(duplicate)).rejects.toThrow();
});

test("workflow-shape fallback rejects a wrong exact custom owner run", async () => {
  const workflows = await materializeWorkflows("custom");
  await replaceWorkflowText(
    workflows.custom,
    "run: bun run release-owner",
    "run: bun run another-owner",
  );

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback rejects missing and bypassed manual confirmation", async () => {
  const missing = await materializeWorkflows("native");
  await replaceWorkflowText(missing.native, "required: true", "required: false");
  await expect(verifyFallback(missing)).rejects.toThrow();

  const bypassed = await materializeWorkflows("native");
  await replaceWorkflowText(
    bypassed.native,
    "inputs.confirmation == 'RELEASE'",
    "inputs.confirmation == 'RELEASE' || github.actor == 'unreviewed'",
  );
  await expect(verifyFallback(bypassed)).rejects.toThrow();
});

test("workflow-shape fallback requires a declared manual shape for workflow dispatch", async () => {
  const workflows = await materializeWorkflows("native");
  const contract = (await json(workflows.contract)) as Record<string, unknown>;
  delete contract.manual;
  await writeFile(workflows.contract, JSON.stringify(contract, null, 2));

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback requires a push-only, branch-scoped release owner", async () => {
  const nonPushOwner = await materializeWorkflows("native");
  await replaceWorkflowText(
    nonPushOwner.native,
    "github.ref == 'refs/heads/main' &&\n      github.event_name == 'push'",
    "github.ref == 'refs/heads/main' &&\n      github.event_name != 'workflow_dispatch'",
  );
  await expect(verifyFallback(nonPushOwner)).rejects.toThrow();

  const extraTrigger = await materializeWorkflows("native");
  await replaceWorkflowText(
    extraTrigger.native,
    "  workflow_dispatch:",
    "  schedule:\n    - cron: '0 0 * * *'\n  workflow_dispatch:",
  );
  await expect(verifyFallback(extraTrigger)).rejects.toThrow();
});

test("workflow-shape fallback rejects conditional required intent, owner, and dry-run steps", async () => {
  const conditionalIntent = await materializeWorkflows("native");
  await replaceWorkflowText(
    conditionalIntent.intent,
    "run: bun run changesets-intent",
    "run: bun run changesets-intent\n        if: github.event_name == 'pull_request'",
  );
  await expect(verifyFallback(conditionalIntent)).rejects.toThrow();

  const conditionalOwner = await materializeWorkflows("native");
  await replaceWorkflowText(
    conditionalOwner.native,
    "uses: changesets/action@v1\n        with:",
    "uses: changesets/action@v1\n        if: github.event_name == 'push'\n        with:",
  );
  await expect(verifyFallback(conditionalOwner)).rejects.toThrow();

  const conditionalDryRun = await materializeWorkflows("native");
  await replaceWorkflowText(
    conditionalDryRun.native,
    "run: bun run release-dry-run",
    "run: bun run release-dry-run\n        if: github.event_name == 'workflow_dispatch'",
  );
  await expect(verifyFallback(conditionalDryRun)).rejects.toThrow();
});

test("workflow-shape fallback requires every present release concurrency scope to be non-cancellable", async () => {
  const workflows = await materializeWorkflows("native");
  await replaceWorkflowText(
    workflows.native,
    "    runs-on: ubuntu-latest\n    steps:",
    "    concurrency:\n      group: owner-task\n      cancel-in-progress: true\n    runs-on: ubuntu-latest\n    steps:",
  );

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback requires the configured production prerelease guard", async () => {
  const workflows = await materializeWorkflows("native");
  await replaceWorkflowText(
    workflows.production,
    "(github.event.release.prerelease == false)",
    "(github.event.release.draft == false)",
  );

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback validates native version and publication inputs from the contract", async () => {
  const registryPublication = await materializeWorkflows("native", {
    nativePublish: "bun run publish-registry",
  });
  await expect(verifyFallback(registryPublication)).resolves.toMatchObject({ stderr: "" });

  const unexpectedPublish = await materializeWorkflows("native");
  await replaceWorkflowText(
    unexpectedPublish.native,
    "          version: bun run version-release",
    "          version: bun run version-release\n          publish: bun run unexpected-publish",
  );
  await expect(verifyFallback(unexpectedPublish)).rejects.toThrow();

  const wrongPublish = await materializeWorkflows("native", {
    nativePublish: "bun run publish-registry",
  });
  await replaceWorkflowText(
    wrongPublish.native,
    "publish: bun run publish-registry",
    "publish: bun run another-publish",
  );
  await expect(verifyFallback(wrongPublish)).rejects.toThrow();

  const wrongVersion = await materializeWorkflows("native");
  await replaceWorkflowText(
    wrongVersion.native,
    "version: bun run version-release",
    "version: bun run another-version",
  );
  await expect(verifyFallback(wrongVersion)).rejects.toThrow();
});

test("workflow-shape fallback rejects a broad actor exemption predicate", async () => {
  const workflows = await materializeWorkflows("native");
  const contract = (await json(workflows.contract)) as {
    intent: { exemptionPredicates: string[] };
  };
  contract.intent.exemptionPredicates[0] = "github.actor == 'github-actions[bot]'";
  await writeFile(workflows.contract, JSON.stringify(contract, null, 2));

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback accepts simple flow-style trigger lists", async () => {
  const workflows = await materializeWorkflows("native");
  const intent = await readFile(workflows.intent, "utf8");
  const release = await readFile(workflows.native, "utf8");

  await writeFile(
    workflows.intent,
    intent
      .replace(/branches:\n\s+- main/, "branches: [main]")
      .replace(
        /paths:\n\s+- \.changeset\/\*\*\n\s+- packages\/released\/\*\*/,
        "paths: [.changeset/**, packages/released/**]",
      ),
  );
  await writeFile(workflows.native, release.replace(/branches:\n\s+- main/, "branches: [main]"));

  await expect(verifyFallback(workflows)).resolves.toMatchObject({ stderr: "" });
});

test("workflow-shape fallback requires the native version contract input", async () => {
  const workflows = await materializeWorkflows("native");
  const contract = (await json(workflows.contract)) as {
    release: { owner: { native: Record<string, unknown> } };
  };
  delete contract.release.owner.native.version;
  await writeFile(workflows.contract, JSON.stringify(contract, null, 2));

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback exact-matches native permissions and stable concurrency group", async () => {
  const wrongPermissions = await materializeWorkflows("native");
  await replaceWorkflowText(wrongPermissions.native, "pull-requests: write", "pull-requests: read");
  await expect(verifyFallback(wrongPermissions)).rejects.toThrow();

  const dynamicGroup = await materializeWorkflows("native");
  await replaceWorkflowText(
    dynamicGroup.native,
    "group: release-main",
    "group: release-" + "$" + "{{ github.run_id }}",
  );
  await expect(verifyFallback(dynamicGroup)).rejects.toThrow();

  const selfDeclaredDynamicGroup = await materializeWorkflows("native");
  const dynamicContract = (await json(selfDeclaredDynamicGroup.contract)) as {
    release: { concurrencyGroup: string };
  };
  dynamicContract.release.concurrencyGroup = "release-" + "$" + "{{ github.run_id }}";
  await writeFile(selfDeclaredDynamicGroup.contract, JSON.stringify(dynamicContract, null, 2));
  await replaceWorkflowText(
    selfDeclaredDynamicGroup.native,
    "group: release-main",
    "group: release-" + "$" + "{{ github.run_id }}",
  );
  await expect(verifyFallback(selfDeclaredDynamicGroup)).rejects.toThrow();

  const jobPermissionOverride = await materializeWorkflows("native");
  await replaceWorkflowText(
    jobPermissionOverride.native,
    "  owner-task-alpha:\n    if:",
    "  owner-task-alpha:\n    permissions:\n      contents: read\n    if:",
  );
  await expect(verifyFallback(jobPermissionOverride)).rejects.toThrow();
});

test("workflow-shape fallback rejects a branch-only generated-version exemption", async () => {
  const workflows = await materializeWorkflows("native");
  const contract = (await json(workflows.contract)) as {
    intent: { exemptionPredicates: string[] };
  };
  contract.intent.exemptionPredicates[0] =
    "github.event.pull_request.head.ref == 'changesets-release'";
  await writeFile(workflows.contract, JSON.stringify(contract, null, 2));

  await expect(verifyFallback(workflows)).rejects.toThrow();
});

test("workflow-shape fallback accepts simple flow maps for native inputs and permissions", async () => {
  const workflows = await materializeWorkflows("native");
  await replaceWorkflowText(
    workflows.native,
    "permissions:\n  contents: write\n  pull-requests: write",
    "permissions: { contents: write, pull-requests: write }",
  );
  await replaceWorkflowText(
    workflows.native,
    "        with:\n          version: bun run version-release",
    "        with: { version: bun run version-release }",
  );

  await expect(verifyFallback(workflows)).resolves.toMatchObject({ stderr: "" });
});
