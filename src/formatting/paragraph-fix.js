// src/formatting/paragraph-fix.js
// region - ParagraphTagIssueFix
/* 
---------------------------------------------------------------------------
<p>-tag protection (workaround for js-beautify's HTML5 auto-close rule)
---------------------------------------------------------------------------

THE PROBLEM
  HTML5 specifies that <p> is *implicitly closed* by any block-level
  descendant (<ul>, <div>, <table>, <h1>-<h6>, <form>, <ol>, <dl>, <pre>,
  <blockquote>, <hr>, etc.). js-beautify implements this faithfully, so a
  common Flask/Jinja template like:

    <p>
        {% if field.errors %}
            <ul class="errors">
                <li>...</li>
            </ul>
        {% endif %}
    </p>

  gets the <ul> reset to column 0 by beautify (because <p> is treated as
  already closed before <ul> opens). Our applyJinjaIndent then adds Jinja
  level on top, but the HTML nesting depth is already lost.

  The bug shows up most often in the default Flask-WTF form template
  (errors list wrapped in <p>). It is NOT a Jinja problem -- the same
  shape <p><ul></ul></p> with zero Jinja triggers it.

THE FIX
  Before beautify runs, rename every <p ...>...</p> in the source to
  <jxp ...>...</jxp>. beautify doesn't know the tag <jxp>, so its
  hardcoded "auto-close <p> on block child" rule never fires. The <ul>
  ends up correctly nested inside <jxp>. After beautify finishes, rename
  <jxp> back to <p>. Attributes pass through untouched (only the tag NAME
  is swapped, the attribute substring is preserved verbatim).

  This is intentionally narrow. It only neutralises ONE specific beautify
  behaviour (the <p> auto-close rule) without touching anything else.

CAVEATS (regex-based, same limitation js-beautify has)
  - Will not match a <p> tag with a literal '>' inside an attribute value
    (e.g. <p title="a > b">). That's invalid-ish HTML anyway.
  - The placeholder name 'jxp' must not appear as a real tag in the
    source. It's not a standard HTML element, so this is safe in practice.

FUTURE
  If a different beautify quirk needs neutralising (e.g. <li> sibling
  auto-close ever starts breaking), add a parallel pair of functions
  following the same pattern. Do NOT bundle multiple workarounds into one
  function -- keep each named after the specific rule it dodges.
---------------------------------------------------------------------------
*/
// endregion - ParagraphTagIssueFix

// region - ParagraphTagIssueFix
/* 
---------------------------------------------------------------------------
<p>-tag protection (workaround for js-beautify's HTML5 auto-close rule)
---------------------------------------------------------------------------

THE PROBLEM
  HTML5 specifies that <p> is *implicitly closed* by any block-level
  descendant (<ul>, <div>, <table>, <h1>-<h6>, <form>, <ol>, <dl>, <pre>,
  <blockquote>, <hr>, etc.). js-beautify implements this faithfully, so a
  common Flask/Jinja template like:

    <p>
        {% if field.errors %}
            <ul class="errors">
                <li>...</li>
            </ul>
        {% endif %}
    </p>

  gets the <ul> reset to column 0 by beautify (because <p> is treated as
  already closed before <ul> opens). Our applyJinjaIndent then adds Jinja
  level on top, but the HTML nesting depth is already lost.

  The bug shows up most often in the default Flask-WTF form template
  (errors list wrapped in <p>). It is NOT a Jinja problem -- the same
  shape <p><ul></ul></p> with zero Jinja triggers it.

THE FIX
  Before beautify runs, rename every <p ...>...</p> in the source to
  <jxp ...>...</jxp>. beautify doesn't know the tag <jxp>, so its
  hardcoded "auto-close <p> on block child" rule never fires. The <ul>
  ends up correctly nested inside <jxp>. After beautify finishes, rename
  <jxp> back to <p>. Attributes pass through untouched (only the tag NAME
  is swapped, the attribute substring is preserved verbatim).

  This is intentionally narrow. It only neutralises ONE specific beautify
  behaviour (the <p> auto-close rule) without touching anything else.

CAVEATS (regex-based, same limitation js-beautify has)
  - Will not match a <p> tag with a literal '>' inside an attribute value
    (e.g. <p title="a > b">). That's invalid-ish HTML anyway.
  - The placeholder name 'jxp' must not appear as a real tag in the
    source. It's not a standard HTML element, so this is safe in practice.

FUTURE
  If a different beautify quirk needs neutralising (e.g. <li> sibling
  auto-close ever starts breaking), add a parallel pair of functions
  following the same pattern. Do NOT bundle multiple workarounds into one
  function -- keep each named after the specific rule it dodges.
---------------------------------------------------------------------------
*/
// endregion - ParagraphTagIssueFix

const P_TAG_PLACEHOLDER = 'jxp';
const P_OPEN_RE = /<p(?=[\s>])([^>]*)>/gi;
const P_CLOSE_RE = /<\/p\s*>/gi;
const JXP_OPEN_RE = new RegExp(`<${P_TAG_PLACEHOLDER}(?=[\\s>])([^>]*)>`, 'gi');
const JXP_CLOSE_RE = new RegExp(`<\\/${P_TAG_PLACEHOLDER}\\s*>`, 'gi');

function protectParagraphTags(text) {
    return text
        .replace(P_OPEN_RE, (_, attrs) => `<${P_TAG_PLACEHOLDER}${attrs}>`)
        .replace(P_CLOSE_RE, `</${P_TAG_PLACEHOLDER}>`);
}

function restoreParagraphTags(text) {
    return text
        .replace(JXP_OPEN_RE, (_, attrs) => `<p${attrs}>`)
        .replace(JXP_CLOSE_RE, '</p>');
}

module.exports = { protectParagraphTags, restoreParagraphTags };
