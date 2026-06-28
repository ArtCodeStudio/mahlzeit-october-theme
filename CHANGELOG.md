# Changelog

Notable changes to this theme — kept so that when the theme is deployed/updated on
**production (WinterCMS)** we know exactly what changed and what to adjust. Format
loosely follows [Keep a Changelog](https://keepachangelog.com/).

> **Context:** This is originally an OctoberCMS theme. **Production runs WinterCMS
> (1.2.x)** and currently runs the **OctoberCMS-named plugins** (RainLab.\*,
> Renatio.\*, Xeor.\*, Samuell.\*) directly — their October‑1.x‑era versions are
> Winter‑compatible, so this works as‑is. Moving to WinterCMS forks is an
> *optional* modernization (see below), not a fix.

## 2026-06-28 — Voucher purchase page live on production

`feat/voucher-purchase-page` merged to `main` and deployed to production
(`mahlzeit-am-meer.de`). `/gutschein-kaufen` now renders the **JumpLink.Vouchers**
buy form instead of the old static page — this supersedes the "frontend NOT yet
live" note in the 2026-06-04 entry below.

- **Deployed:** the voucher theme files — `voucherPurchase`/`voucherReturn`
  component-partial overrides, the buy-page snippet + `jumplink-barba` component
  wiring, the segmented delivery/payment chooser, labelled quick-pick amounts, and
  the voucher background/preview assets. `theme.yaml` (`require: Winter.Pages`) and
  this CHANGELOG were already current on production and were left untouched.
- **Plugin:** JumpLink.Vouchers **1.0.23** (already installed on production).
- **Payments:** Mollie **live** key configured in `.env`; `APP_URL` is the public
  HTTPS domain, so per-payment webhook URLs resolve.
- **Mail:** the centred-body + top/side-padding fixes were applied to the live mail
  layout in the database earlier; the theme `email-templates/email-layout.htm`
  source now matches.
- **Locale:** set `config/app.php` `'locale' => 'de'` on production (was `'en'`;
  `fallback_locale` stays `'en'`). The site content is hardcoded German, but the
  voucher form is the first thing using Laravel `trans()`, which follows the
  framework locale — so on the default `'en'` it rendered English. Not a
  git-tracked file (Winter app skeleton), so noted here: a rebuilt prod app must
  set this again. Staging (CT 214) was already `'de'`.

## 2026-06-04 — JumpLink.Vouchers installed on production (frontend NOT yet live)

`jumplink/wn-vouchers-plugin` was installed on the live server so the theme's voucher
integration (branch `feat/voucher-purchase-page`) can go live later without
"component not registered" errors. **`main` is voucher-free and `/gutschein-kaufen`
still renders the pre-voucher page** — the frontend wiring is intentionally not deployed.

- **Plugin:** directory install at `plugins/jumplink/vouchers` (current `main`, plugin version **1.0.3**), kept as a git checkout for updates.
- **Runtime deps** pulled into the app vendor via Composer (Winter has no Laravel package auto-discovery): `mollie/mollie-api-php ^3.13`, `barryvdh/laravel-dompdf ^3.1`, `endroid/qr-code ^6.0` — 16 packages total, **0 changes to the existing Laravel-9 core tree**.
- **Migrations:** `php artisan winter:up` created `jumplink_vouchers_vouchers`, `jumplink_vouchers_voucher_orders`, `jumplink_vouchers_redemptions`.
- **Verified:** components `voucherPurchase` / `voucherReturn` / `voucherPos` register; plugin + Mollie + DomPDF + QrCode classes autoload; backend boots; zero frontend impact.
- **Prod environment (for plugin work):** WinterCMS 1.2.9 / Laravel 9 / PHP 8.4 / nginx + php-fpm / MySQL. Run CLI as `sudo -u www-data php artisan …`; `tinker` needs a writable `HOME` (`HOME=/tmp/h sudo -u www-data php artisan tinker --execute='…'`). Mail is native System SMTP via **smtp.strato.de** (the `.env` Mailgun values are dead). Queue is `sync`. `register()` registers the dompdf service provider guarded by `class_exists()` and sets `dompdf.public_path = base_path()` (Winter has no `public/` web root) — keep that.

**Still required before the voucher feature can go live:** (1) `MOLLIE_API_KEY` in `.env` (test `test_…`, then live); (2) configure backend **Settings → Vouchers** (VAT, Mollie mode, sender/notification addresses, PDF); (3) a publicly reachable Mollie **webhook** URL (the webhook is the sole voucher-issuing authority); (4) merge `feat/voucher-purchase-page` → `main`, deploy, and test the purchase flow end-to-end with a test key.

## 2026-06-04 — Executed on production (plugin modernization)

The roadmap below was carried out on the live WinterCMS install. Full backup first
(Proxmox `vzdump` of the container + DB dump + files tarball); `cache:clear` and HTTP
checks (home, `/datenschutz`, `/sitemap.xml`, backend) after every phase.

**Removed (unused / superseded):**
- `ToughDeveloper.ImageResizer` — native `System\Classes\ImageResizer` + `|resize` already in use.
- `Romanov.ClearCacheWidget` — backend-only button; use `php artisan cache:clear`.
- `RainLab.Builder` — dev/scaffolding tool, not needed on production.
- `RainLab.GoogleAnalytics` — frontend tracking is off (commented out).
- `Jumplink.ThemeSettings` — was disabled; `this.theme.*` is backed by the native `theme.yaml` `form:`.
- `October.Drivers` — empty stub; mail is native System SMTP, queue `sync`, storage `local` (no S3/SES/Mailgun-API).
- `Renatio.BackupManager` — was disabled; host-level Proxmox backups used instead.

**Swapped to Winter forks (composer):**
- `RainLab.Sitemap` → `winter/wn-sitemap-plugin` (Winter.Sitemap 2.2.2).
- `RainLab.Pages` → `winter/wn-pages-plugin` (Winter.Pages 2.2.1). Static-page content lives in theme files (no DB migration). Performed under maintenance mode.

**Added:**
- `Mahlzeit.Compat` (`plugins/mahlzeit/compat`) — aliases `RainLab\Pages\Classes\Page` → `Winter\Pages\Classes\Page` so the kept `Renatio.SeoManager` still attaches its SEO fields to static pages after the Pages swap. Guarded no-op when not applicable.

**Notes:**
- `theme.yaml` `require:` updated `RainLab.Pages` → `Winter.Pages`.
- `Winter.Sitemap` uses a new table (`winter_sitemap_definitions`); an **empty** definition was recreated so `/sitemap.xml` returns 200. It has **no URLs yet** — populate it (CMS + static pages) for real SEO value.
- Per-static-page SEO `viewBag` fields were exported to a machine-readable JSON backup before the swap.
- Plugin count 14 → 7 (+ Mahlzeit.Compat). Kept unchanged: `Renatio.SeoManager`, `Samuell.ContentEditor`, `Xeor.ContentType`, `JumpLink.Events`, `JumpLink.Forms`.
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
