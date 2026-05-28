// src/typing/jinja-expand.js
/*
When the user types `%` inside a `{...}` region on a single line (any
amount of whitespace on either side, but nothing else between), replace
the whole region with `{% $0 %}` so the cursor lands at the middle space.

Examples:
  {|}          + type %  ->  {% | %}
  {   |   }    + type %  ->  {% | %}
  {  |abc  }              ->  no change (non-whitespace between braces)

Implementation: react to single-character `%` inserts via
onDidChangeTextDocument, then run editor.insertSnippet on the matched
region. Independent of the format-on-save whitespace pass.
*/
const vscode = require('vscode');

const LANGS = new Set(['jinja-html', 'jinja', 'html']);

function register(context) {
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(handle)
    );
}

function handle(e) {
    if (!LANGS.has(e.document.languageId)) return;
    if (e.contentChanges.length !== 1) return;
    const ch = e.contentChanges[0];
    if (ch.text !== '%') return;
    if (!ch.range.isEmpty) return; // must be an insertion, not replacement

    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== e.document) return;

    const line = ch.range.start.line;
    const col = ch.range.start.character + 1; // cursor position after the %
    const lineText = e.document.lineAt(line).text;
    const before = lineText.slice(0, col - 1);
    const after = lineText.slice(col);

    const leftMatch = before.match(/\{(\s*)$/);
    if (!leftMatch) return;
    const rightMatch = after.match(/^(\s*)\}/);
    if (!rightMatch) return;

    const startCol = before.length - leftMatch[0].length;
    const endCol = col + rightMatch[0].length;
    const range = new vscode.Range(line, startCol, line, endCol);

    // Defer so the user's keystroke edit is fully committed first.
    setImmediate(() => {
        editor.insertSnippet(new vscode.SnippetString('{% $0 %}'), range);
    });
}

module.exports = { register };
