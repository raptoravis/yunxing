#!/usr/bin/env python3
"""
collect_git_changes.py - Gather git commit context for a report.

Usage:
    python3 collect_git_changes.py --repo /path/to/repo --since 2026-04-01
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from collections import Counter
from datetime import date, timedelta
from pathlib import Path


DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SCOPE_RE = re.compile(r"^[a-z]+(?:!)?\(([^)]+)\):")


def exact_date(value: str) -> str:
    if not DATE_RE.fullmatch(value):
        raise argparse.ArgumentTypeError(
            "Date must be exact and formatted as YYYY-MM-DD."
        )
    return value


def run_git(repo: Path, args: list[str]) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.returncode != 0:
        message = result.stderr.strip() or result.stdout.strip() or "git command failed"
        raise RuntimeError(message)
    return result.stdout


def ensure_repo(repo: Path) -> Path:
    if not repo.exists():
        raise FileNotFoundError(f"Repository path does not exist: {repo}")
    top_level = run_git(repo, ["rev-parse", "--show-toplevel"]).strip()
    if not top_level:
        raise RuntimeError(f"Unable to resolve git repository root for: {repo}")
    return Path(top_level)


def top_level_name(path: str) -> str:
    if "/" in path:
        return path.split("/", 1)[0]
    return path


def extract_scope(subject: str) -> str | None:
    match = SCOPE_RE.match(subject.strip())
    return match.group(1) if match else None


def collect_commits(
    repo: Path,
    since: str,
    until: str | None,
    max_commits: int,
    user: str | None = None,
) -> list[dict[str, object]]:
    args = [
        "log",
        "--reverse",
        "--date=short",
        f"--since={since} 00:00:00",
        f"--max-count={max_commits}",
        "--format=%x1e%H%x1f%ad%x1f%an%x1f%ae%x1f%s%x1f%b",
        "--name-only",
    ]
    if until:
        args.insert(4, f"--until={until} 23:59:59")
    if user:
        args.insert(4, f"--author={user}")

    output = run_git(repo, args)
    commits: list[dict[str, object]] = []

    for raw_record in output.split("\x1e"):
        raw_record = raw_record.strip()
        if not raw_record:
            continue

        lines = raw_record.splitlines()
        header = lines[0]
        parts = header.split("\x1f")
        while len(parts) < 6:
            parts.append("")
        commit_hash, commit_date, author_name, author_email, subject, body = parts[:6]
        files = [line.strip() for line in lines[1:] if line.strip()]
        scope = extract_scope(subject)

        commits.append(
            {
                "hash": commit_hash,
                "date": commit_date,
                "author": {
                    "name": author_name.strip(),
                    "email": author_email.strip(),
                },
                "subject": subject.strip(),
                "body": body.strip(),
                "scope": scope,
                "files": files,
                "top_level_paths": sorted({top_level_name(path) for path in files}),
            }
        )

    return commits


def summarize(commits: list[dict[str, object]]) -> dict[str, object]:
    files_counter: Counter[str] = Counter()
    top_level_counter: Counter[str] = Counter()
    scope_counter: Counter[str] = Counter()
    author_counter: Counter[tuple[str, str]] = Counter()

    for commit in commits:
        author = commit["author"]
        author_counter[(str(author["name"]), str(author["email"]))] += 1
        for file_path in commit["files"]:
            files_counter[file_path] += 1
            top_level_counter[top_level_name(file_path)] += 1
        scope = commit.get("scope")
        if scope:
            scope_counter[str(scope)] += 1

    return {
        "commit_count": len(commits),
        "authors": [
            {"name": name, "email": email, "commit_count": count}
            for (name, email), count in author_counter.most_common()
        ],
        "files_touched": sorted(files_counter),
        "top_level_paths": [
            {"path": path, "count": count}
            for path, count in top_level_counter.most_common()
        ],
        "scopes": [
            {"scope": scope, "count": count}
            for scope, count in scope_counter.most_common()
        ],
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Collect git commit context for a report. Dates must be "
            "exact and formatted as YYYY-MM-DD."
        )
    )
    parser.add_argument(
        "--repo",
        default=".",
        help="Path to the readable git repository. Defaults to the current directory.",
    )
    parser.add_argument(
        "--since",
        type=exact_date,
        help="Exact start date in YYYY-MM-DD. Defaults to 7 days ago.",
    )
    parser.add_argument(
        "--until",
        type=exact_date,
        help="Optional exact end date in YYYY-MM-DD.",
    )
    parser.add_argument(
        "--max-commits",
        type=int,
        default=500,
        help="Maximum number of commits to inspect. Default: 500.",
    )
    parser.add_argument(
        "--user",
        help="Filter commits to a specific author (name or email pattern). If omitted, all authors are included.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.since is None:
        args.since = (date.today() - timedelta(days=7)).isoformat()

    try:
        repo = ensure_repo(Path(args.repo).resolve())
        commits = collect_commits(repo, args.since, args.until, args.max_commits, args.user)
    except (FileNotFoundError, RuntimeError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    summary = summarize(commits)
    payload = {
        "repo_root": str(repo),
        "since": args.since,
        "until": args.until,
        **summary,
        "commits": commits,
    }
    json.dump(payload, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
