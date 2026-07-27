# Phase 3 — Connecting to Shopify

Everything in this file is blocked on the client creating the Shopify store and
granting access. Work through it top to bottom.

Shopify CLI is already installed on this machine (**v4.5.2**), so step 1 is just
a version check, not an install.

---

## 1. Verify tooling

```bash
shopify version
```

Expect `4.5.2` or newer. If it is missing on another machine:

```bash
npm install -g @shopify/cli@latest
```

---

## 2. Log in and preview locally

Run from the theme directory (`.../Apex New Shopify/Build`).

```bash
shopify theme dev --store apex-coatings.myshopify.com
```

Replace the store handle with the real one. On first run this opens a browser to
authenticate — the **client must be logged into Shopify admin**, or must have
invited you as staff with *Themes* permission first.

It then serves the theme at <http://127.0.0.1:9292> with hot reload. Edits to
`.liquid` files appear on save.

> This is the first time any of this theme will be rendered. Expect a round of
> spacing and sizing corrections — all CSS to date has been written without a
> browser to check it against.

---

## 3. Push the theme as a draft

Never push straight to live. Create an unpublished theme first:

```bash
shopify theme push --unpublished --theme "Apex Custom v1"
```

Then in **Online Store → Themes**, use *Preview* on that draft. Only publish once
the client has signed off.

To pull down changes the client made in the theme editor:

```bash
shopify theme pull --theme "Apex Custom v1"
```

---

## 4. Lint before every push

```bash
shopify theme check
```

Currently: **183 files, 0 errors, 8 warnings** — all 8 are in stock Dawn files
(`main-product`, `main-search`, `theme.liquid`, etc.) and shipped that way from
Shopify. Every `apex-*` file is clean.

If a new warning appears in an `apex-*` file, it is ours and worth fixing.

---

## 5. Connect the GitHub repo (optional but recommended)

In **Online Store → Themes → Add theme → Connect from GitHub**, authorise
Shopify and pick `unit6854/Apex-2`, branch `main`.

Trade-offs worth knowing before enabling this:

- Commits to `main` deploy to the connected theme automatically.
- Changes the client makes in the theme editor get **committed back** to the
  repo by Shopify. Expect commits you did not write.
- If you also use `shopify theme push`, the two can fight. Pick one workflow.

Safest arrangement: connect a `production` branch rather than `main`, and merge
into it deliberately.

**Note:** the repo currently has no remote pushes. Run `git push -u origin main`
before connecting, or Shopify will not see the work.

---

## 6. Rebuild the navigation menus

Menus live in the Shopify admin, **not** in theme code, so none of this is in the
repo. Recreate under **Content → Menus**.

### Main menu (handle: `main-menu`)

| Item | Link |
|---|---|
| Home | Home page |
| Products | Collection: All products |
| PMAGs | Page: PMAGs |
| Zippos | Page: Zippos |
| 1911 Grips | Page: 1911 Grips |
| Services | Page: Services |
| Gallery | Page: Gallery |
| 🎖️ Heroes | Page: Heroes |
| Contact | Page: Contact |

The header renders any link whose URL contains `heroes` in brand gold
automatically, so keep that page handle as `heroes`.

Nine top-level items is a lot. The blueprint shows six. Consider nesting PMAGs,
Zippos and 1911 Grips **under** Products — the header is set to `dropdown`, so
children appear in a dropdown and the top bar stays clean.

### Footer menu (handle: `footer`)

Both footer link columns currently point at a single `footer` menu. Either build
one combined menu, or create two menus and repoint the blocks in
`sections/footer-group.json`.

**Services column:** Laser Engraving · Cerakote Application · Custom PMAG
Engraving · 1911 Grip Panels · Metal Polishing · 🎖️ Heroes Discount

**Company column:** Home · Products · Gallery · 🎖️ Heroes Discount · Contact · Cart

---

## 7. Create the pages and assign templates

Under **Content → Pages**, create each page, then set **Theme template** in the
right sidebar.

| Page | Handle | Template |
|---|---|---|
| Services | `services` | `page.services` |
| Heroes Discount | `heroes` | `page.heroes` |
| Gallery | `gallery` | `page.gallery` |
| PMAGs | `pmags` | `page.landing` |
| Zippos | `zippos` | `page.landing` |
| 1911 Grips | `1911-grips` | `page.landing` |
| Contact | `contact` | `page.contact` |

`page.landing` is the reusable one — create the page, pick the template, then
edit copy and images in the theme customiser. That is how the client makes new
category pages without a developer.

---

## 8. Products

### Quote-only products

Create these, then set **Theme template → `quote`** on each. They render a quote
request form instead of add-to-cart and never enter checkout.

| Product | Starting price |
|---|---|
| Custom pistol slide engraving | $95 |
| AR-15 / AR-10 Cerakoting | $100 |
| Custom knife engraving | $30 |
| Handgun Cerakoting | $100 |

Set the price to the "starting at" figure — the template displays it as
*Starting at $X* and never as a purchasable amount.

### Standard products

Custom 1911 Grips ($90) and Custom PMAG Engraving ($35) sell normally — leave
them on the default `product` template.

### Optional spec line

To show the material line under the title (e.g. *Steel / Stainless steel*),
create a product metafield under `custom`, then put its key in the quote
section's **Specification metafield key** setting.

---

## 9. Images

The legacy theme has 98 curated photos at:

```
C:\Users\unit_\Local Sites\apex-coatings-and-engraving\app\public\wp-content\themes\apex-block-theme\assets\images\
```

- `products/` — 40
- `pmags/` — 32 designs
- `slideshow/` — 20
- `1911-grips/` — 4, `zippos/` — 1

These belong in **product records** and **Content → Files**, not in the theme.
Theme assets are size-capped and images there cannot be used as product images.

Brand chrome is already in `assets/` and needs no upload.

**Logo and favicon:** the theme falls back to the packaged Apex lockups, so it
looks right out of the box. To let the client control them, upload via
**Theme settings → Logo** and **Favicon** — an uploaded file overrides the
fallback automatically.

---

## 10. Store configuration

- **Contact email** — the quote form posts through Shopify's contact form, which
  emails the address in **Settings → Store details → Sender email**. Confirm the
  client wants quotes going there, likely `orders@apexcoatingstn.com`.
- **Policies** — the footer links to refund/privacy/terms. Fill them in under
  **Settings → Policies** or the links render empty.
- **Payments, shipping, taxes** — client decision, not ours.

---

## Known gaps to raise with the client

**Quote form cannot accept file uploads.** Shopify's built-in contact form has no
file field. The legacy site invited customers to send artwork. Current workaround
is a URL field for a Dropbox/Drive link. Real options:

1. A file-upload app from the App Store — roughly $5–15/month, simplest
2. Shopify Forms — free and Shopify-made, but replaces the custom form
3. A custom app writing to Files via API — most work

Recommend launching with the link field and revisiting if customers struggle.

**Nothing in this theme has been rendered in a browser yet.** Theme Check passes
with zero errors and every template validates structurally, but that does not
confirm visual correctness. Budget a correction pass after step 2.

---

## Quick reference

```bash
shopify theme dev --store STORE.myshopify.com    # local preview, hot reload
shopify theme check                              # lint
shopify theme push --unpublished --theme "NAME"  # upload as draft
shopify theme pull --theme "NAME"                # pull editor changes down
shopify theme list                               # themes on the store
shopify auth logout                              # switch accounts
```
