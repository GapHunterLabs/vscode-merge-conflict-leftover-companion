# Merge Conflict Leftover Companion (VS Code)

Find leftover Git conflict markers (`<<<<<<<`, `|||||||`, `=======`,
`>>>>>>>`) accidentally committed in any file — no data leaves your
editor.

**v0.1, pilot.** Part of the Gap Hunter Labs VS Code workstream,
ported from the IntelliJ-family `merge-conflict-leftover-companion`.
The distinct problem this catches: not an *active* unresolved merge
(VS Code's own source control view already flags that in red) but a
merge that was already resolved and committed, with the markers
themselves accidentally left in the file — a real, recurring mistake.

## What it does

Flags all 4 marker shapes live in any file, as you edit:

- `<<<<<<<` (conflict start)
- `|||||||` (the diff3/zdiff3 common-ancestor section — the shape
  scanners that only know the classic 3-way style miss)
- `=======` (conflict separator)
- `>>>>>>>` (conflict end)

**v0.1 scope, honestly noted:** any line matching these exact
7-character marker shapes is flagged, including documentation that
cites the literal marker syntax as an example — an accepted rate of
false positives, favoring catching a real leftover marker over a
fragile exclusion heuristic that could hide one.

## Privacy

See [PRIVACY.md](PRIVACY.md) — zero network calls, everything runs
against files already open in your editor.

## Development

```bash
npm install
npm run compile   # or: npm run watch
npm test
```

To build an installable package without publishing:

```bash
npx @vscode/vsce package
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
