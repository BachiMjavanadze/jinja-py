// src/completion/context.js
const vscode = require('vscode');

function detectJinjaContext(document, position) {
    const offset = document.offsetAt(position);
    const WINDOW = 10000;
    const startPos = document.positionAt(Math.max(0, offset - WINDOW));
    const text = document.getText(new vscode.Range(startPos, position));

    for (let i = text.length - 1; i > 0; i--) {
        const c = text[i];
        const prev = text[i - 1];

        if (c === '}' && (prev === '%' || prev === '}' || prev === '#')) {
            return { kind: 'text', after: '' };
        }
        if (prev === '{' && (c === '%' || c === '{' || c === '#')) {
            const after = text.substring(i + 1);
            if (c === '%') return { kind: 'statement', after };
            if (c === '{') return { kind: 'expression', after };
            if (c === '#') return { kind: 'comment', after };
        }
    }
    return { kind: 'text', after: '' };
}

module.exports = { detectJinjaContext };
