// src/extension.js
const vscode = require('vscode');
const { formatter } = require('./formatting/formatterProvider');
const { foldingProvider } = require('./folding/foldingProvider');
const { completionProvider } = require('./completion/completionProvider');
const snippets = require('./completion/snippets');

async function activate(context) {
    const htmlExtension = vscode.extensions.getExtension('vscode.html-language-features');
    if (htmlExtension) await htmlExtension.activate();

    snippets.init(context.extensionPath);

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('html', formatter),
        vscode.languages.registerDocumentFormattingEditProvider('jinja-html', formatter),
        vscode.languages.registerDocumentFormattingEditProvider('jinja', formatter),
        vscode.languages.registerFoldingRangeProvider('html', foldingProvider),
        vscode.languages.registerFoldingRangeProvider('jinja-html', foldingProvider),
        vscode.languages.registerFoldingRangeProvider('jinja', foldingProvider),
        vscode.languages.registerCompletionItemProvider('html', completionProvider, ' ', '|', '.'),
        vscode.languages.registerCompletionItemProvider('jinja-html', completionProvider, ' ', '|', '.'),
        vscode.languages.registerCompletionItemProvider('jinja', completionProvider, ' ', '|', '.')
    );

    const htmlEditorConfig = vscode.workspace.getConfiguration('editor', { languageId: 'html' });
    if (!htmlEditorConfig.get('defaultFormatter')) {
        await htmlEditorConfig.update('defaultFormatter', 'BachiMjavanadze.jinja-py', vscode.ConfigurationTarget.Global, true);
    }
}

module.exports = { activate };
