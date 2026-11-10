# Security policy

## Scope

This repository builds a static website. It has no backend, no database, no user
accounts and no secrets. The realistic risks are therefore:

- a vulnerable or malicious dependency in the build toolchain;
- a weakness in the response headers or the Content Security Policy
  (`public/_headers`, `docs/DEPLOYMENT.md`);
- content injection through the one external data source, the GitHub snapshot;
- a compromised GitHub Actions workflow.

## Reporting a vulnerability

Please do not open a public issue. Use
[GitHub's private vulnerability reporting](https://github.com/AlexandreZanata/MeuPortifolio/security/advisories/new)
and include what you found, how to reproduce it and what you think the impact is.

You can expect an acknowledgement within a week. Fixes for confirmed problems are
released as soon as they are ready, and you will be credited unless you prefer otherwise.

## Supported versions

Only the `main` branch, which is what is deployed.

## How the project limits risk

- Three production dependencies (`next`, `react`, `react-dom`); everything else is build
  tooling. Dependabot proposes updates weekly, and the lockfile is committed.
- CI runs with read-only repository permissions. The one workflow that writes (the
  snapshot refresh) can only push its own branch and open a pull request.
- No secrets are stored in the repository or required by the build.
- External data is validated field by field before it is stored and again when it is
  loaded, and reaches the site only through a reviewed pull request.
- The site loads nothing from other origins, and its Content Security Policy forbids it.
