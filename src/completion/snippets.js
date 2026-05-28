// src/completion/snippets.js
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/* 
Snippets are namespaced under "j." and served through a completion provider
(not contributes.snippets in package.json) so the "j." prefix is actually required before
they appear. VS Code never triggers contributed snippets after a trigger
character, and fuzzy-matches a bare "j", so the static route can't do this.
*/
const NAMESPACE = 'j.';
const TRIGGER_RE = /(?:^|[^\w.])(j\.[\w.-]*)$/;

let CACHE = {};

function stripJsonComments(s) {
    let out = '';
    let inStr = false, esc = false, inLine = false, inBlock = false;
    for (let i = 0; i < s.length; i++) {
        const c = s[i], n = s[i + 1];
        if (inLine) { if (c === '\n') { inLine = false; out += c; } continue; }
        if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } continue; }
        if (inStr) {
            out += c;
            if (esc) esc = false;
            else if (c === '\\') esc = true;
            else if (c === '"') inStr = false;
            continue;
        }
        if (c === '"') { inStr = true; out += c; continue; }
        if (c === '/' && n === '/') { inLine = true; i++; continue; }
        if (c === '/' && n === '*') { inBlock = true; i++; continue; }
        out += c;
    }
    return out;
}

function init(extensionPath) {
    try {
        const p = path.join(extensionPath, 'src', 'snippets', 'jinja-snippets.json');
        const raw = fs.readFileSync(p, 'utf8');
        try { CACHE = JSON.parse(raw); }
        catch (_) { CACHE = JSON.parse(stripJsonComments(raw)); }
    } catch (_) {
        CACHE = {};
    }
}

function snippetCompletions(linePrefix, position) {
    const m = linePrefix.match(TRIGGER_RE);
    if (!m) return [];
    const token = m[1];
    const range = new vscode.Range(
        position.line, position.character - token.length,
        position.line, position.character
    );

    const items = [];
    for (const name in CACHE) {
        const def = CACHE[name];
        const prefixes = Array.isArray(def.prefix) ? def.prefix : [def.prefix];
        const body = Array.isArray(def.body) ? def.body.join('\n') : def.body;
        for (const pfx of prefixes) {
            if (!pfx || pfx.indexOf(NAMESPACE) !== 0) continue;
            const item = new vscode.CompletionItem(pfx, vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString(body);
            item.detail = def.description || name;
            item.documentation = new vscode.MarkdownString('```jinja\n' + body + '\n```');
            item.filterText = pfx;
            item.range = range;
            items.push(item);
        }
    }
    return items;
}

module.exports = { init, snippetCompletions };
