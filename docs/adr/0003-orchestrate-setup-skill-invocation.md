# Orchestrate setup skill invocation without hard dependencies

`setup-repo` installs and verifies selected project skills before requesting explicit invocation of `grill-with-docs`, then uses selected skills during the approved setup. Other baseline entrypoints conditionally evaluate `release-with-changesets` after inspection. Every entrypoint retains its bundled fallback when a supporting skill is unavailable so an installed-alone skill still works.
