// src/completion/frameworks/flask.js
const attr = (name, detail) => ({ name, kind: 'attr', detail });
const method = (name, detail) => ({ name, kind: 'method', detail });

const MULTIDICT = [
    method('get', 'Werkzeug MultiDict · first value for key'),
    method('getlist', 'Werkzeug MultiDict · list of values for key'),
    method('keys', 'Werkzeug MultiDict · keys view'),
    method('values', 'Werkzeug MultiDict · first values view'),
    method('items', 'Werkzeug MultiDict · key/first-value pairs'),
    method('lists', 'Werkzeug MultiDict · key/value-list pairs'),
    method('listvalues', 'Werkzeug MultiDict · all value lists'),
    method('to_dict', 'Werkzeug MultiDict · convert to plain dict'),
    method('copy', 'Werkzeug MultiDict · shallow copy'),
    method('deepcopy', 'Werkzeug MultiDict · deep copy'),
];

const HEADERS = [
    method('get', 'Werkzeug Headers · value for header'),
    method('getlist', 'Werkzeug Headers · list of values for header'),
    method('get_all', 'Werkzeug Headers · all values for header'),
    method('keys', 'Werkzeug Headers · header names'),
    method('values', 'Werkzeug Headers · header values'),
    method('items', 'Werkzeug Headers · header name/value pairs'),
    method('to_wsgi_list', 'Werkzeug Headers · as WSGI list of tuples'),
];

const REQUEST_ATTRS = [
    // Core URL / routing (Werkzeug)
    attr('method', 'Werkzeug · HTTP method (GET, POST, ...)'),
    attr('scheme', 'Werkzeug · URL scheme (http/https)'),
    attr('path', 'Werkzeug · request path'),
    attr('full_path', 'Werkzeug · path with query string'),
    attr('query_string', 'Werkzeug · raw query string (bytes)'),
    attr('url', 'Werkzeug · full request URL'),
    attr('base_url', 'Werkzeug · URL without query string'),
    attr('root_url', 'Werkzeug · application root URL'),
    attr('host_url', 'Werkzeug · scheme + host URL'),
    attr('host', 'Werkzeug · host (with port)'),
    attr('script_root', 'Werkzeug · WSGI script root path'),
    attr('root_path', 'Werkzeug · root path of the request'),
    attr('url_root', 'Werkzeug · root URL of the request'),
    attr('is_secure', 'Werkzeug · True if served over HTTPS'),
    // Body data (Werkzeug)
    attr('args', 'Werkzeug · query-string MultiDict'),
    attr('form', 'Werkzeug · form-data MultiDict'),
    attr('files', 'Werkzeug · uploaded files MultiDict'),
    attr('values', 'Werkzeug · combined args + form MultiDict'),
    attr('cookies', 'Werkzeug · cookies MultiDict'),
    attr('headers', 'Werkzeug · request headers'),
    attr('data', 'Werkzeug · raw body bytes'),
    attr('json', 'Werkzeug · parsed JSON body'),
    attr('stream', 'Werkzeug · raw input stream'),
    attr('is_json', 'Werkzeug · True if mimetype is JSON'),
    attr('mimetype', 'Werkzeug · content mimetype'),
    attr('mimetype_params', 'Werkzeug · mimetype parameters'),
    // Content meta (Werkzeug)
    attr('content_type', 'Werkzeug · Content-Type header'),
    attr('content_length', 'Werkzeug · Content-Length header'),
    attr('content_encoding', 'Werkzeug · Content-Encoding header'),
    attr('referrer', 'Werkzeug · Referer header'),
    attr('date', 'Werkzeug · Date header'),
    attr('origin', 'Werkzeug · Origin header'),
    attr('user_agent', 'Werkzeug · User-Agent'),
    attr('authorization', 'Werkzeug · Authorization header'),
    // Network (Werkzeug)
    attr('remote_addr', 'Werkzeug · client IP address'),
    attr('remote_user', 'Werkzeug · authenticated WSGI user'),
    attr('access_route', 'Werkzeug · IP chain incl. proxies'),
    attr('server', 'Werkzeug · (host, port) tuple'),
    attr('environ', 'Werkzeug · raw WSGI environ dict'),
    // Accept (Werkzeug)
    attr('accept_mimetypes', 'Werkzeug · accepted mimetypes'),
    attr('accept_encodings', 'Werkzeug · accepted encodings'),
    attr('accept_languages', 'Werkzeug · accepted languages'),
    // Conditional (Werkzeug)
    attr('cache_control', 'Werkzeug · Cache-Control header'),
    attr('if_match', 'Werkzeug · If-Match header'),
    attr('if_none_match', 'Werkzeug · If-None-Match header'),
    attr('if_modified_since', 'Werkzeug · If-Modified-Since header'),
    attr('if_unmodified_since', 'Werkzeug · If-Unmodified-Since header'),
    attr('if_range', 'Werkzeug · If-Range header'),
    attr('range', 'Werkzeug · Range header'),
    // Flask additions
    attr('endpoint', 'Flask · matched endpoint name'),
    attr('blueprint', 'Flask · current blueprint name'),
    attr('blueprints', 'Flask · blueprint name chain'),
    attr('view_args', 'Flask · matched URL view arguments'),
    attr('url_rule', 'Flask · matched URL rule'),
    attr('max_content_length', 'Flask · max allowed body size'),
    attr('routing_exception', 'Flask · routing exception, if any'),
    // Methods (Werkzeug)
    method('get_data', 'Werkzeug · read request body'),
    method('get_json', 'Werkzeug · parse body as JSON'),
    method('close', 'Werkzeug · close associated resources'),
];

module.exports = {
    globals: [
        { name: 'url_for', kind: 'fn', detail: 'Flask · build URL for a view endpoint' },
        { name: 'get_flashed_messages', kind: 'fn', detail: 'Flask · retrieve flashed messages' },
        { name: 'config', kind: 'obj', detail: 'Flask · application config object' },
        { name: 'request', kind: 'obj', detail: 'Flask · current request object' },
        { name: 'session', kind: 'obj', detail: 'Flask · current session object' },
        { name: 'g', kind: 'obj', detail: 'Flask · request-bound globals namespace' },
        { name: 'current_user', kind: 'obj', detail: 'Flask-Login · currently logged-in user' },
        { name: 'csrf_token', kind: 'fn', detail: 'Flask-WTF · generate CSRF token for forms' },
        { name: '_', kind: 'fn', detail: 'Flask-Babel · alias for gettext' },
        { name: 'gettext', kind: 'fn', detail: 'Flask-Babel · translate a string' },
        { name: 'ngettext', kind: 'fn', detail: 'Flask-Babel · translate with pluralization' },
        { name: 'pgettext', kind: 'fn', detail: 'Flask-Babel · translate with context' },
        { name: 'npgettext', kind: 'fn', detail: 'Flask-Babel · translate with context and pluralization' },
    ],
    filters: [
        { name: 'tojson', kind: 'filter', detail: 'Flask · serialize value to HTML-safe JSON' },
        { name: 'datetimeformat', kind: 'filter', detail: 'Flask-Babel · format a datetime' },
        { name: 'dateformat', kind: 'filter', detail: 'Flask-Babel · format a date' },
        { name: 'timeformat', kind: 'filter', detail: 'Flask-Babel · format a time' },
        { name: 'timedeltaformat', kind: 'filter', detail: 'Flask-Babel · format a timedelta' },
        { name: 'numberformat', kind: 'filter', detail: 'Flask-Babel · format a number' },
        { name: 'decimalformat', kind: 'filter', detail: 'Flask-Babel · format a decimal' },
        { name: 'currencyformat', kind: 'filter', detail: 'Flask-Babel · format a currency amount' },
        { name: 'percentformat', kind: 'filter', detail: 'Flask-Babel · format a percentage' },
        { name: 'scientificformat', kind: 'filter', detail: 'Flask-Babel · format in scientific notation' },
    ],
    tests: [],
    statementKeywords: ['trans', 'endtrans', 'pluralize'],
    attributes: {
        request: {
            attrs: REQUEST_ATTRS,
            children: {
                args: { attrs: MULTIDICT },
                form: { attrs: MULTIDICT },
                files: { attrs: MULTIDICT },
                cookies: { attrs: MULTIDICT },
                headers: { attrs: HEADERS },
            },
        },
        session: {
            attrs: [
                attr('new', 'Flask · True if session is new'),
                attr('modified', 'Flask · True if session was modified'),
                attr('permanent', 'Flask · session lifetime flag'),
                method('get', 'Flask · value for key'),
                method('pop', 'Flask · remove and return key'),
                method('setdefault', 'Flask · get or set default'),
                method('keys', 'Flask · session keys'),
                method('values', 'Flask · session values'),
                method('items', 'Flask · session key/value pairs'),
            ],
        },
        g: {
            attrs: [
                method('get', 'Flask · value for key, or default'),
                method('pop', 'Flask · remove and return key'),
                method('setdefault', 'Flask · get or set default'),
            ],
        },
        config: {
            attrs: [
                method('get', 'Flask · config value, or default'),
                attr('root_path', 'Flask · application root path'),
            ],
        },
        current_user: {
            attrs: [
                attr('is_authenticated', 'Flask-Login · True if logged in'),
                attr('is_active', 'Flask-Login · True if account is active'),
                attr('is_anonymous', 'Flask-Login · True if anonymous'),
                method('get_id', 'Flask-Login · unique user id'),
            ],
        },
    },
};
