// Ram Interior — shared interactions
document.addEventListener('DOMContentLoaded', () => {

  // GTM click tracking — WhatsApp / Call / Email CTAs
  // Fires a dataLayer event so these can be wired up as GTM triggers/tags
  // (matches the same click-tracking pattern used on other Grow on Internet client sites)
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(a => {
    a.addEventListener('click', () => {
      window.dataLayer.push({ event: 'whatsapp_click', link_text: a.textContent.trim(), page_path: location.pathname });
    });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => {
      window.dataLayer.push({ event: 'phone_click', link_text: a.textContent.trim(), page_path: location.pathname });
    });
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', () => {
      window.dataLayer.push({ event: 'email_click', link_text: a.textContent.trim(), page_path: location.pathname });
    });
  });

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    const navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);

    const openNav = () => {
      mainNav.classList.add('open');
      navBackdrop.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const closeNav = () => {
      mainNav.classList.remove('open');
      navBackdrop.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) closeNav(); else openNav();
    });
    navBackdrop.addEventListener('click', closeNav);
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) closeNav();
    });
    // Keep nav state correct if the viewport is resized past the mobile breakpoint while open
    window.addEventListener('resize', () => {
      if (window.innerWidth > 920 && mainNav.classList.contains('open')) closeNav();
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      // close siblings within same list for a clean single-open accordion
      const list = item.closest('.faq-list');
      if (list) {
        list.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) other.setAttribute('data-open', 'false');
        });
      }
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
    });
  });

  // Scroll-triggered reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Enquiry form — no backend on this static site, so submissions are
  // handed off to WhatsApp (the business's primary contact channel)
  // with the form fields pre-filled into the message.
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = enquiryForm.name.value.trim();
      const phone = enquiryForm.phone.value.trim();
      const projectType = enquiryForm.projectType.value.trim();
      const message = enquiryForm.message.value.trim();

      const lines = ["Hi Ram Interior, I'd like to discuss a project.", ''];
      lines.push(`Name: ${name}`);
      lines.push(`Phone: ${phone}`);
      if (projectType) lines.push(`Project Type: ${projectType}`);
      if (message) lines.push(`Message: ${message}`);

      const text = encodeURIComponent(lines.join('\n'));
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'enquiry_form_submit', project_type: projectType, page_path: location.pathname });
      window.location.href = `https://wa.me/919768086403?text=${text}`;
    });
  }

  // Back-to-top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Shared modal open/close helpers (project enquiry form + lead popup)
  const allModals = document.querySelectorAll('.site-modal');
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstField = modal.querySelector('input, select, textarea');
    if (firstField) firstField.focus({ preventScroll: true });
  };
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(modal);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') allModals.forEach(closeModal);
  });

  // "Discuss Your Project" opens the enquiry form directly instead of
  // navigating to the Contact page (Home page behaviour only)
  const projectFormModal = document.getElementById('projectFormModal');
  document.querySelectorAll('[data-open-project-form]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(projectFormModal);
    });
  });

  // Enquiry forms embedded in modals — same WhatsApp hand-off as the main contact form
  const sendEnquiryToWhatsApp = (form) => {
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const projectType = form.projectType ? form.projectType.value.trim() : '';
    const message = form.message ? form.message.value.trim() : '';

    const lines = ["Hi Ram Interior, I'd like to discuss a project.", ''];
    lines.push(`Name: ${name}`);
    lines.push(`Phone: ${phone}`);
    if (projectType) lines.push(`Project Type: ${projectType}`);
    if (message) lines.push(`Message: ${message}`);

    const text = encodeURIComponent(lines.join('\n'));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'enquiry_form_submit', project_type: projectType, page_path: location.pathname });
    window.open(`https://wa.me/919768086403?text=${text}`, '_blank', 'noopener');
  };

  const modalEnquiryForm = document.getElementById('modalEnquiryForm');
  if (modalEnquiryForm) {
    modalEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendEnquiryToWhatsApp(modalEnquiryForm);
      closeModal(projectFormModal);
      modalEnquiryForm.reset();
    });
  }

  // Lead-generation popup — appears once per session, ~12s after the
  // visitor lands (never on first paint, never more than once)
  const leadPopupModal = document.getElementById('leadPopupModal');
  const popupEnquiryForm = document.getElementById('popupEnquiryForm');
  if (leadPopupModal && !sessionStorage.getItem('ri_lead_popup_shown')) {
    const popupTimer = setTimeout(() => {
      // don't interrupt if the project form is already open
      if (!projectFormModal || !projectFormModal.classList.contains('open')) {
        openModal(leadPopupModal);
        sessionStorage.setItem('ri_lead_popup_shown', '1');
      }
    }, 12000);
    // if the visitor navigates away or closes it manually, don't re-show later this session
    leadPopupModal.addEventListener('click', (e) => {
      if (e.target === leadPopupModal || e.target.closest('[data-close-modal]')) {
        sessionStorage.setItem('ri_lead_popup_shown', '1');
        clearTimeout(popupTimer);
      }
    });
  }
  if (popupEnquiryForm) {
    popupEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendEnquiryToWhatsApp(popupEnquiryForm);
      closeModal(leadPopupModal);
      popupEnquiryForm.reset();
    });
  }

  // Gallery lightbox — shows the full clicked photo
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lbContent = lightbox.querySelector('.lightbox-content');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lbContent.innerHTML = '';
          const full = document.createElement('img');
          full.src = img.currentSrc || img.src;
          full.alt = img.alt || '';
          lbContent.appendChild(full);
        }
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.lightbox-close')) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
});
