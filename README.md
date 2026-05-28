# Jinja Py

`Jinja Py` is a `VS Code` extension. It provides syntax highlighting, formatting, folding, autocomplete, and breakpoint support for HTML templates.

Forked from [Dragon Jinja](https://marketplace.visualstudio.com/items?itemName=hongquan.dragon-jinja) and completely updated.

## Features Overview
* **Syntax Highlighting:** Full support for Jinja and Jinja-HTML files, including injection into standard HTML.
* **Code Formatting:** Formats HTML using `js-beautify` and applies custom indentation for `Jinja` logic blocks (`if`, `for`, `block`, `macro`, `filter`, `with`, `raw`).
* **Code Folding:** Accurately folds multiline `Jinja` block structures.
* **Autocomplete:** Context-aware completion for Jinja keywords, filters, tests, built-in globals, and framework-specific names inside `{% ... %}` and `{{ ... }}`.
* **Snippets:** Ready-made snippets for common Jinja blocks and statements.
* **Debugging:** Supports breakpoints directly in template files.

## Supported Languages and Extensions
* **Languages:** `Jinja HTML` (`jinja-html`), `Jinja Raw` (`jinja`), `HTML` (`html`).
* **Extensions:** `.jinja`, `.jinja2`, `.j2`, `.html.j2`.

## Default Formatter
The extension automatically sets itself as the default HTML formatter upon activation if no other default is configured. To enforce it manually, add this to your `settings.json`:

```json
"[html]": {
    "editor.defaultFormatter": "BachiMjavanadze.jinja-py"
},
"[jinja-html]": {
    "editor.defaultFormatter": "BachiMjavanadze.jinja-py"
},
"[jinja]": {
    "editor.defaultFormatter": "BachiMjavanadze.jinja-py"
}
```

## Autocomplete

Suggestions fire only inside Jinja delimiters and adapt to the cursor position:

* Statement keywords (`if`, `for`, `block`, `macro`, `with`, `extends`, `include`, `set`, etc.) and their `end` counterparts at the start of `{% ... %}`.
* Context-aware tokens: `in` after `{% for x `, import modifiers after `{% include '...' `, operators and literals after `{% if `.
* Built-in filters after `|`, built-in tests after `is` and `is not`.
* Built-in Jinja globals (`range`, `dict`, `lipsum`, `cycler`, `joiner`, `namespace`) and special variables (`loop`, `super`, `self`, `varargs`, `kwargs`).
* Expression atoms (globals, framework names, attribute chains) fire both inside `{{ ... }}` and in expression positions inside `{% ... %}` — after `if`, `elif`, `for ... in`, `set ... =`, and `with ... =`.
* No suggestions inside `{# ... #}` comments or after `.` on user-defined names.

### Framework-specific completions

The `properties.framework` setting controls which web framework's built-in template names are suggested:

```json
"jinjaPy": {
    "framework": "flask"
}
```

| Value | Suggests |
|---|---|
| `flask` (default) | Flask, Flask-Login, Flask-WTF, Flask-Babel globals, `request`/`session`/`g`/`config`/`current_user` attributes, and Babel filters |
| `django` | Django Jinja2-backend globals, `request`/`user` attributes, and default context-processor names |
| `fastapi` | Starlette `url_for`, `request`, and `request` attribute chains |
| `none` | Pure Jinja built-ins only |

This is **not** type-aware autocomplete like in a statically typed language. The extension does not read your Python code, does not know your actual framework, and does not validate anything. It simply offers a fixed list of names that the selected framework is known to inject. The setting only chooses which list to show.

So the selected framework must match your project. If you set `framework` to `django` inside a Flask project, you will get Django globals, attributes, and methods — with no warning — and using them will fail at render time. Picking the wrong framework gives you the wrong names, silently.

Callable names (`url_for`, `csrf_token`, `gettext`, `static`, `url`, ...) insert with parentheses and the cursor placed inside.

Attribute completions are offered only for the framework's known objects (e.g. `request.args.`, `current_user.`). User-defined variables and the results of function calls receive no attribute suggestions.

## Snippets

The extension ships snippets for common Jinja blocks and statements, namespaced under the `j.` prefix (e.g. `j.block-nesting`, `j.stat`). Type `j.` in `html`, `jinja-html`, or `jinja` files to see the list, then keep typing to filter.

Some snippets are taken from [Jinja Snippets Flask](https://marketplace.visualstudio.com/items?itemName=WaseemAkram.jinja-snippets-flask), but the trigger works differently: the `j.` prefix is required, so the list only appears after you type the dot, not on a bare letter.

To use your own snippets instead, disable the built-ins:

```json
"jinjaPy": {
    "jinjaSnippets": false
}
```

## Breakpoints Support

To debug templates, add the `"jinja": true` option to your target configuration in the `launch.json` file.

## Support and Feedback

Please feel free to report any issues or suggestions. Check out the [GitHub repository](https://github.com/BachiMjavanadze/jinja-py) for more details.

### [Change Log](https://marketplace.visualstudio.com/items/BachiMjavanadze.jinja-py/changelog)

## License

This project is licensed under the [MIT License](https://github.com/BachiMjavanadze/jinja-py/blob/main/LICENSE).
