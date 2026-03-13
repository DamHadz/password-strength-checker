# 🔐 PassGuard — Password Strength Checker

A production-ready, SEO-optimized password strength checker with AdSense monetization support.

## ✅ Features
- Real-time strength meter (Weak / Medium / Strong / Very Strong)
- Estimated crack time (based on 10B guesses/sec offline attack)
- Entropy calculation
- Detection: common passwords, dictionary words, repeated chars, sequential patterns
- Smart improvement suggestions
- Security checklist
- Strong password generator with configurable options
- Copy to clipboard
- Dark/Light mode toggle (persists via localStorage)
- Google Analytics integration
- Google AdSense ad placements (top, middle, bottom, inline)
- SEO content: what is password strength, how hackers attack, 10 security tips, FAQ
- Structured data (JSON-LD) for Google rich results
- Fully responsive mobile layout

---

## 📁 Folder Structure

```
password-strength-checker/
├── index.html       ← Main page (all content, SEO, ad slots)
├── style.css        ← All styles (dark/light theme, responsive)
├── app.js           ← Password analysis, generator logic
├── vercel.json      ← Vercel deployment config + security headers
├── robots.txt       ← SEO: allow all crawlers
├── sitemap.xml      ← SEO: sitemap (update with your real domain)
└── README.md        ← This file
```

---

## 🚀 Deployment Instructions

### Step 1: Create the Project Locally

```bash
# Clone or create the folder
mkdir password-strength-checker
cd password-strength-checker

# Place all files: index.html, style.css, app.js, vercel.json, robots.txt, sitemap.xml
```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Password Strength Checker"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/password-strength-checker.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com and log in (use GitHub login)
2. Click **"Add New Project"**
3. Import your `password-strength-checker` GitHub repository
4. Vercel auto-detects it as a static site — no config needed
5. Click **Deploy** → your site is live at `yourproject.vercel.app`

### Step 4: Connect a Custom Domain (Optional)

1. In Vercel Dashboard → your project → **Settings → Domains**
2. Add your custom domain (e.g. `passwordchecker.io`)
3. Follow Vercel's instructions to update DNS records at your registrar
4. SSL is automatic via Let's Encrypt

---

## 📊 Google Analytics Setup

1. Go to https://analytics.google.com
2. Create a new Property (GA4)
3. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. In `index.html`, replace both instances of `G-XXXXXXXX` with your real ID

```html
<!-- Already in <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOURCODE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOURCODE');
</script>
```

The tool tracks these custom GA4 events:
- `password_strength_checked` — label = strength level, value = score
- `password_generated` — when generator is used

---

## 💰 Google AdSense Setup

1. Apply at https://adsense.google.com
2. Once approved, get your **Publisher ID** (format: `ca-pub-XXXXXXXXXX`)
3. Create **Ad Units** in AdSense and get each slot's **Ad Slot ID**
4. In `index.html`, replace:
   - `ca-pub-XXXXXXXX` → your Publisher ID (4 places)
   - `data-ad-slot="XXXXXXXXXX"` → each unit's slot ID (4 places)
5. Remove the `<div class="ad-placeholder">` divs (they're just visual guides)

**Ad placement locations:**
| Location | Type | Best Format |
|---|---|---|
| Top banner | Horizontal | 728×90 leaderboard |
| Mid content | Between tool and SEO | 336×280 rectangle |
| Inline (SEO section) | Between articles | 728×90 |
| Bottom banner | Footer area | Responsive |

---

## 🔍 SEO Checklist

- [x] Title + meta description optimized
- [x] Canonical URL (update with your domain)
- [x] Open Graph + Twitter Card tags
- [x] JSON-LD structured data (WebApplication)
- [x] FAQ schema markup (for Google rich results)
- [x] robots.txt
- [x] sitemap.xml (update domain before submitting)
- [x] Semantic HTML headings (H1 → H2 → H3)
- [x] Core Web Vitals: zero render-blocking JS (deferred), no layout shift
- [ ] Submit sitemap to Google Search Console
- [ ] Build backlinks from security/tech blogs

**After deploying:**
1. Update `yoursite.com` in: `index.html` (canonical, OG url), `robots.txt`, `sitemap.xml`
2. Submit sitemap to https://search.google.com/search-console

---

## 🔒 Security Notes

- All password analysis is 100% client-side (no network requests)
- No passwords are logged, stored, or transmitted
- CSP-friendly (no eval, no inline event handlers)
- Security headers included in vercel.json
- Uses `crypto.getRandomValues()` for cryptographically secure password generation

---

## 🛠 Customization

**Change brand name:** Search-replace `PassGuard` in index.html

**Add more common passwords:** Extend the `COMMON_PASSWORDS` Set in app.js

**Adjust scoring:** Modify the score increments in the `analyzePassword()` function

**Add languages:** Duplicate `index.html` as `es/index.html` and translate content for Spanish SEO traffic

---

## 📦 Tech Stack

- **HTML5** — semantic markup, structured data
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JS** — zero dependencies, Web Crypto API
- **Fonts** — JetBrains Mono + Syne (Google Fonts)
- **Hosting** — Vercel (static)
