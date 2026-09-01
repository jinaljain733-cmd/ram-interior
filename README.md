# 🏗️ Ram Interior — Contractor & Interior Design Website

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)
![Custom Domain](https://img.shields.io/badge/Domain-raminteriorofficial.in-gold?style=flat)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)
![SEO](https://img.shields.io/badge/SEO-Optimised-brightgreen?style=flat)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=flat)

> ⭐ **Client Project** — Real business, real domain, real deployment.

A fully responsive, multi-page marketing website built for **Ram Interior**, a Mumbai-based interior, civil and turnkey project execution contractor with 35+ years of experience. Built with pure HTML, CSS and JavaScript — deployed on Netlify with a custom domain, local SEO, schema markup, and WhatsApp-powered enquiry handling.

---

## 🌐 Live Website

**[https://www.raminteriorofficial.in](https://www.raminteriorofficial.in)**

---

## ✨ Features

- 7-page site — Home, About, Services, Projects, Architects, FAQ, Contact
- Sticky, responsive nav with mobile toggle menu
- FAQ accordion for common client questions
- Project gallery with lightbox viewer
- Scroll reveal animations on key sections
- Contact/enquiry form — no backend, submissions hand off directly to WhatsApp with fields pre-filled into the message
- Custom 404 page
- GTM-based click tracking on key CTAs (call, WhatsApp, enquiry)
- Local SEO — schema markup, meta tags, Open Graph, `sitemap.xml`, `robots.txt`
- Favicon set + `manifest.json` / `site.webmanifest` for PWA installability
- Deployed on **Netlify** with custom domain `raminteriorofficial.in`
- Pretty URLs and long-term asset caching via `netlify.toml`

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic structure, SEO meta tags, schema markup, Open Graph |
| CSS3 | Design tokens (`style.css`), Grid, Flexbox, scroll reveal, responsive layout |
| JavaScript (ES6+) | Nav toggle, FAQ accordion, gallery lightbox, scroll reveal, WhatsApp enquiry handoff, GTM click tracking |
| Netlify | Hosting, custom domain, pretty URLs, cache headers |
| `netlify.toml` | Hosting config — redirects, cache headers |

---

## 🧠 JavaScript Features (`js/main.js`)

- Mobile nav toggle with body scroll lock
- FAQ accordion — expand/collapse question panels
- Gallery lightbox — click-to-enlarge project images
- Scroll reveal animations via `IntersectionObserver`
- Enquiry form → WhatsApp handoff — field values encoded into a pre-filled WhatsApp message (no backend required)
- GTM event tracking on call, WhatsApp, and enquiry CTA clicks

---

## 🔍 SEO & Performance

- `sitemap.xml` — submitted to Google Search Console
- `robots.txt` — allows crawlers, blocks private paths
- Schema markup for local business / contractor listing
- Open Graph meta tags — rich preview on WhatsApp & social shares
- `og-image.jpg` — custom OG image for link previews
- Favicon set — all sizes including Apple touch icon
- `manifest.json` / `site.webmanifest` — installable as a PWA
- Long-term caching for CSS/JS/images via `netlify.toml`

---

## 📁 Project Structure

```
ram-interior/
├── index.html              # Home page
├── 404.html                 # Custom not-found page
├── pages/                   # About, Services, Projects, Architects, FAQ, Contact
├── css/style.css             # Design tokens + all page styles
├── js/main.js                 # Nav toggle, FAQ accordion, gallery lightbox,
│                                 scroll reveal, enquiry form, GTM click tracking
├── images/                    # Icons, favicons, og-image, logo
├── manifest.json               # PWA manifest
├── site.webmanifest             # PWA manifest (alt)
├── robots.txt                    # Search crawler rules
├── sitemap.xml                    # SEO sitemap
├── netlify.toml                    # Hosting config — pretty URLs, cache headers
└── README.md
```

> Pages under `/pages/` link back to root assets with relative paths (`../css/style.css`, `../images/...`).

---

## 🚀 Deployment

Deployed on **Netlify** with a custom domain.

```
Live URL:  https://www.raminteriorofficial.in
Platform:  Netlify
Domain:    raminteriorofficial.in (custom, paid)
Config:    Pretty URLs, long-term asset caching (netlify.toml)
```

## 💻 Local Preview

Any static file server works, e.g.:

```bash
npx serve .
```

## 📞 Business Details

**Ram Interior**
Interior, Civil & Turnkey Project Execution — 35+ Years of Experience
📍 Mumbai
🌐 [raminteriorofficial.in](https://www.raminteriorofficial.in)

---

## 👩‍💻 Built By

**Jinal Jain** — Freelance Frontend Developer & SEO Executive
- GitHub: [@jinaljain733-cmd](https://github.com/jinaljain733-cmd)
- LinkedIn: [linkedin.com/in/jinal-jain-08b70328b](https://linkedin.com/in/jinal-jain-08b70328b)

---

## 📄 License

© 2026 Ram Interior. All rights reserved.

> This is a **client project**. Code and design are proprietary and may not be reused, copied or redistributed without written permission.