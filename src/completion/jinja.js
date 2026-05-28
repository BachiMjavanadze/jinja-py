// src/completion/jinja.js
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

module.exports = {
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
};
