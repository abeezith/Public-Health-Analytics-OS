# Public Health Analytics-OS backup register

This register records recoverable checkpoints created before material roadmap execution. Backup creation does not alter the published site.

## Backup `PHAOS-BACKUP-2026-10-12-01`

| Field | Value |
|---|---|
| Purpose | Pre-roadmap execution checkpoint |
| Created | 12 October 2026 |
| Source commit | `1ff44d505664ad836b19fad174176263c4ac0ce6` |
| Source branch/deployment | `main`; successful GitHub Pages run `38280142353` |
| Remote recovery tag | `backup/pre-roadmap-2026-10-12` |
| Local archive | `E:\Resources\SecondBrain\outputs\backups\Public-Health-Analytics-OS\Public-Health-Analytics-OS-1ff44d5-pre-roadmap-2026-10-12.zip` |
| Archive format | Git ZIP archive of the tracked tree |
| Archive size | 8,897,770 bytes |
| Archive entries | 195 |
| SHA-256 | `09f5a3a0cdbce4d57f42ca5033938a537b2816e5e6cdfc6a6a3fce06b9b90c5b` |
| Verification | ZIP opened successfully; root `index.html` and `roadmap/index.html` present; remote tag push succeeded |

## Recovery routes

Preferred recovery is non-destructive: create a new branch or worktree from the backup tag, inspect it, and only then choose a deployment action.

```text
git fetch origin tag backup/pre-roadmap-2026-10-12
git switch -c recovery/pre-roadmap-2026-10-12 backup/pre-roadmap-2026-10-12
```

The local ZIP is a second, Git-independent content snapshot. Verify its SHA-256 before use. The archive intentionally excludes Git history and ignored files; the remote tag preserves repository history.

## Backup policy

- Create a checkpoint before architecture changes, bulk metadata migration or a release that changes canonical identity.
- Record the deployed commit, deployment result, archive checksum and recovery tag.
- Never overwrite a registered archive; create a new timestamped checkpoint.
- Test recovery into a separate branch/worktree. Do not reset or overwrite the working repository as a verification method.
