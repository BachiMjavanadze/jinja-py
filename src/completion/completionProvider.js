// src/completion/completionProvider.js
const { detectJinjaContext } = require('./context');
const { buildItems } = require('./items');
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
};
