# Apex Shopify Theme — Build Status & Next Steps

**Last Updated:** 2026-07-27  
**Status:** ✅ Phase 1 Complete — Theme renders locally without errors  
**Next:** Part 2 — Fill store content before DNS switch

---

## Quick Start (Next Session)

```bash
cd "C:\Users\unit_\Downloads\Custom Websites\Apex New Shopify\Build"
shopify theme dev --store apex-coatings-engraving.myshopify.com
```

Then open <http://127.0.0.1:9292> in browser.

---

## Current State

### What's Done ✅
- **Theme structure:** 7 sections, 4 templates, all passing theme-check with 0 errors
- **Homepage rendering:** Desktop & mobile views confirmed working
- **Brand system:** Colors, fonts, cursor, momentum scroll all integrated
- **Button system:** Sheen-sweep, fill-scaleX, press-glow animations live
- **Schema errors:** Fixed (overlay_opacity defaults corrected from 78 → 75)
- **GitHub:** All commits pushed (9 Apex commits preserved after shallow-clone fix)

### What's Left (Part 2)
Before you can go live, complete this checklist in Shopify admin:

- [ ] Create main menu (Content → Menus)
- [ ] Create footer menu (Content → Menus)
- [ ] Create pages and assign templates (Content → Pages)
- [ ] Create quote-only products (6 total)
- [ ] Create standard products (2 total)
- [ ] Upload 98 images (Content → Files)
- [ ] Fill policies (Settings → Policies)
- [ ] Configure shipping & taxes
- [ ] Test checkout flow
- [ ] Client approval

---

## Part 2 Setup Instructions

### 1. Create Menus (Content → Menus)

#### Main Menu
```
Home → /
Products → (parent, no link, children below)
  ├─ PMAGs → /pages/pmags
  ├─ Zippos → /pages/zippos
  └─ 1911 Grips → /pages/1911-grips
Services → /pages/services
Gallery → /pages/gallery
🎖️ Heroes → /pages/heroes
Contact → /pages/contact
```

#### Footer Menu
**Services Column:**
- Laser Engraving → /pages/services
- Cerakote Application → /pages/services
- Custom PMAG Engraving → /pages/pmags
- 1911 Grip Panels → /pages/1911-grips
- Metal Polishing → /pages/services
- 🎖️ Heroes Discount → /pages/heroes

**Company Column:**
- Home → /
- Products → /collections/all
- Gallery → /pages/gallery
- 🎖️ Heroes Discount → /pages/heroes
- Contact → /pages/contact
- Cart → /cart

### 2. Create Pages & Assign Templates (Content → Pages)

| Page Name | Handle | Template | Notes |
|-----------|--------|----------|-------|
| Services | `services` | `page.services` | Services overview |
| Heroes Discount | `heroes` | `page.heroes` | First responders discount |
| Gallery | `gallery` | `page.gallery` | Portfolio showcase |
| PMAGs | `pmags` | `page.landing` | Reusable category template |
| Zippos | `zippos` | `page.landing` | Reusable category template |
| 1911 Grips | `1911-grips` | `page.landing` | Reusable category template |
| Contact | `contact` | `page.contact` | Contact form |

**To assign template:**
1. Create page
2. In right sidebar, scroll to "Theme template"
3. Select from dropdown
4. Save

### 3. Create Quote-Only Products

Set **Theme template → `quote`** on each. They show a quote form instead of add-to-cart.

| Product | Price | Description |
|---------|-------|-------------|
| Custom pistol slide engraving | $95 | Engraved slides for handguns |
| AR-15 / AR-10 Cerakoting | $100 | Precision cerakote finish |
| Custom knife engraving | $30 | Personalized blade engraving |
| Handgun Cerakoting | $100 | Full cerakote service |

### 4. Create Standard Products

| Product | Price | Template |
|---------|-------|----------|
| Custom 1911 Grips | $90 | Default (product.json) |
| Custom PMAG Engraving | $35 | Default (product.json) |

### 5. Upload Images (Content → Files)

98 photos from legacy WordPress theme. Location:
```
C:\Users\unit_\Local Sites\apex-coatings-and-engraving\app\public\wp-content\themes\apex-block-theme\assets\images\
```

Organize by folder:
- `products/` — 40 images
- `pmags/` — 32 images
- `slideshow/` — 20 images
- `1911-grips/` — 4 images
- `zippos/` — 1 image

**Note:** Brand logos and favicon already in theme, no upload needed.

### 6. Fill Policies (Settings → Policies)

- **Refund Policy** — what you're currently offering
- **Privacy Policy** — data collection & GDPR compliance
- **Terms of Service** — purchase terms

Footer links to these automatically.

### 7. Configure Shipping & Taxes

In **Settings → Shipping and delivery:**
- Add rates for your service area
- Set handling times if needed

In **Settings → Taxes:**
- Configure sales tax if applicable

### 8. Set Up Payment

In **Settings → Payment providers:**
- Connect Stripe or other processor
- Test a dummy transaction

### 9. Test Quote Form

Before launch, **send a real test quote request** to `orders@apexcoatingstn.com` and verify:
- Form submits successfully
- Email arrives with all fields
- No spam filters

---

## Key Files & Paths

### Theme Files (C:\Users\unit_\...\Apex New Shopify\Build\)

**Core sections** (7 total, all error-free):
- `sections/apex-hero.liquid` — Hero banner with stats & quick links
- `sections/apex-split-feature.liquid` — Media + text + checklist
- `sections/apex-feature-grid.liquid` — 4-col card grid (steps or features)
- `sections/apex-cta-band.liquid` — Full-width closing CTA
- `sections/apex-gallery.liquid` — Portfolio grid
- `sections/apex-testimonials.liquid` — 3-col review cards
- `sections/main-product-quote.liquid` — Quote-only product page

**Reusable templates** (4 validated):
- `templates/index.json` — Homepage (pre-configured)
- `templates/page.landing.json` — Reusable category pages (PMAGs, Zippos, 1911 Grips)
- `templates/page.services.json` — Services overview
- `templates/page.heroes.json` — Heroes discount page
- `templates/page.gallery.json` — Gallery standalone
- `templates/product.quote.json` — Routes quote products to main-product-quote

**Global brand system** (rendered on every page):
- `snippets/apex-variables.liquid` — Brand tokens, button CSS, animations
- `snippets/apex-section-header.liquid` — Reusable heading component
- `assets/apex-interactions.js` — Cursor glow, momentum scroll (with prefers-reduced-motion)

**Configuration:**
- `config/settings_schema.json` — Theme settings editor schema
- `config/settings_data.json` — Current color schemes (all Apex palette), fonts (Barlow), effects toggle
- `locales/en.default.json` — All storefront text (translatable)
- `locales/en.default.schema.json` — Editor labels

**Brand assets:**
- `assets/apex-logo-nav.webp` — Compact logo for header (150px)
- `assets/apex-logo-footer.webp` — Full lockup for footer (220px)
- `assets/apex-logo-icon.webp` — Mark only (favicon)

---

## Store Handle & URLs

- **Store Handle:** `apex-coatings-engraving`
- **Shopify Store URL:** `https://apex-coatings-engraving.myshopify.com`
- **Live Domain (after DNS):** `https://apexcoatingstn.com`
- **Email for quote form:** `orders@apexcoatingstn.com`

---

## Color Palette (Apex Brand)

All 5 Shopify color schemes remapped to Apex colors:

| Scheme | Background | Text | Button | Use Case |
|--------|------------|------|--------|----------|
| scheme-1 | White | Black | Orange (#F5831F) | Light/white pages |
| scheme-2 | Off-white | Black | Orange | Subtle white sections |
| scheme-3 | Dark (#1A1A1A) | White | Orange | Dark hero/CTA |
| scheme-4 | Very dark (#111111) | White | Gold (#FFAD00) | Darkest sections |
| scheme-5 | Orange gradient | White | Black | Gradient backgrounds |

Primary colors:
- **Apex Orange:** `#F5831F`
- **Apex Gold:** `#FFAD00`
- **Dark text:** `#1A1A1A`
- **White:** `#FFFFFF`

---

## Useful Commands

```bash
# Start local dev server (auto hot-reload)
shopify theme dev --store apex-coatings-engraving.myshopify.com

# Lint theme (must pass before going live)
shopify theme check

# Upload as draft (for client review)
shopify theme push --unpublished --theme "Apex Custom v1"

# Pull changes from Shopify editor (syncs back down)
shopify theme pull --theme "Development"

# List all themes on store
shopify theme list

# Check DNS pointing
nslookup apexcoatingstn.com
```

---

## Part 3 — Go Live (Later)

Once Part 2 is complete and client approves, follow **PHASE-3.md** for the DNS cutover:

1. **24 hours before switch:** Lower TTL to 300 (5 min) in cPanel
2. **Switch day:** Change A record (66.29... → 23.227.38.65) and www CNAME in cPanel
3. **Verify:** `nslookup apexcoatingstn.com` should show 23.227.38.65
4. **Publish:** Set domain as primary in Shopify, publish theme, disable password protection
5. **Rollback plan:** If needed, change A record back to 66.29... (old site returns in 5 min)

Full instructions in `PHASE-3.md` (lines 139–239).

---

## Troubleshooting

### Dev server won't start
- Make sure you're in the Build folder: `cd "C:\Users\...\Apex New Shopify\Build"`
- Kill any existing `shopify theme dev` processes
- Restart with `shopify theme dev --store apex-coatings-engraving.myshopify.com`

### Schema validation errors appear
- All known errors fixed (overlay_opacity: 75 in sections & templates)
- Run `shopify theme check` to verify
- If new errors, check min/max/step ranges in range settings

### Images not showing
- Upload via Content → Files, not directly in editor
- For product images, upload in each product's details
- For section images, pick via image picker in theme customizer

### Quote form not receiving emails
- Verify form is set to mail to `orders@apexcoatingstn.com`
- Check spam folder
- Test with a real submission before launch
- Shopify contact forms only support: text, email, phone, URL, textarea, select (no file upload)

---

## Next Steps (In Order)

1. **Create menus** in Shopify admin (this session or next)
2. **Create pages** and assign templates
3. **Create products** (quote-only + standard)
4. **Upload 98 images** from legacy site
5. **Fill policies** and configure shipping/taxes
6. **Test quote form** — send real submission
7. **Client approval** — share preview link
8. **Checklist review** — ensure Part 2 complete
9. **Schedule DNS switch** — execute Part 3 (PHASE-3.md)

---

## Contact & Support

**Store email:** `orders@apexcoatingstn.com` (must keep Namecheap hosting running — email lives there)
**Domain:** `apexcoatingstn.com` (Namecheap with cPanel DNS)
**Shopify store:** `apex-coatings-engraving.myshopify.com` (testing happens here first)
