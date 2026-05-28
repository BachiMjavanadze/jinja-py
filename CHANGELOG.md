# Change Log

## [1.3.1] - 2026-05-28

- Added the `jinjaPy.jinjaSnippets` setting (default `true`) to toggle the built-in `j.` snippets on or off.

## [1.3.0] - 2026-05-28

- Formatter now normalizes whitespace inside Jinja delimiters: exactly one space after `{{` / `{%` / `{#` and before `}}` / `%}` / `#}`, preserving `-` trim markers and the literal content of `{% raw %}` blocks.
- Added snippets for common Jinja blocks and statements, namespaced under the `j.` prefix, in `html`, `jinja-html`, and `jinja` files.
- Typing `%` between `{` and `}` auto-expands to `{% | %}` with the cursor in the middle.

## [1.2.1] - 2026-05-28

- Filters after `|` inside `{{ ... }}` are now colored like functions.

## [1.2.0] - 2026-05-28

- Added framework-specific autocomplete for built-in template globals, request attributes, and filters, controlled by the new `jinjaPy.framework` setting (`flask` / `django` / `fastapi` / `none`, default `flask`).
- Autocomplete now fires in expression positions inside `{% ... %}` (after `if`, `elif`, `for ... in`, `set ... =`, `with ... =`), not only inside `{{ ... }}`.
- Callable completions (e.g. `url_for`, `csrf_token`) insert parentheses with the cursor inside and trigger parameter hints.
- Added `.` as a completion trigger character for attribute chains.
- `pluralize` is now offered only when `jinjaPy.framework` is `flask` (Flask-Babel i18n), not as a base Jinja keyword.

## [1.1.3] - 2026-05-27

- Fixed indentation issue of the Paragraph Tag

## [1.1.2] - 2026-05-25

- Fixed formatter incorrectly increasing indentation after single-line Jinja blocks.
- Fixed Jinja syntax inside HTML comments (`<!-- ... -->`) being highlighted as code instead of comment text.

## [1.1.0] - 2026-05-22

- Added context-aware Jinja autocomplete for keywords, filters, tests, and built-in globals inside `{% ... %}` and `{{ ... }}`.

## [1.0.0] - 2026-05-19

- Initial commit.
