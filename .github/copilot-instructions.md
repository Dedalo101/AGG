<!-- .github/copilot-instructions.md
     Guidance for AI coding agents working on the AGG repository.
     Keep this file short and actionable (20-50 lines). Update when test or CI patterns change.
-->

# AGG.homes — Copilot instructions (concise)

Purpose: help an automated coding agent be productive immediately when modifying this static site and its Playwright test-suite.

- Big picture
  - This is a static, multi-language website served from the repository root (index.html, `/es/`, `/nl/`). No build step is required for production — files are plain HTML/CSS/JS intended for GitHub Pages.
  - End-to-end tests live under `tests/` and use Playwright (`playwright.config.ts`) to start a local static server (`python3 -m http.server 8000`). Changes to pages should be validated by running the Playwright suite.

- Key files and entry points
  - `index.html`, `en/`, `es/`, `nl/` — primary content and language versions.
  - `js/script.js` — site JS (form validation, interactions). Inspect it for DOM selectors and form IDs referenced by tests.
  - `playwright.config.ts` — test configuration (baseURL default is `http://localhost:8000`, reporters, traces, webServer command). Use this for test expectations about server and timeouts.
  - `package.json` — npm scripts: `npm test` (Playwright), `npm run test:install`, `npm run test:ui`, `npm run test:headed`, `npm run test:debug`, `npm run test:report`, `npm run validate-setup`.
  - `tests/*.spec.ts` — examples of patterns Playwright expects: selectors for language switcher (`.lang-switcher`), link checks, title/content text assertions, and page load checks.

- Developer workflows the agent must respect
  - Running tests locally: `npm install` → `npm run test:install` → `npm test`. Playwright will start a local server via `python3 -m http.server 8000` unless `BASE_URL` is set.
  - Debugging tests: use `npm run test:headed` or `npm run test:debug`. Use `npm run test:report` to view the HTML report after failures.
  - CI considerations: `playwright.config.ts` sets retries/workers based on `CI` env; avoid long-running tests and respect `forbidOnly` behavior.

- Project-specific patterns and conventions
  - Tests rely on simple CSS selectors and visible page titles/text rather than complex page objects — keep changes to common selectors (nav, language switcher, forms) minimal or update tests accordingly.
  - Language pages use folder-per-locale (`/es/`, `/nl/`) and canonical/hreflang link elements. When adding new languages, mirror the folder + tests pattern from `/es/` and `/nl/`.
  - The test suite tolerates non-critical console errors (e.g., analytics, favicon); tests filter these out. Avoid injecting new global errors during loading.

- Concrete examples an agent can follow
  - To add a new meta tag across languages: update `index.html` and the corresponding files in `/es/index.html` and `/nl/index.html`. Then run `npm test` to validate hreflang and metadata tests (`seo-metadata.spec.ts`).
  - To change the language switcher markup: update `js/script.js` and `index.html` variants, then update selectors in `tests/language-switcher.spec.ts` if necessary.

- Limits & safety
  - Do not modify test configuration or timeout values to make failing tests pass; instead, fix the source pages or tests to reflect intended behavior.
  - Avoid network calls in tests or code that rely on external APIs during CI — tests expect a self-contained static server.

If anything in this file is unclear or you need extra examples (e.g., a failing test trace to act on), ask for the test output and I will iterate.
