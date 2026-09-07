import * as vscode from 'vscode';
import { scan } from './scanner';

let diagnostics: vscode.DiagnosticCollection;

function refresh(document: vscode.TextDocument): void {
  // Applies to any file type, unlike most of this workstream's other
  // extensions -- a leftover conflict marker can end up in any text
  // file, not just source code.
  if (document.uri.scheme !== 'file') return;

  const hits = scan(document.getText());
  const result = hits.map((hit) => {
    const range = new vscode.Range(hit.line - 1, 0, hit.line - 1, Number.MAX_SAFE_INTEGER);
    const diagnostic = new vscode.Diagnostic(
      range,
      `Leftover Git conflict marker: ${hit.label}`,
      vscode.DiagnosticSeverity.Error,
    );
    diagnostic.source = 'Merge Conflict Leftover Companion';
    return diagnostic;
  });
  diagnostics.set(document.uri, result);
}

export function activate(context: vscode.ExtensionContext): void {
  diagnostics = vscode.languages.createDiagnosticCollection('mergeConflictLeftoverCompanion');
  context.subscriptions.push(diagnostics);

  vscode.workspace.textDocuments.forEach(refresh);

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(refresh),
    vscode.workspace.onDidChangeTextDocument((event) => refresh(event.document)),
    vscode.workspace.onDidCloseTextDocument((document) => diagnostics.delete(document.uri)),
  );
}

export function deactivate(): void {
  diagnostics?.dispose();
}
