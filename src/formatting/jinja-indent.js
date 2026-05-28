// src/formatting/jinja-indent.js
const vscode = require('vscode');

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

module.exports = { applyJinjaIndent };
