const vscode = require('vscode');
const beautify = require('js-beautify').html;

const JINJA_STATEMENT_OPENERS = [
    'if', 'for', 'block', 'extends', 'include', 'import', 'from',
    'macro', 'call', 'filter', 'set', 'with', 'raw', 'autoescape', 'do', 'pluralize'
];

const JINJA_STATEMENT_ENDERS = [
    'endif', 'endfor', 'endblock', 'endmacro', 'endcall',
    'endfilter', 'endset', 'endwith', 'endraw', 'endautoescape'
];

const JINJA_STATEMENT_MIDDLE = ['elif', 'else', 'break', 'continue'];
const JINJA_OPERATORS = ['and', 'or', 'not', 'in', 'is'];
const JINJA_LITERALS = ['true', 'false', 'none', 'True', 'False', 'None'];

const JINJA_MODIFIERS = [
    'as', 'scoped', 'required', 'recursive',
    'without', 'context', 'ignore', 'missing'
];

const JINJA_IMPORT_MODIFIERS = ['with', 'without', 'context', 'ignore', 'missing', 'as', 'import'];
const JINJA_FILTERS = [
    'abs', 'attr', 'batch', 'capitalize', 'center', 'count', 'd', 'default',
    'dictsort', 'e', 'escape', 'filesizeformat', 'first', 'float', 'forceescape',
    'format', 'groupby', 'indent', 'int', 'items', 'join', 'last', 'length',
    'list', 'lower', 'map', 'max', 'min', 'pprint', 'random', 'reject',
    'rejectattr', 'replace', 'reverse', 'round', 'safe', 'select', 'selectattr',
    'slice', 'sort', 'string', 'striptags', 'sum', 'title', 'tojson', 'trim',
    'truncate', 'unique', 'upper', 'urlencode', 'urlize', 'wordcount', 'wordwrap',
    'xmlattr'
];

const JINJA_TESTS = [
    'boolean', 'callable', 'defined', 'divisibleby', 'eq', 'escaped', 'even',
    'false', 'filter', 'float', 'ge', 'greaterthan', 'gt', 'in', 'integer',
    'iterable', 'le', 'lessthan', 'lower', 'lt', 'mapping', 'ne', 'none',
    'number', 'odd', 'sameas', 'sequence', 'string', 'test', 'true',
    'undefined', 'upper'
];

const JINJA_GLOBALS = [
    'range', 'dict', 'lipsum', 'cycler', 'joiner', 'namespace',
    'loop', 'super', 'self', 'varargs', 'kwargs'
];

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

function buildItems(names, detail) {
    return names.map(name => {
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
        item.detail = detail;
        return item;
    });
}

function statementCompletions(after) {
    const norm = after.replace(/^\s*-?\s*/, '');
    const words = norm.split(/\s+/).filter(Boolean);
    const endsWithSpace = /\s$/.test(after);
    const onFirstToken = words.length === 0 || (words.length === 1 && !endsWithSpace);

    if (onFirstToken) {
        return [
            ...buildItems(JINJA_STATEMENT_OPENERS, 'Jinja statement'),
            ...buildItems(JINJA_STATEMENT_ENDERS, 'Jinja end block'),
            ...buildItems(JINJA_STATEMENT_MIDDLE, 'Jinja branch'),
        ];
    }

    const first = words[0];

    if (first === 'for') {
        return [
            ...buildItems(['in'], 'Jinja keyword'),
            ...buildItems(JINJA_OPERATORS, 'Jinja operator'),
            ...buildItems(JINJA_LITERALS, 'Jinja literal'),
        ];
    }

    if (first === 'if' || first === 'elif') {
        return [
            ...buildItems(JINJA_OPERATORS, 'Jinja operator'),
            ...buildItems(JINJA_LITERALS, 'Jinja literal'),
        ];
    }

    if (first === 'extends' || first === 'include' || first === 'import' || first === 'from') {
        return buildItems(JINJA_IMPORT_MODIFIERS, 'Jinja modifier');
    }

    if (first === 'block' || first === 'macro' || first === 'filter') {
        return buildItems(JINJA_MODIFIERS, 'Jinja modifier');
    }

    if (first === 'autoescape') {
        return buildItems(['true', 'false'], 'Jinja literal');
    }

    if (first === 'set' || first === 'with') {
        return [
            ...buildItems(JINJA_OPERATORS, 'Jinja operator'),
            ...buildItems(JINJA_LITERALS, 'Jinja literal'),
        ];
    }

    return [
        ...buildItems(JINJA_OPERATORS, 'Jinja operator'),
        ...buildItems(JINJA_LITERALS, 'Jinja literal'),
    ];
}

function expressionCompletions(after) {
    if (/\.\s*\w*$/.test(after)) {
        return [];
    }

    if (/\|\s*\w*$/.test(after)) {
        return buildItems(JINJA_FILTERS, 'Jinja filter');
    }

    if (/\bis(?:\s+not)?\s+\w*$/.test(after)) {
        return buildItems(JINJA_TESTS, 'Jinja test');
    }

    return [
        ...buildItems(JINJA_OPERATORS, 'Jinja operator'),
        ...buildItems(JINJA_LITERALS, 'Jinja literal'),
        ...buildItems(JINJA_GLOBALS, 'Jinja global'),
    ];
}

function buildJinjaCompletions(document, position) {
    const ctx = detectJinjaContext(document, position);
    if (ctx.kind === 'text' || ctx.kind === 'comment') return [];
    if (ctx.kind === 'statement') return statementCompletions(ctx.after);
    if (ctx.kind === 'expression') return expressionCompletions(ctx.after);
    return [];
}

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

    const completionProvider = {
        provideCompletionItems(document, position) {
            return buildJinjaCompletions(document, position);
        }
    };

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('html', formatter),
        vscode.languages.registerDocumentFormattingEditProvider('jinja-html', formatter),
        vscode.languages.registerDocumentFormattingEditProvider('jinja', formatter),
        vscode.languages.registerFoldingRangeProvider('html', foldingProvider),
        vscode.languages.registerFoldingRangeProvider('jinja-html', foldingProvider),
        vscode.languages.registerFoldingRangeProvider('jinja', foldingProvider),
        vscode.languages.registerCompletionItemProvider('html', completionProvider, ' ', '|'),
        vscode.languages.registerCompletionItemProvider('jinja-html', completionProvider, ' ', '|'),
        vscode.languages.registerCompletionItemProvider('jinja', completionProvider, ' ', '|')
    );

    const htmlEditorConfig = vscode.workspace.getConfiguration('editor', { languageId: 'html' });
    if (!htmlEditorConfig.get('defaultFormatter')) {
        await htmlEditorConfig.update('defaultFormatter', 'BachiMjavanadze.jinja-py', vscode.ConfigurationTarget.Global, true);
    }
}

const JINJA_OPENERS_SET = new Set([
    'block', 'for', 'if', 'macro', 'filter', 'with', 'raw', 'call', 'autoescape'
]);
const JINJA_CLOSERS_SET = new Set([
    'endblock', 'endfor', 'endif', 'endmacro', 'endfilter', 'endwith',
    'endraw', 'endcall', 'endautoescape', 'endset'
]);
const JINJA_MIDDLES_SET = new Set(['elif', 'else', 'empty']);

function extractJinjaTags(text, initialState) {
    const tags = [];
    let state = initialState;
    let i = 0;
    const n = text.length;

    while (i < n) {
        if (state === 'normal') {
            if (text.startsWith('<!--', i)) {
                state = 'html_comment';
                i += 4;
            } else if (text.startsWith('{#', i)) {
                state = 'jinja_comment';
                i += 2;
            } else if (text.startsWith('{%', i)) {
                const end = text.indexOf('%}', i + 2);
                if (end === -1) { break; }
                let inner = text.substring(i + 2, end);
                inner = inner.replace(/^-/, '').replace(/-$/, '').trim();
                const m = inner.match(/^(\w+)/);
                if (m) {
                    const keyword = m[1];
                    tags.push({ keyword, inner });
                    if (keyword === 'raw') state = 'raw';
                }
                i = end + 2;
            } else {
                i++;
            }
        } else if (state === 'html_comment') {
            const end = text.indexOf('-->', i);
            if (end === -1) return { tags, finalState: 'html_comment' };
            i = end + 3;
            state = 'normal';
        } else if (state === 'jinja_comment') {
            const end = text.indexOf('#}', i);
            if (end === -1) return { tags, finalState: 'jinja_comment' };
            i = end + 2;
            state = 'normal';
        } else if (state === 'raw') {
            const re = /\{%-?\s*endraw\s*-?%\}/g;
            re.lastIndex = i;
            const m = re.exec(text);
            if (!m) return { tags, finalState: 'raw' };
            tags.push({ keyword: 'endraw', inner: 'endraw' });
            i = m.index + m[0].length;
            state = 'normal';
        }
    }

    return { tags, finalState: state };
}

function classifyJinjaTag(tag) {
    if (tag.keyword === 'set') {
        return tag.inner.includes('=') ? 'neutral' : 'open';
    }
    if (JINJA_OPENERS_SET.has(tag.keyword)) return 'open';
    if (JINJA_CLOSERS_SET.has(tag.keyword)) return 'close';
    if (JINJA_MIDDLES_SET.has(tag.keyword)) return 'middle';
    return 'neutral';
}

function applyJinjaIndent(text, tabSize, insertSpaces, eol) {
    const unit = insertSpaces ? ' '.repeat(tabSize) : '\t';
    const lineSep = eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
    const lines = text.split(/\r\n|\n|\r/);
    const result = [];
    let level = 0;
    let state = 'normal';

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) { result.push(''); continue; }

        const { tags, finalState } = extractJinjaTags(line, state);
        state = finalState;

        let preAdjust = 0;
        let postAdjust = 0;
        let seenOpen = false;

        for (const tag of tags) {
            const kind = classifyJinjaTag(tag);
            if (kind === 'open') {
                seenOpen = true;
                postAdjust += 1;
            } else if (kind === 'close') {
                if (!seenOpen) preAdjust -= 1;
                else postAdjust -= 1;
            } else if (kind === 'middle') {
                if (!seenOpen) { preAdjust -= 1; postAdjust += 1; }
            }
        }

        const indentLevel = Math.max(0, level + preAdjust);
        result.push(unit.repeat(indentLevel) + line);

        level = Math.max(0, level + preAdjust + postAdjust);
    }

    return result.join(lineSep);
}

module.exports = { activate };
