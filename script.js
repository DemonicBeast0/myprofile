/* =============================================================
   Pratik Majhi — Portfolio interactions (vanilla JS, no deps)
   ============================================================= */
(function () {
  "use strict";

  /* ---- Contact config -------------------------------------------------
     EMAIL: your real address (used by the mailto fallback).
     To enable real form submissions without opening a mail app:
       1. Create a free form at https://formspree.io
       2. Put your form ID below AND in index.html's <form action="...">
     Until FORMSPREE_ID is set, the form gracefully falls back to mailto.
  --------------------------------------------------------------------- */
  var EMAIL = "pratikmajhi9876@example.com";
  var FORMSPREE_ID = "YOUR_FORM_ID";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("pm-theme", theme); } catch (e) {}
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#121311" : "#faf9f6");
  }
  $$(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  /* ---------- Year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var menuToggle = $("#menuToggle");
  var navLinks = $("#navLinks");

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("body-lock");
  }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("body-lock", open);
    });
    $$(".nav-links > a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) closeMenu();
    });
    document.addEventListener("click", function (e) {
      if (navLinks.classList.contains("open") &&
          !navLinks.contains(e.target) &&
          !menuToggle.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Header state, progress bar, back-to-top ---------- */
  var header = $(".header");
  var progress = $("#scrollProgress");
  var backTop = $("#backTop");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 16);
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
    if (backTop) backTop.classList.toggle("show", y > 520);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Scroll spy ---------- */
  var sections = $$("main section[id]");
  var linkFor = {};
  $$(".nav-links > a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.charAt(0) === "#") linkFor[href.slice(1)] = a;
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.keys(linkFor).forEach(function (k) { linkFor[k].classList.remove("active"); });
          if (linkFor[entry.target.id]) linkFor[entry.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animated counters ---------- */
  var counters = $$("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var duration = 1500, startTime = null;
    function step(ts) {
      if (startTime === null) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Contact form ---------- */
  var form = $("#contactForm");
  var note = $("#formNote");
  var submitBtn = $("#submitBtn");

  function setNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note" + (type ? " " + type : "");
  }

  function validate(fields) {
    var ok = true;
    fields.forEach(function (f) {
      var empty = !f.value.trim();
      var badEmail = f.type === "email" && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      var invalid = empty || badEmail;
      f.classList.toggle("invalid", invalid);
      if (invalid) ok = false;
    });
    return ok;
  }

  function sendViaMailto(data) {
    var body = "Hi Pratik,\r\n\r\n" + data.message +
               "\r\n\r\n— " + data.name + " (" + data.email + ")";
    window.location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(data.subject) +
      "&body=" + encodeURIComponent(body);
    setNote("Opening your email app… If nothing happens, email me directly at " + EMAIL + ".", "success");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = $("#name"), email = $("#email"),
          subject = $("#subject"), message = $("#message");

      if (!validate([name, email, subject, message])) {
        setNote("Please fill in every field with a valid email address.", "error");
        return;
      }

      var data = {
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      };

      // Formspree not configured yet → fall back to the visitor's mail app.
      if (!FORMSPREE_ID || FORMSPREE_ID === "YOUR_FORM_ID") {
        sendViaMailto(data);
        form.reset();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      setNote("Sending your message…");

      fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          form.reset();
          setNote("Thanks — your message has been sent. I'll get back to you soon.", "success");
        })
        .catch(function () {
          setNote("Couldn't send automatically — opening your email app instead.", "error");
          sendViaMailto(data);
        })
        .then(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        });
    });

    $$("#contactForm input, #contactForm textarea").forEach(function (f) {
      f.addEventListener("input", function () { f.classList.remove("invalid"); });
    });
  }
})();
