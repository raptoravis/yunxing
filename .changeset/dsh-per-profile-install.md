---
"yunxing": patch
---

Install the dsh bundle into every profile on the machine instead of one hardcoded profile. dsh keeps each profile in its own directory, so a session booted from a profile the bundle never reached listed no yunxing skills; the install block now loops over `$DSH_HOME/profiles`, and `.dsh/INSTALL.md` says why, alongside a one-profile form, the pinned-tag and local-link variants, and a `--dump-config` check.
