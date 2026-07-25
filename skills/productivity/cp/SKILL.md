---
name: cp
description: Commit all changes, push, and handle remote-ahead / merge-conflict scenarios automatically.
disable-model-invocation: true
---

# cp — commit & push

Commit all current changes and push to the remote. If the remote has moved ahead, pull and merge first. If merge conflicts arise, resolve them, then push.

## 1. Check the current state

Run `git status` to see what's staged, unstaged, and untracked. Run `git diff --stat` and `git diff --cached --stat` to understand the scope of changes. If there is nothing to commit, stop here and tell the user.

## 2. Stage everything

Stage all changes (tracked and untracked) with `git add -A`.

## 3. Commit

Generate a concise, single-line commit message in the repo's prevailing style. Base it on `git diff --cached` content — summarize the *what*, not the *how*. If the change is too broad for one line, ask the user for the commit message.

Run `git commit -m "<message>"`.

## 4. Push

Run `git push origin <current-branch>`.

### 4a. Push succeeds

Done. Report the commit hash and branch to the user.

### 4b. Push rejected — remote is ahead

`git` will report that the remote contains work you do not have locally. Proceed to step 5.

## 5. Pull & merge

Run `git pull origin <current-branch>` (or `git pull --rebase origin <current-branch>` if the repo uses rebase-by-default — check `git config pull.rebase`).

### 5a. Merge succeeds (no conflicts)

Go back to step 4 and push.

### 5b. Merge conflicts

`git` will report conflicted files and leave the repo in a merging state. Proceed to step 6.

## 6. Resolve conflicts

Follow the `/resolving-merge-conflicts` discipline:

1. List the conflicted files with `git diff --name-only --diff-filter=U`.
2. For each conflicted file, read the conflict markers and understand **both sides' intent** — check `git log` for the commits that introduced each side.
3. Resolve each hunk, preserving both intents where possible. Where incompatible, pick the one that matches the merge's goal and note the trade-off. Do **not** invent new behaviour.
4. Stage the resolved files with `git add <file>`.
5. Once all conflicts are resolved, run the project's automated checks (typecheck, tests, lint) and fix anything the merge broke.
6. Complete the merge with `git commit` (or `git rebase --continue` if rebasing).

## 7. Push after merge

Go back to step 4 and push. If push fails again (unlikely but possible in high-churn repos), repeat from step 5.
