# Launch plan — build, test, then switch the domain

The guiding rule: **nothing before Part 3 touches the live site.** The old
WordPress site keeps serving apexcoatingstn.com the entire time we build and
test, because the domain still points at the old host until we deliberately
change one DNS record at the very end.

---

## What your current setup looks like

Checked live on 2026-07-27:

| Thing | Current value | What it means |
|---|---|---|
| Website IP | `66.29.146.207` | Namecheap shared hosting — the WordPress site |
| `www` | CNAME to the root domain | Standard |
| Nameservers | `dns1/dns2.namecheaphosting.com` | **DNS is managed in cPanel, not the Namecheap "Advanced DNS" tab** |
| Email (MX) | `mx1/mx2/mx3-hosting.jellyfish.systems` | `orders@apexcoatingstn.com` is hosted with the Namecheap hosting plan |

Two consequences worth reading twice:

**1. You edit DNS in cPanel, not the domain dashboard.** Because the nameservers
point at `namecheaphosting.com`, the Advanced DNS tab on the domain is inactive.
The live records live in **cPanel → Zone Editor**.

**2. Your business email rides on that hosting plan.** The MX records point at
Namecheap's hosting mail servers. So:

- **Never delete or edit the MX records.** Pointing the website at Shopify does
  not affect email — as long as you only change the `A` and `www` records.
- **Do not cancel the Namecheap hosting after launch** until email has been moved
  somewhere else. Cancelling the plan takes `orders@apexcoatingstn.com` with it.

Sorting out email is a separate job from this launch. Keep the hosting running.

---

# Part 1 — Build and test

Old site stays up. No DNS changes. Nothing here can break anything.

## Step 1 — Find your store handle

Log into Shopify admin. Look at the browser address bar:

```
admin.shopify.com/store/apex-coatings-engraving
                        ^^^^^^^^^^^^^^^^^^^^^^^^ this bit
```

Your store address is that plus `.myshopify.com`. Every Shopify store has one
permanently, and it works regardless of what your real domain does. **This is
what we test on.**

## Step 2 — Password-protect the store

In Shopify admin: **Online Store → Preferences → Restrict store access**.

Turn it on and set a password. This stops Google indexing the half-built store
and stops customers stumbling in. It also means two versions of the business can
sit online at once without competing in search results.

Leave this on until the very last step.

## Step 3 — Start the local preview

In your terminal, from the Build folder:

```bash
shopify theme dev --store apex-coatings-engraving.myshopify.com
```

A browser opens asking you to log into Shopify. Approve it. The terminal keeps
running — that is correct, leave it open.

Then open <http://127.0.0.1:9292>.

This is the first time the theme renders. Expect it to look broadly right and
need spacing corrections. Send a screenshot and we fix from there.

Press `Ctrl + C` in the terminal to stop it.

## Step 4 — Upload as a draft theme

Once the preview looks good, in a **second** terminal:

```bash
shopify theme push --unpublished --theme "Apex Custom v1"
```

`--unpublished` is the important word. It uploads as a draft. Even your
`.myshopify.com` address keeps showing whatever theme is currently published.

Find it under **Online Store → Themes → Unpublished**.

## Step 5 — Share it for review

On that draft theme, click **⋯ → Preview**, then **Share preview**. That gives a
link the client can open on their phone without logging in and without anything
being published.

## Step 6 — Fill in the store

This is the bulk of the remaining work and none of it is code:

- **Content → Menus** — build the main and footer menus
- **Content → Pages** — create each page, then set its template in the right sidebar
- **Products** — create products; set quote-only ones to the `quote` template
- **Content → Files** — upload the 98 photos from the old theme
- **Settings → Policies** — refund, privacy, terms (the footer links to these)

Details for each are at the bottom of this file.

---

# Part 2 — Before you switch

Work through this on the `.myshopify.com` store. Do not proceed until every line
is true.

- [ ] Every page loads and looks right on phone and desktop
- [ ] Menus go where they should, no dead links
- [ ] A test order goes through checkout end to end
- [ ] The quote form arrives at `orders@apexcoatingstn.com` — **send a real test**
- [ ] Product images all present, none broken
- [ ] Policies filled in
- [ ] Shipping rates and taxes configured
- [ ] Payment provider live and tested
- [ ] Client has seen it and signed off

**Write down every URL on the old site** before switching — old WordPress links
like `/services` or `/pmags` should land somewhere sensible on the new site.
Anything that changes needs a redirect under **Online Store → Navigation → URL
Redirects**, or you lose that Google ranking.

---

# Part 3 — Go live

Only now does anything visible change. Total downtime should be zero, but plan
this for a quiet weekday morning, not a Friday evening.

## Step 7 — Lower the TTL first (do this a day ahead)

TTL is how long the internet caches your DNS. Lower it *before* the switch and
the change propagates in minutes instead of hours.

1. Log into Namecheap → **Hosting List** → **Go to cPanel**
2. Open **Zone Editor** → **Manage** for apexcoatingstn.com
3. Find the `A` record for `apexcoatingstn.com` and the `CNAME` for `www`
4. Change **only their TTL** to `300` (5 minutes). Change nothing else.
5. Wait 24 hours

## Step 8 — Add the domain in Shopify

In Shopify admin: **Settings → Domains → Connect existing domain**.

Type `apexcoatingstn.com` and click Next. Shopify shows you what to set and will
say "not connected" — expected, we have not pointed it yet.

## Step 9 — Change the two records in cPanel

Back in **cPanel → Zone Editor**. You are changing **two records only**.

**Record 1 — the root domain**

| Field | Value |
|---|---|
| Type | `A` |
| Name | `apexcoatingstn.com` |
| Value | change `66.29.146.207` → `23.227.38.65` |
| TTL | `300` |

**Record 2 — www**

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `www` |
| Value | change to `shops.myshopify.com` |
| TTL | `300` |

> `23.227.38.65` is Shopify's address and is the same for every store. It is not
> specific to you and you do not need to look it up.

**Do not touch anything else.** In particular leave every `MX` record exactly as
it is, or email stops.

If cPanel refuses to let you edit the root `A` record, that usually means an
"Addon Domain" or parked-domain entry is holding it. Namecheap support will
clear it in a few minutes over live chat — that is a normal request.

## Step 10 — Verify

Wait ten minutes, then check from your machine:

```bash
nslookup apexcoatingstn.com
```

You want `23.227.38.65`. If you still see `66.29.146.207`, wait longer — your
computer may have cached it. <https://dnschecker.org> shows what the rest of the
world sees.

Back in **Settings → Domains**, click **Verify connection**. Shopify issues an
SSL certificate automatically; it can take up to 48 hours, though it is usually
much faster. The padlock appears when it is done.

## Step 11 — Actually go live

In this order:

1. **Settings → Domains** — set apexcoatingstn.com as the **primary** domain
2. **Online Store → Themes** — publish "Apex Custom v1"
3. **Online Store → Preferences** — turn **off** Restrict store access

The new site is now live. Check the padlock shows on `https://apexcoatingstn.com`
and on `https://www.apexcoatingstn.com`.

---

## If something goes wrong

Change the `A` record in cPanel back to `66.29.146.207` and the `www` CNAME back
to what it was. The old WordPress site returns within minutes because you
lowered the TTL.

**This only works while the old site still exists.** Which is why:

## After launch — leave the old setup alone for a month

- **Do not cancel the Namecheap hosting.** Your email lives there, and it is your
  rollback.
- **Do not delete the WordPress install.**
- Watch Shopify analytics and Google Search Console for a few weeks
- Once email has been moved elsewhere and traffic looks healthy, revisit

---

## Reference — filling in the store

### Menus (Content → Menus)

**Main menu** — Home, Products, PMAGs, Zippos, 1911 Grips, Services, Gallery,
🎖️ Heroes, Contact.

The header renders any link whose URL contains `heroes` in brand gold
automatically, so keep that page handle as `heroes`.

Nine top-level items is a lot and the design blueprint shows six. Consider
nesting PMAGs, Zippos and 1911 Grips **under** Products — the header is set to
`dropdown`, so children appear on hover and the top bar stays clean.

**Footer menu** — Services column: Laser Engraving, Cerakote Application, Custom
PMAG Engraving, 1911 Grip Panels, Metal Polishing, 🎖️ Heroes Discount. Company
column: Home, Products, Gallery, 🎖️ Heroes Discount, Contact, Cart.

Both footer columns currently point at one menu named `footer`. Either combine
them or make two menus and repoint the blocks in `sections/footer-group.json`.

### Pages (Content → Pages)

| Page | Handle | Template |
|---|---|---|
| Services | `services` | `page.services` |
| Heroes Discount | `heroes` | `page.heroes` |
| Gallery | `gallery` | `page.gallery` |
| PMAGs | `pmags` | `page.landing` |
| Zippos | `zippos` | `page.landing` |
| 1911 Grips | `1911-grips` | `page.landing` |
| Contact | `contact` | `page.contact` |

`page.landing` is the reusable one. Create the page, pick the template, then edit
copy and images in the theme customiser. That is how new category pages get made
without a developer.

### Products

**Quote-only** — set **Theme template → `quote`** on each. They show a quote form
instead of add-to-cart and never enter checkout. Set the price to the "starting
at" figure; the template shows it as *Starting at $X*.

| Product | Starting price |
|---|---|
| Custom pistol slide engraving | $95 |
| AR-15 / AR-10 Cerakoting | $100 |
| Custom knife engraving | $30 |
| Handgun Cerakoting | $100 |

**Standard** — Custom 1911 Grips ($90) and Custom PMAG Engraving ($35) sell
normally on the default template.

### Images

98 photos are at:

```
C:\Users\unit_\Local Sites\apex-coatings-and-engraving\app\public\wp-content\themes\apex-block-theme\assets\images\
```

`products/` 40 · `pmags/` 32 · `slideshow/` 20 · `1911-grips/` 4 · `zippos/` 1

These go into **product records** and **Content → Files** — not the theme. Brand
logos and the favicon are already packaged in the theme and need no upload.

---

## Known gaps

**The quote form cannot accept file uploads.** Shopify's built-in contact form
has no file field. There is a URL field for a Dropbox or Drive link instead.
Real options: a file-upload app (~$5–15/month), Shopify Forms (free, but replaces
the custom form), or a custom app. Suggest launching with the link field.

**Nothing has been rendered in a browser yet.** Theme Check passes with zero
errors and all 17 templates validate, but that is structure, not appearance.
Budget a correction pass after Step 3.

---

## Commands

```bash
shopify theme dev --store STORE.myshopify.com     # local preview, hot reload
shopify theme check                               # lint
shopify theme push --unpublished --theme "NAME"   # upload as draft
shopify theme pull --theme "NAME"                 # pull editor changes down
shopify theme list                                # themes on the store
nslookup apexcoatingstn.com                       # where the domain points
```
