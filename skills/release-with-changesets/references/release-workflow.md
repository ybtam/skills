# Release workflow reference

Read this after the owner confirms that release setup is intended. Inspect first, ask
only relevant questions, record answers in the target plan, and wait for that plan's
approval before installing Changesets, changing manifests, adding workflows, or adding
credentials.

## Owner decisions

| Decision | Required owner answer |
| --- | --- |
| Topology | One release unit or exact selected monorepo units; fixed, linked, and ignored groups only when explicitly named. |
| Base outcome | Version PR only, GitHub Release, registry publication, or a selected combination. |
| Registry | Registry, selected packages, access, authentication, and one rerunnable target-owned command. Missing any answer leaves publication unconfigured. |
| Channel | Stable or a named prerelease channel. A prerelease GitHub Release and prerelease registry publication are separate answers. |
| Production | Whether a separate repository-owned production handoff receives a published release. Prerelease production needs an explicit target guard; it is never inferred. |
| Access | Existing authentication and the owner-confirmed release branch. New secret or token authorization is separate. |
| Notes | Changesets changelog output, an existing changelog, or GitHub Release notes. |

Changesets coordinates selected package descriptors and changeset files. It does not
make an application deployable, invent registry metadata, or decide production
deployment. A custom release owner is exactly one approved rerunnable command that
consumes Changesets versions and safely avoids duplicate release state on a rerun.

## Workflow selection

Copy the pull-request intent template and exactly one release-owner template. The
push-triggered owner job is branch-gated, non-cancellable, and excludes manual
dispatch. The optional manual job is a separately branch-gated, explicitly confirmed,
target-owned dry run; it must not call the selected owner.

The intent template is deliberately read-only and its checkout does not retain
credentials. Its exemption policy must identify the generated version PR by its
target-owned pull-request author predicate. Any owner-approved exception label must be
governed by the target repository's label policy.

For the native action template:

- A version-PR-only outcome has no publish input. Remove the publish placeholder line.
- A selected registry outcome replaces that whole commented placeholder line with a
  publish mapping whose value is the target-owned registry command.
- The native action needs `contents: write` and `pull-requests: write` to create or
  update its version PR. Keep that pair and add any further permission only when the
  reviewed target plan requires it.
- Do not put a guessed command, registry, or package selection in either form.

The optional production template listens only for a published release. Its
prerelease-policy placeholder must become either the stable-only guard
github.event.release.prerelease == false, or an explicitly approved target guard
that includes github.event.release.prerelease == true. Do not select prerelease
production by omission. Deliberately do not add tag-format, tag-SHA, or branch-ancestry
rules to this handoff. It starts with read-only contents permission; expand that only
when the reviewed target production command needs a specific additional permission.

## Contract-driven fallback

When the target has no suitable workflow test runner, copy the bundled
workflow-shape-contract.json next to target workflow files and replace every placeholder.
It is reviewed with the target plan and contains only these variable facts:

- intent workflow, job, branch, selected paths, exact exemption predicates, and exact validation run;
- release workflow, job, branch, selected concurrency scope and stable concurrency
  group, and one selected owner: either `native` with an exact action, version input,
  `publish` set to `null` or an exact target command, and its required `contents` /
  `pull-requests` permissions, or one exact `customRun`;
- optional manual dry-run job, confirmation input/value, and exact run;
- optional separate production workflow, job, and explicit prerelease guard.

Paths resolve relative to the contract file. The owner object must contain exactly one
of `native` or `customRun`. Intent paths omit `.changeset/**` because the verifier
adds it itself. The native permissions must include `contents: write` and
`pull-requests: write`. A production prerelease guard is either
`github.event.release.prerelease == false` or an approved explicit `== true` guard.
Use:

    CHANGESETS_WORKFLOW_CONTRACT=.changesets-workflow-contract.json \
      node --test path/to/verify-workflow-shape.mjs

The Node-builtin fallback validates configured jobs and exact configured steps rather
than job IDs, step names, marker comments, guessed custom commands, or condition order.
It requires branch-scoped pushes, a reviewed stable concurrency group, a separate
reviewed manual dry run when dispatch is enabled, non-cancellable release concurrency,
non-conditional required steps, one declared owner, and the declared native
permissions/publish/version inputs. It verifies that a
production handoff listens for `release: published` and obligatorily applies its
declared prerelease guard. It makes no tag, SHA, ancestry, or hidden-logic claim.
Unlisted release logic remains a reviewed target-plan concern.

Report local fallback output separately from remote GitHub Actions, registry
publication, GitHub Release creation, and production behavior.
