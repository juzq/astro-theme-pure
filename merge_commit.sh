#!/usr/bin/env bash
# merge_commit.sh — Squash the last N git commits into a single commit.
# Cross-platform: Linux, macOS, Windows (Git Bash / WSL).
#
# Usage:
#   ./merge_commit.sh <count> <message>
#
# Examples:
#   ./merge_commit.sh 5 "Squash feature work"
#   ./merge_commit.sh 3 Initial combined commit
#
# Notes:
#   * <message> can be quoted or unquoted; all args after <count> are joined
#     with a single space.
#   * This rewrites local history. If the squashed commits were already
#     pushed, run `git push --force-with-lease` afterwards.

set -euo pipefail

# --- sanity checks ---------------------------------------------------------

if ! command -v git >/dev/null 2>&1; then
    echo "Error: git is not installed or not on PATH" >&2
    exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Error: current directory is not inside a git repository" >&2
    exit 1
fi

if [ $# -lt 2 ]; then
    cat >&2 <<EOF
Usage: $0 <count> <message>

  <count>   Number of recent commits to squash (must be a positive integer)
  <message> New commit message. Quote it if it contains spaces.
EOF
    exit 1
fi

count="$1"
shift
message="$*"

# Validate count: positive integer
if ! [[ "$count" =~ ^[1-9][0-9]*$ ]]; then
    echo "Error: <count> must be a positive integer, got: '$count'" >&2
    exit 1
fi

# Check that <count> is not larger than the number of existing commits.
total="$(git rev-list --count HEAD)"
if [ "$count" -gt "$total" ]; then
    echo "Error: HEAD has only $total commits, cannot squash $count." >&2
    exit 1
fi

# --- confirm ---------------------------------------------------------------

echo "About to squash the last $count commits into one:"
git log --pretty=format:'  %h %s' -n "$count"
echo
echo
echo "New commit message: $message"
echo

# Skip the prompt when stdin is not a TTY (CI / piped invocation)
if [ -t 0 ]; then
    read -r -p "Proceed? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# --- squash ----------------------------------------------------------------

# When <count> equals the total number of commits, there is no parent to
# reset to. Use the plumbing command `git commit-tree` to forge a new
# root commit with HEAD's tree, then point HEAD at it. This works on every
# git version (unlike `git reset --root`, which only landed in 2.33).
if [ "$count" -eq "$total" ]; then
    new_sha=$(printf '%s\n' "$message" | git commit-tree HEAD^{tree} -F -)
    git reset --soft "$new_sha"
else
    git reset --soft "HEAD~$count"
    git commit -m "$message"
fi

echo
echo "Done. New HEAD:"
git log --pretty=format:'  %h %s' -n 1
echo
echo
echo "Note: if the squashed commits were already pushed, run:"
echo "  git push --force-with-lease"