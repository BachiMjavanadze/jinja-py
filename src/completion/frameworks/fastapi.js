// src/completion/frameworks/fastapi.js
// FastAPI / Starlette (Jinja2Templates).
const attr = (name, detail) => ({ name, kind: 'attr', detail });
const method = (name, detail) => ({ name, kind: 'method', detail });

module.exports = {
    globals: [
        { name: 'url_for', kind: 'fn', detail: 'Starlette · build URL for a route name' },
        { name: 'request', kind: 'obj', detail: 'Starlette · current request object (passed via TemplateResponse)' },
    ],
    filters: [],
    tests: [],
    statementKeywords: [],
    attributes: {
        request: {
            attrs: [
                attr('method', 'Starlette · HTTP method'),
                attr('url', 'Starlette · request URL object'),
                attr('base_url', 'Starlette · application base URL'),
                attr('headers', 'Starlette · request headers'),
                attr('query_params', 'Starlette · query-string params'),
                attr('path_params', 'Starlette · matched path params'),
                attr('cookies', 'Starlette · cookies dict'),
                attr('client', 'Starlette · client address'),
                attr('state', 'Starlette · request-scoped state'),
                attr('session', 'Starlette · session (SessionMiddleware)'),
                attr('user', 'Starlette · authenticated user'),
                attr('auth', 'Starlette · auth credentials'),
                attr('app', 'Starlette · application instance'),
                attr('scope', 'Starlette · raw ASGI scope'),
                method('url_for', 'Starlette · build URL for a route name'),
            ],
            children: {
                url: {
                    attrs: [
                        attr('scheme', 'Starlette URL · scheme'),
                        attr('netloc', 'Starlette URL · network location'),
                        attr('path', 'Starlette URL · path'),
                        attr('query', 'Starlette URL · query string'),
                        attr('fragment', 'Starlette URL · fragment'),
                        attr('username', 'Starlette URL · username'),
                        attr('password', 'Starlette URL · password'),
                        attr('hostname', 'Starlette URL · hostname'),
                        attr('port', 'Starlette URL · port'),
                        attr('is_secure', 'Starlette URL · True if HTTPS'),
                    ],
                },
                query_params: {
                    attrs: [
                        method('get', 'Starlette QueryParams · value for key'),
                        method('getlist', 'Starlette QueryParams · list of values for key'),
                        method('keys', 'Starlette QueryParams · keys'),
                        method('values', 'Starlette QueryParams · values'),
                        method('items', 'Starlette QueryParams · key/value pairs'),
                        method('multi_items', 'Starlette QueryParams · all key/value pairs'),
                    ],
                },
                headers: {
                    attrs: [
                        method('get', 'Starlette Headers · value for header'),
                        method('getlist', 'Starlette Headers · list of values for header'),
                        method('keys', 'Starlette Headers · header names'),
                        method('values', 'Starlette Headers · header values'),
                        method('items', 'Starlette Headers · header name/value pairs'),
                        method('mutablecopy', 'Starlette Headers · mutable copy'),
                        attr('raw', 'Starlette Headers · raw header pairs'),
                    ],
                },
                client: {
                    attrs: [
                        attr('host', 'Starlette Address · client host'),
                        attr('port', 'Starlette Address · client port'),
                    ],
                },
                session: {
                    attrs: [
                        method('get', 'Starlette session · value for key'),
                        method('pop', 'Starlette session · remove and return key'),
                        method('setdefault', 'Starlette session · get or set default'),
                        method('keys', 'Starlette session · keys'),
                        method('values', 'Starlette session · values'),
                        method('items', 'Starlette session · key/value pairs'),
                    ],
                },
                user: {
                    attrs: [
                        attr('is_authenticated', 'Starlette · True if authenticated'),
                        attr('display_name', 'Starlette · display name'),
                        attr('identity', 'Starlette · user identity'),
                    ],
                },
            },
        },
    },
};
