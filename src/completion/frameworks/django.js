// src/completion/frameworks/django.js
// Django Jinja2 backend only (django.template.backends.jinja2.Jinja2).
const attr = (name, detail) => ({ name, kind: 'attr', detail });
const method = (name, detail) => ({ name, kind: 'method', detail });

const USER_ATTRS = [
    attr('is_authenticated', 'Django · True if user is authenticated'),
    attr('is_anonymous', 'Django · True if user is anonymous'),
    attr('is_active', 'Django · True if account is active'),
    attr('is_staff', 'Django · True if staff member'),
    attr('is_superuser', 'Django · True if superuser'),
    attr('username', 'Django · username (default User model)'),
    attr('email', 'Django · email (default User model)'),
    method('get_username', 'Django · the username value'),
    method('get_full_name', 'Django · full name (default User model)'),
    method('get_short_name', 'Django · short name (default User model)'),
];

const QUERYDICT = [
    method('get', 'Django QueryDict · last value for key'),
    method('getlist', 'Django QueryDict · list of values for key'),
    method('keys', 'Django QueryDict · keys'),
    method('values', 'Django QueryDict · values'),
    method('items', 'Django QueryDict · key/value pairs'),
    method('lists', 'Django QueryDict · key/value-list pairs'),
    method('dict', 'Django QueryDict · convert to plain dict'),
];

module.exports = {
    globals: [
        // Layer A — guaranteed by the Jinja2 backend (added per render with request)
        { name: 'request', kind: 'obj', detail: 'Django · current request object' },
        { name: 'csrf_input', kind: 'var', detail: 'Django · hidden CSRF input HTML' },
        { name: 'csrf_token', kind: 'var', detail: 'Django · CSRF token string' },
        // Layer B — default context processors (shipped enabled by startproject)
        { name: 'user', kind: 'obj', detail: 'Django (context processor) · current authenticated user' },
        { name: 'perms', kind: 'obj', detail: 'Django (context processor) · permission lookup for current user' },
        { name: 'messages', kind: 'iter', detail: 'Django (context processor) · flash messages for this request' },
        { name: 'DEFAULT_MESSAGE_LEVELS', kind: 'dict', detail: 'Django (context processor) · message level constants' },
        { name: 'debug', kind: 'bool', detail: 'Django (context processor) · True when DEBUG=True' },
        { name: 'sql_queries', kind: 'list', detail: 'Django (context processor) · executed SQL queries (debug only)' },
        // Layer C — convention globals (user-installed in jinja2.py)
        { name: 'static', kind: 'fn', detail: 'Django (convention) · static file URL' },
        { name: 'url', kind: 'fn', detail: 'Django (convention) · URL reversing by name' },
    ],
    filters: [],
    tests: [],
    statementKeywords: [],
    attributes: {
        request: {
            attrs: [
                attr('GET', 'Django · query-string QueryDict'),
                attr('POST', 'Django · form-data QueryDict'),
                attr('FILES', 'Django · uploaded files'),
                attr('COOKIES', 'Django · cookies dict'),
                attr('META', 'Django · WSGI/HTTP meta dict'),
                attr('headers', 'Django · request headers'),
                attr('method', 'Django · HTTP method'),
                attr('path', 'Django · request path'),
                attr('path_info', 'Django · path info portion'),
                attr('scheme', 'Django · URL scheme (http/https)'),
                attr('content_type', 'Django · request content type'),
                attr('content_params', 'Django · content-type parameters'),
                attr('encoding', 'Django · request encoding'),
                attr('body', 'Django · raw request body'),
                attr('session', 'Django · session store'),
                attr('user', 'Django · current user'),
                attr('site', 'Django · current Site (sites framework)'),
                attr('resolver_match', 'Django · resolved URL match'),
                method('get_full_path', 'Django · path with query string'),
                method('get_host', 'Django · originating host'),
                method('get_port', 'Django · originating port'),
                method('is_secure', 'Django · True if HTTPS'),
                method('build_absolute_uri', 'Django · absolute URI for location'),
            ],
            children: {
                user: { attrs: USER_ATTRS },
                session: {
                    attrs: [
                        method('get', 'Django session · value for key'),
                        method('pop', 'Django session · remove and return key'),
                        method('setdefault', 'Django session · get or set default'),
                        method('keys', 'Django session · keys'),
                        method('values', 'Django session · values'),
                        method('items', 'Django session · key/value pairs'),
                        method('flush', 'Django session · delete session data'),
                        method('cycle_key', 'Django session · rotate session key'),
                    ],
                },
                GET: { attrs: QUERYDICT },
                POST: { attrs: QUERYDICT },
                headers: {
                    attrs: [
                        method('get', 'Django · case-insensitive header value'),
                        method('keys', 'Django · header names'),
                        method('values', 'Django · header values'),
                        method('items', 'Django · header name/value pairs'),
                    ],
                },
            },
        },
        user: { attrs: USER_ATTRS },
    },
};
