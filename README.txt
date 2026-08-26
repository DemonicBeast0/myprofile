Pratik Majhi — Portfolio
========================

Pure HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

FILES
-----
  index.html   The portfolio (single page)
  style.css    All styling — design tokens, light/dark themes, responsive rules
  script.js    All interactions — theme, nav, reveals, counters, contact form
  resume.html  Standalone print-optimised résumé (Download PDF button)

HOW TO VIEW
-----------
Just double-click index.html. It runs straight from the filesystem.

(Optional) To serve it locally instead:
  python -m http.server 5511
then open http://localhost:5511


BEFORE YOU PUBLISH — 2 THINGS TO CHANGE
---------------------------------------

1. YOUR EMAIL ADDRESS  (currently a placeholder)

   The address carried over from the old site decodes to
   "pratikmajhi9876@example.com" — example.com is a dummy domain.
   Replace it with your real address in 3 places:

     index.html   2 occurrences (About section, Contact section)
     resume.html  1 occurrence  (header contact block)
     script.js    the EMAIL constant near the top

2. CONTACT FORM DELIVERY  (optional but recommended)

   Right now the form validates input and then opens the visitor's email
   app via mailto: — it works, but the visitor has to press send themselves.

   To have messages delivered to your inbox automatically:
     a. Create a free form at https://formspree.io
     b. Copy your form ID (looks like: xdorwqkb)
     c. Paste it in TWO places:
          script.js   -> FORMSPREE_ID = "xdorwqkb";
          index.html  -> <form action="https://formspree.io/f/xdorwqkb" ...>

   If the ID is left as YOUR_FORM_ID, the form automatically falls back to
   mailto: — it never silently fails.


OPTIONAL CUSTOMISATIONS
-----------------------

Use a real photo instead of the "PM" monogram:
  In index.html, find <span class="monogram">PM</span> inside <figure class="portrait">
  and replace it with:  <img src="pratik.jpg" alt="Pratik Majhi" />

Add real project screenshots:
  Each project uses a browser-frame mockup. In index.html, add an <img> as the
  first child of the matching <span class="mock-body">, e.g.
    <span class="mock-body"><img src="shots/jyoti.jpg" alt="" /> ... </span>

Change the accent colour:
  In style.css, edit --accent (light theme, near the top) and the --accent value
  under [data-theme="dark"].


DEPLOYING
---------
Any static host works — upload all four files to the same folder:
  GitHub Pages, Netlify (drag & drop the folder), Vercel, Cloudflare Pages,
  or your existing hosting for pratikmajhi.com.np.


NOTES
-----
- Light theme is the default; a toggle switches to dark and remembers the
  choice in localStorage. It also respects the visitor's OS preference.
- Fonts (Fraunces + Inter) load from Google Fonts, so first paint needs a
  network connection. Everything else works fully offline.
- Accessible: WCAG AA contrast throughout, keyboard navigable, visible focus
  rings, 44px minimum tap targets, and prefers-reduced-motion support.
