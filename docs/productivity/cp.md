Quickstart:

```bash
npx skills add raptoravis/yunxing --skill=cp
```

```bash
npx skills update cp
```

[Source](https://github.com/raptoravis/yunxing/tree/main/skills/productivity/cp)

## What it does

`cp` commits all current changes, pushes to the remote, and handles the full cascade when the remote has moved ahead — pull, merge, and conflict resolution — so you never end up in a half-finished git state. It does not stop at "push rejected"; it walks through the resolution and pushes again.

## When to reach for it

You invoke this by typing `/cp` — the agent won't reach for it on its own. Reach for this when you're done with a change and want it committed and pushed in one command, without manually stitching together `git add`, `git commit`, `git push`, `git pull`, and conflict resolution.

## The loop

`cp` runs a single loop: **commit → push → (if rejected) pull → merge → (if conflicts) resolve → push**. It repeats until the push succeeds or there is nothing left to commit. Each stage gates on the one before it — push only after commit, pull only after rejection, resolve only on conflict.

Conflict resolution follows the [`/resolving-merge-conflicts`](https://aihero.dev/skills-resolving-merge-conflicts) discipline: understand each side's intent from its commit history, resolve hunk by hunk preserving both intents where possible, run the project's checks, and complete the merge — never `--abort`.

## Where it fits

`cp` is a **reach-for-it-anytime standalone** — it wraps the git commit-push-pull cycle into one command. It pairs with [`/resolving-merge-conflicts`](https://aihero.dev/skills-resolving-merge-conflicts), which it delegates to when conflicts arise. When you're unsure which skill fits the moment, [`/ask-matt`](https://aihero.dev/skills-ask-matt) routes you.
