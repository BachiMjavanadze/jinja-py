// src/formatting/formatterProvider.js
const vscode = require('vscode');
const beautify = require('js-beautify').html;
const { protectParagraphTags, restoreParagraphTags } = require('./paragraph-fix');
const { applyJinjaIndent } = require('./jinja-indent');
const { normalizeJinjaWhitespace } = require('./jinja-whitespace');

const formatter = {
    provideDocumentFormattingEdits(document, options) {
        const cfg = vscode.workspace.getConfiguration('html.format');
        const insertFinalNewline = vscode.workspace.getConfiguration('files').get('insertFinalNewline', false);

        const sourceText = document.getText();
        const protectedText = protectParagraphTags(sourceText);

        const htmlFormatted = beautify(protectedText, {
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

        const restored = restoreParagraphTags(htmlFormatted);
        const indented = applyJinjaIndent(restored, options.tabSize, options.insertSpaces, document.eol);
        const formatted = normalizeJinjaWhitespace(indented);
        const text = sourceText;

        return [vscode.TextEdit.replace(
            new vscode.Range(document.positionAt(0), document.positionAt(text.length)),
            formatted
        )];
    }
};

module.exports = { formatter };
