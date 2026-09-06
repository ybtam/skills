# 2026-09-06 amendment: release-with-changesets baseline

This amendment preserves the original [seven-skill plan](plan.md) and its approved [review](review.json) as historical records. It extends the baseline through the separately approved [release-with-changesets plan](../2026-09-06-release-with-changesets-baseline/plan.md) and its [review result](../2026-09-06-release-with-changesets-baseline/review.json).

## Approved scope

- Baseline `0.2.0` adds `release-with-changesets` as the eighth baseline skill; the catalog now contains eight baseline skills and the specialized `tune-agent-instructions` skill, for nine skills total.
- The new skill is a target-repository workflow: after target-owner approval, it can set up Changesets and GitHub Actions release CI for selected release units.
- Release CI support is GitHub-only. It does not add Google-hosted CI or a generic deployment map.
- The collection remains GitHub-folder-distributed. This amendment does not add a root `.changeset/`, release workflow, registry credentials, publishing, tags, GitHub Releases, or production deployment.

Local evidence and non-actions are recorded in [the verification amendment](../../../docs/verification.md#baseline-amendment--2026-09-06). The approval covers this documented baseline scope only; target repositories still require their own owner decisions and approved plans before release configuration or external actions.
