// src/completion/items.js
const vscode = require('vscode');

const KIND_MAP = {
    fn: vscode.CompletionItemKind.Function,
    method: vscode.CompletionItemKind.Method,
    obj: vscode.CompletionItemKind.Variable,
    var: vscode.CompletionItemKind.Variable,
    iter: vscode.CompletionItemKind.Variable,
    list: vscode.CompletionItemKind.Variable,
    dict: vscode.CompletionItemKind.Variable,
    bool: vscode.CompletionItemKind.Variable,
    attr: vscode.CompletionItemKind.Field,
    filter: vscode.CompletionItemKind.Function,
    test: vscode.CompletionItemKind.Value,
};

function buildItems(names, detail) {
    return names.map(name => {
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
        item.detail = detail;
        return item;
    });
}

// entries: { name, kind, detail, documentation? }
function buildRichItems(entries) {
    return entries.map(e => {
        const kind = KIND_MAP[e.kind] || vscode.CompletionItemKind.Text;
        const item = new vscode.CompletionItem(e.name, kind);
        item.detail = e.detail;
        if (e.documentation) item.documentation = e.documentation;
        if (e.kind === 'fn' || e.kind === 'method') {
            item.insertText = new vscode.SnippetString(`${e.name}($0)`);
            item.command = { command: 'editor.action.triggerParameterHints', title: '' };
        }
        return item;
    });
}

module.exports = { buildItems, buildRichItems };
