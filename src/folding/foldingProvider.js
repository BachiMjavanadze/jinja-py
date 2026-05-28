// src/folding/foldingProvider.js
const vscode = require('vscode');

const foldingProvider = {
    provideFoldingRanges(document) {
        const ranges = [];
        const stack = [];
        const openRe = /\{%-?\s*(block|for|if|macro|filter|with|raw)\b/;
        const closeRe = /\{%-?\s*end(block|for|if|macro|filter|with|raw)\b/;

        for (let i = 0; i < document.lineCount; i++) {
            const text = document.lineAt(i).text;
            const hasOpen = openRe.test(text);
            const hasClose = closeRe.test(text);

            if (hasOpen && !hasClose) {
                stack.push(i);
            } else if (hasClose && !hasOpen) {
                const start = stack.pop();
                if (start !== undefined && start < i) {
                    ranges.push(new vscode.FoldingRange(start, i));
                }
            }
        }
        return ranges;
    }
};

module.exports = { foldingProvider };
