## What it does

`playwright-tester` writes Playwright `.spec.ts` test files and runs them with Playwright's native runner, so the agent spends tokens once on test design and nothing on execution. It covers the whole loop: read the project, author focused test files, run them, and fix failures.

The tests are persistent. They are ordinary `.spec.ts` files that live in the repo and grow into a regression suite, not a throwaway script that disappears with the session. The agent authors them, Playwright runs them, and execution costs zero tokens no matter how many tests exist.

## When to reach for it

Type `/playwright-tester`, or the agent reaches for it automatically when a task fits: you want to test a web app, check that a frontend works, run UI tests, verify a form, do end-to-end testing, or confirm recent changes did not break anything.

Reach for it when you want the browser exercised by a real test runner. For a concrete unit-level behaviour, write the unit test directly instead.

## Prerequisites

The project needs Playwright installed (`@playwright/test` plus a browser, usually `npx playwright install chromium`) and, where the app needs a dev server, a `playwright.config.ts` with a `webServer` entry. The skill checks for these and sets them up on first use.

## Common questions

**Does it drive the browser itself?**

No. It writes `.spec.ts` files and runs them through `npx playwright test`. The agent's intelligence goes into test design; the execution is Playwright's, and it is free.

**How is it different from unit testing?**

A unit test pins one behaviour at a pre-agreed seam. `playwright-tester` is browser-level verification of what a user can actually do, and it does not drive implementation test-first.

## It's working if

- Persistent `.spec.ts` files appear under `tests/` or `e2e/` and survive the session.
- Each failure is labelled a test bug or an app bug, and only the right side is fixed.
- The rerun command and its output are reported even when everything passes.
- A focused suite of a handful of meaningful tests lands rather than dozens of trivial ones.
