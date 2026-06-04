# Changelog

Notable changes to this theme — kept so that when the theme is updated on
**production (WinterCMS)** we know exactly what changed and what the production
install must provide for the theme to keep rendering. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

> **Context:** This is originally an OctoberCMS theme, but **production runs
> WinterCMS** (1.2.x). Most OctoberCMS plugins have WinterCMS forks/equivalents
> (see [awesome-wintercms](https://github.com/wintercms/awesome-wintercms)).

## 2026-06-04 — Dependency cleanup

### `theme.yaml` `require:` trimmed to what the theme actually uses

| Plugin (declared name) | Now | Provides / why |
|---|---|---|
| RainLab.Pages | **required** | `staticPage`, `staticMenu`, `viewBag` — on Winter this is **Winter.Pages** |
| Samuell.ContentEditor | **required** | `contenteditor` component (Winter-compatible as-is) |
| Renatio.SeoManager | **required** | `seoTags` component (SEO meta in `<head>`) |
| Xeor.ContentType | **required** | `contentType` page property (sets the Content-Type header on XML/legal pages) |
| RainLab.Translate | **removed** | not used by the theme — no `_()`/`__()` filters, no multilingual markup |
| RainLab.Sitemap | **removed** (optional) | provides the `/sitemap.xml` route, not a theme component → optional, site-level |
| RainLab.GoogleAnalytics | **removed** (opt-in) | analytics; the `googleTracker` render was already commented out |
| ToughDeveloper.ImageResizer | **removed** | image resizing already uses the native `System\Classes\ImageResizer` (`partials/jumplink-snippet-gallery.htm`) plus native `.thumb()` / `\|resize` — no ToughDeveloper-specific code anywhere |
| Romanov.ClearCacheWidget | **removed** | backend-only cache widget, unrelated to the theme |

### Partials

- `partials/jumplink-layout-barba-body.htm`: removed the dead `[googleTracker]`
  component declaration (its render was already commented out). Analytics is now
  **opt-in** (see the inline comment: install RainLab.GoogleAnalytics + declare
  `[googleTracker]` + uncomment the render).
  - **Note:** WinterCMS does **not** support soft (`@`) components declared in a
    *partial* INI section — only in page/layout INI (`renderPartial` calls
    `makeComponent($name)` without the soft flag). So `seoTags`/`googleTracker`
    cannot be made soft where they live; they are kept hard / removed instead.

### What production (WinterCMS) must provide for the theme to render

Required components → plugin:

- `staticPage` / `staticMenu` / `viewBag` → **Winter.Pages** ✅
- `contenteditor` → **Samuell.ContentEditor** ✅
- `eventList` → **JumpLink.Events** ✅ (custom plugin)
- `seoTags` → SEO plugin providing the `seoTags` component (October: Renatio.SeoManager).
  **➜ Verify the WinterCMS equivalent is installed and registers `seoTags`.**
- `contentType` → content-type plugin (October: Xeor.ContentType).
  **➜ Verify the WinterCMS equivalent, or that XML/legal pages still set their Content-Type.**
- `slideshow` (used by `partials/jumplink-snippet-slideshow.htm` → `[slideshow ...]`)
  **➜ Verify which plugin provides this component.**

**No production change is forced by these edits** — `require:` only affects fresh
installs / the declared dependency list. Plugins removed from `require:` that the
production site still uses (Translate, Sitemap, GoogleAnalytics) stay installed
and keep working.

### TODO — reconcile `require:` to WinterCMS plugin codes

`require:` still lists the **October** names. Since production is WinterCMS,
reconcile to the actual Winter plugin codes (e.g. `RainLab.Pages` → `Winter.Pages`,
and the Winter equivalents of Renatio.SeoManager / Xeor.ContentType). Source of
truth: `php artisan plugin:list` on the production container.
