// src/formatting/jinja-whitespace.js
/* 
Normalize whitespace immediately inside Jinja delimiters: exactly one
space after `{{`/`{%`/`{#` and exactly one space before `}}`/`%}`/`#}`.
Preserves `-` whitespace-trim markers (`{{- expr -}}`) and leaves the
literal body of `{% raw %}...{% endraw %}` untouched.
*/

const TOKEN_RE = /(\{%-?\s*raw\s*-?%\})([\s\S]*?)(\{%-?\s*endraw\s*-?%\})|(\{\{[\s\S]*?\}\})|(\{%[\s\S]*?%\})|(\{#[\s\S]*?#\})/g;

function normalizeDelim(tag, open, close) {
    let inner = tag.slice(open.length, tag.length - close.length);
    let leftDash = '';
    let rightDash = '';
    if (inner.startsWith('-')) { leftDash = '-'; inner = inner.slice(1); }
    if (inner.endsWith('-')) { rightDash = '-'; inner = inner.slice(0, -1); }
    const trimmed = inner.replace(/^\s+/, '').replace(/\s+$/, '');
    if (!trimmed) return tag;
    return `${open}${leftDash} ${trimmed} ${rightDash}${close}`;
}

function normalizeOne(tag) {
    if (tag.startsWith('{{')) return normalizeDelim(tag, '{{', '}}');
    if (tag.startsWith('{%')) return normalizeDelim(tag, '{%', '%}');
    if (tag.startsWith('{#')) return normalizeDelim(tag, '{#', '#}');
    return tag;
}

function normalizeJinjaWhitespace(text) {
    return text.replace(TOKEN_RE, (m, rawOpen, rawBody, rawClose) => {
        if (rawOpen) return normalizeOne(rawOpen) + rawBody + normalizeOne(rawClose);
        return normalizeOne(m);
    });
}

module.exports = { normalizeJinjaWhitespace };
