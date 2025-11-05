Contributing Guidelines

This file contains the core workflow and rules for contributing to the CRM starter repo.

Branching
- Use branch names: feature/<short-description> or fix/<short-description>.
- Keep branches small and focused.

Pull Requests
- Open PRs against `main` (or the target release branch).
- Provide a short description, the problem solved, and testing notes.
- Add reviewers (at least one: Austin).
- Ensure CI passes before merging.

Commits
- Use conventional commit-style messages, e.g.:
  - feat: add customers route
  - fix: correct tests for ticket controller
  - docs: update README

Code Quality
- Run linters and formatters locally (ESLint / Prettier) before opening PRs.
- Add unit tests for new behaviors (Jest recommended for backend).

Testing & CI
- Tests must be present for critical backend behavior.
- CI runs on every PR and must pass before merging.

Definition of Done
- Code is implemented and tested.
- Relevant docs updated.
- Peer-reviewed and CI green.

Environment
- Do not commit secrets. Add values to `.env` locally and list them in `.env.example`.

Communication
- Use GitHub Issues for tracking stories and blockers.
- Short daily stand-ups (10 minutes) for sync and blockers.

If you're new to the repo: start with a small task, open a PR, ask for review, and the team will guide you.
