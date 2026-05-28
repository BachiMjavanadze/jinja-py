// src/completion/completionProvider.js
const { detectJinjaContext } = require('./context');
const { buildItems, buildRichItems } = require('./items');
const registry = require('./frameworks/registry');
const {
    JINJA_STATEMENT_OPENERS,
    JINJA_STATEMENT_ENDERS,
    JINJA_STATEMENT_MIDDLE,
    JINJA_OPERATORS,
    JINJA_LITERALS,
    JINJA_MODIFIERS,
    JINJA_IMPORT_MODIFIERS,
    JINJA_FILTERS,
    JINJA_TESTS,
    JINJA_GLOBALS,
} = require('./jinja');

// Parse a clean trailing identifier chain ending in a dot (e.g. "request.args.").
// Returns token array or null. Bails on call/index results.
function parseChain(after) {
    const m = after.match(/([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\.\s*\w*$/);
    if (!m) return null;
    const before = after[m.index - 1];
    if (before === ')' || before === ']') return null;
    return m[1].split('.');
}

// Full expression-position completion set. Shared by {{ }} and the
// post-keyword part of {% %}. Framework data is additive to pure Jinja.
function expressionAtoms(after) {
    // attribute access after a dot
    if (/\.\s*\w*$/.test(after)) {
        const tokens = parseChain(after);
        if (!tokens) return [];
        return buildRichItems(registry.resolveAttributes(tokens));
    }
    // filters after |
    if (/\|\s*\w*$/.test(after)) {
        return [
            ...buildItems(JINJA_FILTERS, 'Jinja filter'),
            ...buildRichItems(registry.current().filters),
        ];
    }
    // tests after is / is not
    if (/\bis(?:\s+not)?\s+\w*$/.test(after)) {
        return [
            ...buildItems(JINJA_TESTS, 'Jinja test'),
            ...buildRichItems(registry.current().tests),
        ];
    }
    // default atoms
    return [
        ...buildItems(JINJA_OPERATORS, 'Jinja operator'),
        ...buildItems(JINJA_LITERALS, 'Jinja literal'),
        ...buildItems(JINJA_GLOBALS, 'Jinja global'),
        ...buildRichItems(registry.current().globals),
    ];
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
            ...buildItems(registry.current().statementKeywords, 'Framework statement'),
        ];
    }

    const first = words[0];

    if (first === 'if' || first === 'elif') {
        return expressionAtoms(after);
    }

    if (first === 'for') {
        if (words.includes('in')) return expressionAtoms(after);
        return buildItems(['in'], 'Jinja keyword');
    }

    if (first === 'set' || first === 'with') {
        if (after.includes('=')) return expressionAtoms(after);
        return [];
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

    // do, call, i18n, etc. -> expression position
    return expressionAtoms(after);
}

function expressionCompletions(after) {
    return expressionAtoms(after);
}

function buildJinjaCompletions(document, position) {
    const ctx = detectJinjaContext(document, position);
    if (ctx.kind === 'text' || ctx.kind === 'comment') return [];
    if (ctx.kind === 'statement') return statementCompletions(ctx.after);
    if (ctx.kind === 'expression') return expressionCompletions(ctx.after);
    return [];
}

const completionProvider = {
    provideCompletionItems(document, position) {
        return buildJinjaCompletions(document, position);
    }
};

module.exports = {
    completionProvider,
    buildJinjaCompletions,
    statementCompletions,
    expressionCompletions,
    expressionAtoms,
};
