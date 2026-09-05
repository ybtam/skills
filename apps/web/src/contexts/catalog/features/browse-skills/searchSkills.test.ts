import { expect, test } from "vitest";

import { searchSkills } from "./searchSkills";

const skills = [
  { title: "setup-repo", description: "Configure agents and tooling" },
  { title: "update-dependencies", description: "Migrate package versions" },
];

test("search accepts surrounding whitespace and matches descriptions without case sensitivity", () => {
  expect(searchSkills(skills, " AGENTS ")).toEqual([skills[0]]);
  expect(searchSkills(skills, "dependencies")).toEqual([skills[1]]);
});

test("empty and unmatched queries preserve useful result behavior", () => {
  expect(searchSkills(skills, "   ")).toEqual(skills);
  expect(searchSkills(skills, "not-a-skill")).toEqual([]);
});
