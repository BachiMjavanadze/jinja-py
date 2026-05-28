// src/completion/items.js
const vscode = require('vscode');

function buildItems(names, detail) {
    return names.map(name => {
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
        item.detail = detail;
        return item;
    });
}

module.exports = { buildItems };
