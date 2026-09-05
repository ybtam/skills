# GitHub Pages deployment

Add https://ybtam.github.io/skills/ as a second hosting option for the existing static website. Keep root-path Docker hosting working.

## Scope

The repository is clean and its current website prerenders 14 pages. GitHub's Pages API returned 404: no Pages site is currently configured or visible to this account. Before enabling deployment, verify repository access and configure Pages to use GitHub Actions.

This plan approves the code changes, local verification, commit and push, Pages configuration, first deployment, and live verification. No custom domain, Harbor publication, Traefik change, or GitOps change is included.

## Implementation

1. Introduce one build-time deployment base, defaulting to `/`. For Pages use `/skills/`. Apply it consistently to Vite assets and TanStack routing using the installed version's supported configuration. Fix favicon, Markdown reference and standard-card URLs. Router links must receive the prefix once, not twice. Include the environment variable in Turborepo's build cache inputs.
2. Preserve clean static output paths in the artifact: its root index serves the repository site's root, not an extra nested skills directory. Verify prerender output mapping rather than assuming framework behavior. Add a static UTF-8 404 page with a base-aware return-to-catalog link. Keep actual generated routes directly accessible and avoid a blanket SPA fallback that hides missing pages.
3. Extend static-output checks to validate the selected deployment base, local asset and document targets, and the 404 page. Retain the current document-body and encoding regressions. Add focused tests for base-aware URL behavior where needed.
4. Extend the GitHub Actions workflow so the existing checks and root-path/Docker build still run. Build and validate the Pages variant separately, upload only the static client output using the official Pages artifact action, and deploy only successful main-branch runs or an explicit manual main-branch run. Pull requests validate without deployment. Grant Pages write and OIDC permissions only to deployment and use the github-pages environment with deployment concurrency control.
5. Document the two hosting paths. Configure Pages for Actions, commit and push the change, wait for the first deployment, and inspect the public URL.

## Files and ownership

- `apps/web/vite.config.ts`, router and URL-producing components: deployment base and routing.
- A small website URL helper only if it avoids duplicated base handling.
- Static 404 generation and `scripts/check-site.ts`: output validation.
- `turbo.json`: build environment/cache correctness.
- `.github/workflows/check.yml`: checks, artifact upload and Pages deployment.
- `README.md` and verification documentation: usage and actual results.

No changes to the published skills or personal baseline are required for this hosting choice.

## Verification

- Run lint, formatting, type checks and tests.
- Build and inspect both `/` and `/skills/` variants with separate cache identities.
- Serve the Pages artifact mounted at `/skills/`; verify catalog, a directly loaded skill page, a full standards document, search, clipboard, favicon/assets and missing-route recovery. Confirm no hydration or browser console errors.
- Recheck the default Docker build after base-path changes.
- After publishing, verify Actions success and the real Pages URL, including a deep link. Report any GitHub permission or environment gate explicitly; never call a queued deployment complete.

## Risks and handling

TanStack Start's router and asset bases can diverge or be applied twice. Validate rendered links and browser navigation, not just compilation. Base changes must invalidate cached builds. GitHub Pages may require repository permissions unavailable to this account; if configuration is blocked, finish and report the exact manual setting required. The default Docker path must remain `/`.
