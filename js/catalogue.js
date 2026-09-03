/* ============================================================
   RAM INTERIOR — Digital catalogue (book) engine
   A dependency-free page-flip book built on CSS 3D transforms.
   Renders into any container via RamCatalogue.mount(el, opts).
   opts.mode: "full" (dedicated page, all pages, controls, index)
              "preview" (homepage teaser, first N pages, lighter UI)
   opts.pathPrefix: "" on the homepage, "../" on /pages/catalogue.html
   ============================================================ */
(function () {
  function buildPageList(sections, prefix, limit) {
    const pages = [{ kind: "cover" }];
    sections.forEach((section) => {
      pages.push({ kind: "divider", title: section.title, note: section.note });
      section.images.forEach((img) => {
        pages.push({
          kind: "image",
          src: prefix + img.src,
          webp: prefix + img.webp,
          alt: img.alt,
          section: section.title
        });
      });
    });
    pages.push({ kind: "back" });
    return limit ? pages.slice(0, limit) : pages;
  }

  function renderFace(page) {
    if (page.kind === "cover") {
      return (
        '<div class="rc-face rc-face--cover">' +
        '<span class="rc-cover-corner rc-cover-corner--tl" aria-hidden="true"></span>' +
        '<span class="rc-cover-corner rc-cover-corner--br" aria-hidden="true"></span>' +
        '<div class="rc-cover-mark">R</div>' +
        '<h3 class="rc-cover-title">' + window.RAM_CATALOGUE.title + "</h3>" +
        '<p class="rc-cover-sub">' + window.RAM_CATALOGUE.subtitle + "</p>" +
        "</div>"
      );
    }
    if (page.kind === "back") {
      return (
        '<div class="rc-face rc-face--cover rc-face--back">' +
        '<span class="rc-cover-corner rc-cover-corner--tl" aria-hidden="true"></span>' +
        '<span class="rc-cover-corner rc-cover-corner--br" aria-hidden="true"></span>' +
        '<div class="rc-cover-mark">R</div>' +
        '<h3 class="rc-cover-title">' + window.RAM_CATALOGUE.title + "</h3>" +
        '<p class="rc-cover-sub">From plans to reality</p>' +
        "</div>"
      );
    }
    if (page.kind === "divider") {
      return (
        '<div class="rc-face rc-face--divider">' +
        '<span class="tag-mono rc-divider-eyebrow">Section</span>' +
        "<h3>" + page.title + "</h3>" +
        (page.note ? "<p>" + page.note + "</p>" : "") +
        "</div>"
      );
    }
    return (
      '<div class="rc-face rc-face--image">' +
      "<picture>" +
      '<source srcset="' + page.webp + '" type="image/webp">' +
      '<img src="' + page.src + '" alt="' + page.alt + '" loading="lazy">' +
      "</picture>" +
      '<div class="rc-image-caption">' +
      '<span class="tag-mono">' + page.section + "</span>" +
      "</div>" +
      "</div>"
    );
  }

  function mount(container, opts) {
    opts = opts || {};
    const prefix = opts.pathPrefix || "";
    const mode = opts.mode || "full";
    const data = window.RAM_CATALOGUE;
    const pages = buildPageList(data.sections, prefix, opts.limit);

    // ---- Auto-swipe configuration ----
    const AUTOPLAY_INTERVAL = opts.autoPlayInterval || 2800; // ~2.8s per page — medium pace
    const RESUME_DELAY = opts.resumeDelay || 4000; // resume this long after the user stops interacting
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoPlayEnabled = opts.autoPlay !== false && !prefersReducedMotion;

    let current = 0;

    container.innerHTML =
      '<div class="rc-book" data-mode="' + mode + '">' +
      '<div class="rc-stack" aria-hidden="true"></div>' +
      '<div class="rc-stage">' +
      '<div class="rc-static" id="rcStatic"></div>' +
      '<div class="rc-leaf" id="rcLeaf">' +
      '<div class="rc-leaf-face rc-leaf-front" id="rcFront"></div>' +
      '<div class="rc-leaf-face rc-leaf-back" id="rcBack"></div>' +
      "</div>" +
      "</div>" +
      (mode === "full"
        ? '<div class="rc-index"><span id="rcIndexCurrent">1</span> / ' + pages.length + "</div>"
        : "") +
      "</div>";

    const staticEl = container.querySelector("#rcStatic");
    const leafEl = container.querySelector("#rcLeaf");
    const frontEl = container.querySelector("#rcFront");
    const backEl = container.querySelector("#rcBack");
    const indexEl = container.querySelector("#rcIndexCurrent");
    let animating = false;
    let autoTimer = null;
    let resumeTimer = null;

    function paintStatic(i) {
      staticEl.innerHTML = i >= 0 && i < pages.length ? renderFace(pages[i]) : "";
    }

    function preloadPage(i) {
      const p = pages[i];
      if (p && p.kind === "image") {
        const im = new Image();
        im.src = p.webp || p.src;
      }
    }

    // Instantly resets to the first page (used to loop the auto-swipe without
    // an awkward reverse-flip back through the whole book).
    function goToStart() {
      current = 0;
      leafEl.classList.remove("rc-hinge-left", "rc-hinge-right");
      leafEl.style.transition = "none";
      leafEl.style.transform = "rotateY(0deg)";
      frontEl.innerHTML = renderFace(pages[current]);
      void leafEl.offsetWidth;
      leafEl.style.transition = "";
      paintStatic(current + 1);
      preloadPage(current + 2);
      updateNavState();
    }

    function stopAutoPlay() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAutoPlay() {
      if (!autoPlayEnabled) return;
      stopAutoPlay();
      autoTimer = setInterval(function () {
        if (animating) return;
        if (current >= pages.length - 1) {
          goToStart();
        } else {
          goNext();
        }
      }, AUTOPLAY_INTERVAL);
    }

    // Pause immediately on manual interaction, resume after a period of inactivity.
    function handleManualInteraction() {
      if (!autoPlayEnabled) return;
      stopAutoPlay();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        resumeTimer = null;
        startAutoPlay();
      }, RESUME_DELAY);
    }

    function updateNavState() {
      if (indexEl) indexEl.textContent = String(current + 1);
    }

    function goNext() {
      if (animating || current >= pages.length - 1) return;
      animating = true;
      leafEl.style.transition = "none";
      leafEl.style.transform = "rotateY(0deg)";
      leafEl.classList.remove("rc-hinge-right");
      leafEl.classList.add("rc-hinge-left");
      frontEl.innerHTML = renderFace(pages[current]);
      backEl.innerHTML = renderFace(pages[current + 1]);
      paintStatic(current + 1);
      preloadPage(current + 2);
      // force reflow so the transition:none takes effect before animating
      void leafEl.offsetWidth;
      leafEl.style.transition = "";
      requestAnimationFrame(function () {
        leafEl.style.transform = "rotateY(-180deg)";
      });
      leafEl.addEventListener("transitionend", function done() {
        leafEl.removeEventListener("transitionend", done);
        current += 1;
        leafEl.style.transition = "none";
        leafEl.style.transform = "rotateY(0deg)";
        frontEl.innerHTML = renderFace(pages[current]);
        void leafEl.offsetWidth;
        leafEl.style.transition = "";
        paintStatic(current + 1);
        updateNavState();
        animating = false;
      }, { once: true });
    }

    function goPrev() {
      if (animating || current <= 0) return;
      animating = true;
      leafEl.style.transition = "none";
      leafEl.style.transform = "rotateY(0deg)";
      leafEl.classList.remove("rc-hinge-left");
      leafEl.classList.add("rc-hinge-right");
      frontEl.innerHTML = renderFace(pages[current]);
      backEl.innerHTML = renderFace(pages[current - 1]);
      paintStatic(current - 1);
      void leafEl.offsetWidth;
      leafEl.style.transition = "";
      requestAnimationFrame(function () {
        leafEl.style.transform = "rotateY(180deg)";
      });
      leafEl.addEventListener("transitionend", function done() {
        leafEl.removeEventListener("transitionend", done);
        current -= 1;
        leafEl.style.transition = "none";
        leafEl.style.transform = "rotateY(0deg)";
        frontEl.innerHTML = renderFace(pages[current]);
        void leafEl.offsetWidth;
        leafEl.style.transition = "";
        paintStatic(current + 1);
        updateNavState();
        animating = false;
      }, { once: true });
    }

    frontEl.innerHTML = renderFace(pages[current]);
    paintStatic(current + 1);
    preloadPage(current + 2);
    updateNavState();

    // Click the page itself: right half = next, left half = prev
    container.querySelector(".rc-stage").addEventListener("click", function (e) {
      handleManualInteraction();
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x > rect.width / 2) goNext(); else goPrev();
    });

    // Swipe support (mobile)
    let touchStartX = null;
    const stageEl = container.querySelector(".rc-stage");
    stageEl.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      handleManualInteraction();
    }, { passive: true });
    stageEl.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); }
      touchStartX = null;
    }, { passive: true });

    // Keyboard support when the book has focus (full page only)
    if (mode === "full") {
      container.setAttribute("tabindex", "0");
      container.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { handleManualInteraction(); goNext(); }
        if (e.key === "ArrowLeft") { handleManualInteraction(); goPrev(); }
      });
    }

    // Desktop hover: pause while the cursor is resting on the book, resume on leave.
    container.addEventListener("mouseenter", stopAutoPlay);
    container.addEventListener("mouseleave", function () {
      if (autoPlayEnabled && !resumeTimer) startAutoPlay();
    });

    // Don't burn cycles animating a book that's scrolled off-screen or the tab is hidden.
    if (autoPlayEnabled) {
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !document.hidden && !resumeTimer) startAutoPlay();
            else stopAutoPlay();
          });
        }, { threshold: 0.35 });
        io.observe(container);
      } else {
        startAutoPlay();
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopAutoPlay();
        else if (!resumeTimer) startAutoPlay();
      });
    }
  }

  window.RamCatalogue = { mount: mount };
})();
