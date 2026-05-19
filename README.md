# Jinja Py

`Jinja Py` is a `VS Code` extension. It provides syntax highlighting, formatting, folding, and breakpoint support for HTML templates.

Forked from [Dragon Jinja](https://marketplace.visualstudio.com/items?itemName=hongquan.dragon-jinja) and completely updated.

## Features Overview
* **Syntax Highlighting:** Full support for Jinja and Jinja-HTML files, including injection into standard HTML.
* **Code Formatting:** Formats HTML using `js-beautify` and applies custom indentation for `Jinja` logic blocks (`if`, `for`, `block`, `macro`, `filter`, `with`, `raw`).
* **Code Folding:** Accurately folds multiline `Jinja` block structures.
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

## Breakpoints Support

To debug templates, add the `"jinja": true` option to your target configuration in the `launch.json` file.

## Support and Feedback

Please feel free to report any issues or suggestions. Check out the [GitHub repository](https://github.com/BachiMjavanadze/jinja-py) for more details.

## [Change Log](https://marketplace.visualstudio.com/items/BachiMjavanadze.jinja-py/changelog)

## License

This project is licensed under the [MIT License](https://github.com/BachiMjavanadze/jinja-py/blob/main/LICENSE).
