from __future__ import annotations

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


if __name__ == "__main__":
    unittest.main()
