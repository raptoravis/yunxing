from __future__ import annotations

import argparse
import importlib.util
import sys
import unittest
from pathlib import Path
from unittest.mock import patch


SCRIPT_PATH = (
    Path(__file__).resolve().parents[1] / "scripts" / "collect_git_changes.py"
)
SPEC = importlib.util.spec_from_file_location("collect_git_changes", SCRIPT_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"Unable to load {SCRIPT_PATH}")
collect_git_changes = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = collect_git_changes
SPEC.loader.exec_module(collect_git_changes)


class CollectCommitsTests(unittest.TestCase):
    def test_excludes_merges_and_commits_without_changed_files(self) -> None:
        git_output = (
            "\x1eabc123\x1f2026-08-20\x1fAlice\x1falice@example.com"
            "\x1ffeat: useful change\x1f\nsrc/app.py\n"
            "\x1edef456\x1f2026-08-21\x1fBob\x1fbob@example.com"
            "\x1fchore: empty marker\x1f\n"
        )

        with patch.object(
            collect_git_changes, "run_git", return_value=git_output
        ) as run_git:
            commits = collect_git_changes.collect_commits(
                Path("repo"), "2026-08-01", None, 500
            )

        git_args = run_git.call_args.args[1]
        self.assertIn("--no-merges", git_args)
        self.assertEqual(["abc123"], [commit["hash"] for commit in commits])

        summary = collect_git_changes.summarize(commits)
        self.assertEqual(1, summary["commit_count"])
        self.assertEqual(1, summary["authors"][0]["commit_count"])
        self.assertEqual(100.0, summary["authors"][0]["commit_percentage"])


class ResolveWindowTests(unittest.TestCase):
    NOW = collect_git_changes.datetime(2026, 8, 26, 10, 30, 0)

    def test_last_days_1_means_last_24_hours(self) -> None:
        since, until, since_date, until_date = collect_git_changes.resolve_window(
            None, None, 1, self.NOW
        )
        self.assertEqual("2026-08-25 10:30:00", since)
        self.assertEqual("2026-08-26 10:30:00", until)
        self.assertEqual("2026-08-25", since_date)
        self.assertEqual("2026-08-26", until_date)

    def test_last_days_7_looks_back_one_week(self) -> None:
        since, until, since_date, until_date = collect_git_changes.resolve_window(
            None, None, 7, self.NOW
        )
        self.assertEqual("2026-08-19 10:30:00", since)
        self.assertEqual("2026-08-26 10:30:00", until)
        self.assertEqual("2026-08-19", since_date)

    def test_since_date_uses_midnight_start(self) -> None:
        since, until, since_date, until_date = collect_git_changes.resolve_window(
            "2026-08-01", None, None, self.NOW
        )
        self.assertEqual("2026-08-01 00:00:00", since)
        self.assertIsNone(until)
        self.assertEqual("2026-08-01", since_date)
        self.assertIsNone(until_date)

    def test_since_and_until_use_end_of_day(self) -> None:
        since, until, since_date, until_date = collect_git_changes.resolve_window(
            "2026-08-01", "2026-08-20", None, self.NOW
        )
        self.assertEqual("2026-08-01 00:00:00", since)
        self.assertEqual("2026-08-20 23:59:59", until)
        self.assertEqual("2026-08-01", since_date)
        self.assertEqual("2026-08-20", until_date)


class ParserTests(unittest.TestCase):
    def test_last_days_and_since_are_mutually_exclusive(self) -> None:
        parser = collect_git_changes.build_parser()
        with self.assertRaises(SystemExit):
            parser.parse_args(["--since", "2026-08-01", "--last-days", "1"])

    def test_last_days_parses_positive_int(self) -> None:
        parser = collect_git_changes.build_parser()
        args = parser.parse_args(["--last-days", "1"])
        self.assertEqual(1, args.last_days)
        self.assertIsNone(args.since)

    def test_positive_int_rejects_non_positive_values(self) -> None:
        for bad in ("0", "-3", "abc"):
            with self.assertRaises(argparse.ArgumentTypeError):
                collect_git_changes.positive_int(bad)
        self.assertEqual(1, collect_git_changes.positive_int("1"))


if __name__ == "__main__":
    unittest.main()
