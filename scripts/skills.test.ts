import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, expect, test } from "vitest";

import { bundle, names, root, validateSkill } from "./skills";

const temporary: string[] = [];
afterEach(async () => {
  await Promise.all(temporary.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});
async function isolatedSkill() {
  const destination = await mkdtemp(resolve(tmpdir(), "ybtam-skill-test-"));
  temporary.push(destination);
  await cp(resolve(root, "skills/setup-repo"), destination, { recursive: true });
  return destination;
}

test("all published skills have current bundled references", async () => {
  await expect(bundle(root, true)).resolves.toBeUndefined();
});

test.each(names)("%s resolves its references after an isolated copy", async (name) => {
  const destination = await mkdtemp(resolve(tmpdir(), "ybtam-skill-test-"));
  temporary.push(destination);
  await cp(resolve(root, "skills", name), destination, { recursive: true });
  expect(await validateSkill(destination)).toMatchObject({ name });
});

test("missing transitive references fail validation", async () => {
  const destination = await isolatedSkill();
  await rm(resolve(destination, "references/state.md"));
  await expect(validateSkill(destination)).rejects.toThrow();
});

test("references cannot escape the installed skill", async () => {
  const destination = await isolatedSkill();
  const file = resolve(destination, "SKILL.md");
  await writeFile(file, `${await readFile(file, "utf8")}\n[hidden dependency](../standards.md)\n`);
  await expect(validateSkill(destination)).rejects.toThrow("escapes installed skill");
});
