# Applied standards and attempts

## Release record

`areas.release.status` records the release decision/configuration state, not the generic run state. For `declined` or `deferred`, preserve an existing `areas.release.version` or omit it when none exists; do not record a new successful baseline version.

Record release setup in the relevant area of `.project-standards.json`; do not treat the installed skill version as an applied baseline version. Use a small record such as:

```json
{
  "areas": {
    "release": {
      "version": "0.2.0",
      "status": "configured",
      "checks": ["Changesets workflow verified"],
      "settings": {
        "topology": "single-root",
        "outcome": ["version-pr", "github-release"],
        "releaseOwner": "changesets",
        "registryPublication": "not-configured"
      }
    }
  }
}
```

`status` is one of `configured`, `declined`, `deferred` or `partial`. Record the applied baseline version separately from `skillVersion`. A declined or deferred answer updates only `areas.release` in the target `.project-standards.json`; it leaves package manifests, `.changeset`, workflows, credentials, registry, publishing and production configuration untouched. A partial attempt records completed checks and unresolved decisions, preserves prior successful state, and supports recovery without resetting unrelated work. Missing registry, package, access or authentication fields set `registryPublication` to `not-configured`, even when versioning or GitHub Releases are configured.

Use `.project-standards.json` in the target repo, separate from the installed skill's baseline. This is a small record, not a migration database. Git preserves history. Store no credentials. Preserve existing choices, unknown fields and successful area versions. If schemaVersion is newer than supported, inspect and report before rewriting.

When installing upstream skills, an optional `installedSkills` map records each skill's repository, immutable revision, and source path. Preserve existing provenance. See [integrations.md](integrations.md) for revision verification; installer content hashes alone are not revision provenance.

Example shape (illustrative partial state, not a template claiming successful checks):

```json
{
  "schemaVersion": 1,
  "baselineVersion": "0.1.0",
  "choices": { "runtime": "bun", "review": "plannotator" },
  "areas": { "agents": { "version": "0.1.0", "checks": ["agent discovery passed"] } },
  "lastRun": {
    "skill": "adopt-standards",
    "skillVersion": "0.1.0",
    "targetVersion": "0.1.0",
    "areas": ["agents", "tooling"],
    "status": "partial",
    "checks": [{ "name": "database tests", "status": "failed" }],
    "unresolved": ["Database migration requires a compatibility decision"]
  }
}
```

`baselineVersion` identifies the baseline whose choices were first recorded; it does not assert whole-project currency. `areas` is authoritative for successful applied versions. `lastRun.targetVersion` records the desired version. Track structure, tooling (including data dependency migrations), verification, agents and delivery as relevant. Do not create successful entries for untouched or inapplicable areas.

Before applying changes record the attempt with status `running`, preserving prior success. Finish as `complete`, `partial`, or `blocked` with actual checks and unresolved items. An area advances only after its required checks pass. Unavailable verification is not a pass. A failed migration must not replace its last successful version. Preserve partial edits and explain recovery; do not reset unrelated work.

For updates compare actual files and recorded choices with the bundled baseline. Unknown versions, missing state or drift require investigation, not a guessed upgrade. Prefer direct migration to latest when prerequisites allow it. Read [migrations.md](migrations.md) for supported history. Skill version and applied standards version are distinct: installing new instructions does not migrate the project.
