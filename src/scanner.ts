/**
 * Pure text scanner -- no `vscode` dependency. Ported from the
 * IntelliJ-family merge-conflict-leftover-companion's
 * ConflictMarkerScanner (already plain regex, zero PSI dependency).
 *
 * Finds real Git merge-conflict markers (`<<<<<<<`, `|||||||`,
 * `=======`, `>>>>>>>`) left behind in a file's text -- the distinct
 * problem from an *active* unresolved merge (which VS Code's own
 * source control view already flags): a merge that was already
 * resolved and committed, but with the markers themselves
 * accidentally left in the file.
 *
 * v0.1 scope, honestly noted (same as the original): any line
 * matching these exact 7-character marker shapes is flagged,
 * including documentation that cites the literal marker syntax as an
 * example -- accepted false-positive rate, favoring recall over a
 * fragile exclusion heuristic that could hide a real leftover marker.
 */

export interface Hit {
  line: number; // 1-based
  label: string;
}

const START_MARKER = /^<{7}(?!<).*$/;
const BASE_MARKER = /^\|{7}(?!\|).*$/; // diff3/zdiff3 common-ancestor section
const MIDDLE_MARKER = /^={7}$/;
const END_MARKER = /^>{7}(?!>).*$/;

export function scan(text: string): Hit[] {
  const hits: Hit[] = [];
  text.split('\n').forEach((line, index) => {
    if (START_MARKER.test(line)) hits.push({ line: index + 1, label: '<<<<<<< (conflict start)' });
    if (BASE_MARKER.test(line)) hits.push({ line: index + 1, label: '||||||| (diff3 common-ancestor section)' });
    if (MIDDLE_MARKER.test(line)) hits.push({ line: index + 1, label: '======= (conflict separator)' });
    if (END_MARKER.test(line)) hits.push({ line: index + 1, label: '>>>>>>> (conflict end)' });
  });
  return hits;
}
