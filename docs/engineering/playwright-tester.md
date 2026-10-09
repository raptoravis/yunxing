## What it does

`playwright-tester` writes Playwright `.spec.ts` test files and runs them with Playwright's native runner, so the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) spends tokens once on test design and nothing on execution. It covers the whole loop: read the project, author focused test files, run them, and fix failures.

The tests are persistent. They are ordinary `.spec.ts` files that live in the repo and grow into a regression suite, not a throwaway script that disappears with the session. The agent authors them, Playwright runs them, and execution costs zero tokens no matter how many tests exist.

## When to reach for it

Type `/playwright-tester`, or the agent reaches for it automatically when a task fits: you want to test a web app, check that a frontend works, run UI tests, verify a form, do end-to-end testing, or confirm recent changes did not break anything.

Reach for it when you want the browser exercised by a real test runner. For a concrete unit-level behaviour, use [tdd](https://aihero.dev/skills-tdd) instead; for a bug that resists a first glance, use [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs).

## Prerequisites

The project needs Playwright installed (`@playwright/test` plus a browser, usually `npx playwright install chromium`) and, where the app needs a dev server, a `playwright.config.ts` with a `webServer` entry. The skill checks for these and sets them up on first use.

## Author once, run free

The central trade it makes is between three ways of doing browser testing: drive the browser live (tokens on every click), screenshot it (images are token-heavy and single-threaded), or write tests and let Playwright run them. It always chooses the third.

Failures feed a fix loop. Each one is labelled a **test bug** (wrong selector, timing, wrong expected value) or an **app bug** (the application is actually broken), and only the right side gets fixed: test bugs patch the `.spec.ts` file, app bugs patch the application. It stops after three attempts instead of burning cycles.

## Common questions

**Does it drive the browser itself?**

No. It writes `.spec.ts` files and runs them through `npx playwright test`. The agent's intelligence goes into test design; the execution is Playwright's, and it is free.

**How is it different from `/tdd`?**

`tdd` is the unit-level red-green loop at a pre-agreed seam. `playwright-tester` is browser-level verification of what a user can actually do, and it does not drive implementation test-first.

## It's working if

- Persistent `.spec.ts` files appear under `tests/` or `e2e/` and survive the session.
- Each failure is labelled a test bug or an app bug, and only the right side is fixed.
- The rerun command and its output are reported even when everything passes.
- A focused suite of a handful of meaningful tests lands rather than dozens of trivial ones.

## Where it fits

`playwright-tester` is a reach-for-it-anytime standalone: it sits beside the build chain rather than inside it, and you use it whenever the question is "does this frontend actually work". Its neighbours are [tdd](https://aihero.dev/skills-tdd) (unit-level behaviour) and [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) (the loop for a hard bug). When you are unsure which skill fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
