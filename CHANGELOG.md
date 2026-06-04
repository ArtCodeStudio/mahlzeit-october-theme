# Changelog

Notable changes to this theme — kept so that when the theme is deployed/updated on
**production (WinterCMS)** we know exactly what changed and what to adjust. Format
loosely follows [Keep a Changelog](https://keepachangelog.com/).

> **Context:** This is originally an OctoberCMS theme. **Production runs WinterCMS
> (1.2.x)** and currently runs the **OctoberCMS-named plugins** (RainLab.\*,
> Renatio.\*, Xeor.\*, Samuell.\*) directly — their October‑1.x‑era versions are
> Winter‑compatible, so this works as‑is. Moving to WinterCMS forks is an
> *optional* modernization (see below), not a fix.

## 2026-06-04 — Voucher purchase page integration

`content/static-pages/gutschein-kaufen.htm` now uses the **JumpLink.Vouchers**
plugin instead of the static `jumplink-contact` form:

- New snippet partial `partials/jumplink-voucher-purchase.htm` renders the
  `voucherPurchase` (buy form → Mollie checkout) and `voucherReturn` (post-payment
  status + PDF download) components.
- `layouts/jumplink-barba.htm` attaches `[voucherPurchase]` + `[voucherReturn]`
  (same pattern as the existing `[eventList]`), so the snippet's `{% component %}`
  calls resolve and the AJAX handlers (`voucherPurchase::onPurchase`) route.
- The `jumplink-contact` figure on `gutschein-kaufen` was replaced with
  `data-snippet="jumplink-voucher-purchase.htm"`.
- The buy/return forms are styled to match the theme via **component partial
  overrides** (`partials/voucherPurchase/default.htm`,
  `partials/voucherReturn/default.htm`) using the theme's Bootstrap-4 classes
  (`form-control`, `btn btn-outline-warning`, grid) — the JumpLink.Vouchers
  plugin markup stays generic.

**Production requirement:** the **JumpLink.Vouchers** plugin must be installed
(provides `voucherPurchase`/`voucherReturn` + Mollie/PDF/QR; needs
`MOLLIE_API_KEY` + `VOUCHER_TOKEN_SECRET` in `.env`). Verify the full purchase
flow on the live page after deploy. (Component render verified locally on a
minimal layout; the full theme could not be rendered in the Winter dev because
of the SEO/contentType plugins.)

## 2026-06-04 — Dependency cleanup (`theme.yaml` `require:`)

Trimmed `require:` to the plugins the theme template actually uses:

| Plugin | Now | Why |
|---|---|---|
| RainLab.Pages | **required** | `staticPage` / `staticMenu` / `\|page` filter (heavy use) |
| Renatio.SeoManager | **required** | `seoTags` component (`<head>` SEO meta) |
| Xeor.ContentType | **required** | `contentType` page property (Content-Type header on XML/legal pages) |
| Samuell.ContentEditor | **required** | `contenteditor` component (~12 partials + legal pages) |
| RainLab.Translate | **removed** | not used (no `_()`/`__()` filters, no multilingual markup) |
| RainLab.Sitemap | **removed** | `/sitemap.xml` route only, no theme component → site-level |
| RainLab.GoogleAnalytics | **removed** | `googleTracker` render is commented out (opt-in) |
| ToughDeveloper.ImageResizer | **removed** | replaced by native `System\Classes\ImageResizer` + `.thumb()` / `\|resize` |
| Romanov.ClearCacheWidget | **removed** | backend-only widget, unrelated to the theme |

**Partial change:** removed the dead `[googleTracker]` component declaration from
`partials/jumplink-layout-barba-body.htm` (its render was already commented out;
analytics is now opt-in). **Note:** WinterCMS does **not** support soft (`@`)
components in *partial* INI sections (only page/layout) — so `seoTags` /
`googleTracker` cannot be made soft where they live.

## 2026-06-04 — Plugin modernization analysis (production WinterCMS)

Per-plugin recommendation. **The theme keeps working as-is on production today** —
this is a roadmap, not a forced change. Validate every change on a staging clone.

| Plugin (prod version) | Theme uses it? | Recommendation |
|---|---|---|
| RainLab.Pages 1.3.3 | ✅ heavy | **SWAP → Winter.Pages** *(do last, staging)* — page/menu content lives in theme files (no DB migration); risk = namespace rename `RainLab\Pages`→`Winter\Pages` + the two plugins conflict (remove old in the same step) |
| Renatio.SeoManager 1.3.3 | ✅ `seoTags` | **KEEP** — ⚠️ Winter.Seo's `seoTags` is **not** a drop-in (different data contract; theme has no `Meta::`/`Link::` wiring). Migrate only as a separate, scoped project. |
| Xeor.ContentType 1.1.4 | ✅ `contentType` | **KEEP** — no fork; runs on Winter as-is |
| Samuell.ContentEditor 1.3.1 | ✅ `contenteditor` | **KEEP** — no fork needed; optional bump 1.3.1 → 1.3.6 (bugfixes) |
| ToughDeveloper.ImageResizer 1.4.1 | ❌ | **DROP** — native resizer already used (safe win) |
| Romanov.ClearCacheWidget 1.3.1 | ❌ | **DROP** — use CLI (`php artisan cache:clear`), unless a non-CLI admin needs the button |
| RainLab.Builder 1.0.26 | ❌ | **DROP from prod** (dev-only tool); or swap → Winter.Builder in dev |
| RainLab.Sitemap 1.0.9 | ❌ (site `/sitemap.xml`) | **SWAP → Winter.Sitemap** — low risk; remove old in same step; verify `/sitemap.xml` |
| RainLab.GoogleAnalytics 1.2.4 | ❌ (commented) | **DROP** while analytics is off; swap → Winter.GoogleAnalytics or a GA4 snippet when wanted |
| October.Drivers 1.1.2 | ❌ | **INVESTIGATE → likely DROP** — Winter/Laravel cover SMTP + local + sync/db natively; only swap → Winter.Drivers if S3/SES/Mailgun is actually used (check `env`/`config/`) |
| Renatio.BackupManager 3.0.2 *(disabled)* | ❌ | **OPS decision** — leave disabled, or use `meb/wn-backup-plugin`. v3 targets Laravel 9+/PHP 8 — may not run on Winter 1.2. |
| Jumplink.ThemeSettings 1.0.1 *(disabled)* | ❌ | **Not a runtime dep** — `this.theme.*` is backed by the native `theme.yaml` `form:`; generator scripts already removed. Uninstall after confirming no DB-backed settings model is read. |
| JumpLink.Events 1.0.1 | ✅ `eventList` | **KEEP** (first-party) |
| JumpLink.Forms 1.0.0 | ✅ `Submission::store` (`class_exists`-guarded) | **KEEP** (first-party) |

### Production action plan (staging → verify → prod)

0. **Backup & stage** — snapshot the Winter DB + the active theme; do swaps on a staging copy.
1. **Safe drops (no theme change):** `ToughDeveloper.ImageResizer`, `Romanov.ClearCacheWidget`, `RainLab.Builder` (from prod).
2. **Investigate → act (config-driven, no theme change):** `October.Drivers` (check env/config → likely drop), `RainLab.GoogleAnalytics` (drop while off), `Renatio.BackupManager` (ops), `Jumplink.ThemeSettings` (confirm → uninstall).
3. **Low-risk swap:** `RainLab.Sitemap` → `winter/wn-sitemap-plugin` (remove old in the same step; verify `/sitemap.xml`).
4. **Highest-touch swap — do LAST, isolated:** `RainLab.Pages` → `winter/wn-pages-plugin`. Grep the theme(s) for `RainLab\Pages` / `RainLab.Pages` (mahlzeit is clean — only a comment), remove old + install Winter.Pages **together** (they conflict), update any custom PHP imports / viewBag refs, render-test all static pages + the footer/main menus. Then change `require:` `RainLab.Pages` → `Winter.Pages`.
5. **Do NOT touch:** `Renatio.SeoManager` (keep October — Winter.Seo is not a drop-in), `Samuell.ContentEditor`, `Xeor.ContentType`, `JumpLink.Events` / `JumpLink.Forms`.

### Caveats

- Recommendations are scoped to **this** theme. Other themes sharing these plugins on the same install must be grepped before a server-wide swap.
- `October.Drivers` / `RainLab.GoogleAnalytics` drop-vs-swap depends on the site's `env`/`config/` (mail/queue/storage transports; whether GA gets re-enabled).
- Winter forks declare composer `replace` for their RainLab/October counterparts (drop-in at the package level) — see [awesome-wintercms](https://github.com/wintercms/awesome-wintercms). Always validate on staging.
