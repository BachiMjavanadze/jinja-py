const vscode = require('vscode');
const beautify = require('js-beautify').html;

async function activate(context) {
    const htmlExtension = vscode.extensions.getExtension('vscode.html-language-features');
    if (htmlExtension) await htmlExtension.activate();

    const formatter = {
        provideDocumentFormattingEdits(document, options) {
            const cfg = vscode.workspace.getConfiguration('html.format');
            const insertFinalNewline = vscode.workspace.getConfiguration('files').get('insertFinalNewline', false);

            const htmlFormatted = beautify(document.getText(), {
                indent_size: options.tabSize,
                indent_with_tabs: !options.insertSpaces,
                wrap_attributes: cfg.get('wrapAttributes', 'auto'),
                wrap_line_length: cfg.get('wrapLineLength', 120),
                end_with_newline: insertFinalNewline,
                indent_inner_html: cfg.get('indentInnerHtml', false),
                preserve_newlines: cfg.get('preserveNewLines', true),
                max_preserve_newlines: cfg.get('maxPreserveNewLines', 32786),
                unformatted: cfg.get('unformatted', []),
                content_unformatted: cfg.get('contentUnformatted', ['pre', 'textarea']),
                extra_liners: cfg.get('extraLiners', ['head', 'body', '/html']),
                templating: ['django'],
            });

            const formatted = applyJinjaIndent(htmlFormatted, options.tabSize, options.insertSpaces, document.eol);
            const text = document.getText();

            return [vscode.TextEdit.replace(
                new vscode.Range(document.positionAt(0), document.positionAt(text.length)),
                formatted
            )];
        }
    };

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

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('html', formatter),
        vscode.languages.registerDocumentFormattingEditProvider('jinja-html', formatter),
        vscode.languages.registerDocumentFormattingEditProvider('jinja', formatter),
        vscode.languages.registerFoldingRangeProvider('html', foldingProvider),
        vscode.languages.registerFoldingRangeProvider('jinja-html', foldingProvider),
        vscode.languages.registerFoldingRangeProvider('jinja', foldingProvider)
    );

    const htmlEditorConfig = vscode.workspace.getConfiguration('editor', { languageId: 'html' });
    if (!htmlEditorConfig.get('defaultFormatter')) {
        await htmlEditorConfig.update('defaultFormatter', 'BachiMjavanadze.jinja-py', vscode.ConfigurationTarget.Global, true);
    }
}

function applyJinjaIndent(text, tabSize, insertSpaces, eol) {
    const unit = insertSpaces ? ' '.repeat(tabSize) : '\t';
    const lineSep = eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
    const lines = text.split(/\r\n|\n|\r/);
    const result = [];
    let level = 0;

    const reOpen = /^\{%-?\s*(block|for|if|macro|filter|with|raw)\b/;
    const reClose = /^\{%-?\s*(endblock|endfor|endif|endmacro|endfilter|endwith|endraw)\b/;
    const reMiddle = /^\{%-?\s*(elif|else|empty)\b/;
    const reJinja = /^\{[%#]/;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) { result.push(''); continue; }
        const isOpen = reOpen.test(trimmed);
        const isClose = reClose.test(trimmed);
        const isMiddle = reMiddle.test(trimmed);
        if (isClose || isMiddle) level = Math.max(0, level - 1);
        if (reJinja.test(trimmed)) {
            result.push(unit.repeat(level) + trimmed);
        } else {
            result.push(unit.repeat(level) + line);
        }
        if (isOpen || isMiddle) level++;
    }

    return result.join(lineSep);
}

module.exports = { activate };
