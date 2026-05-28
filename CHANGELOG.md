# Change Log

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
