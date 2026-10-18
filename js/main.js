const FORMSPREE_URL = "https://formspree.io/f/xeaevpyy";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initNavigation();
  initReveal();
  initStaggerGroups();
  initHeroParallax();
  initCodeShowcase();
  initContactForm();
  initGallery();
  initLightbox();
});

function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  btn?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function initLanguage() {
  const btn = document.getElementById("lang-toggle");
  let lang = localStorage.getItem("lang") || "es";

  const apply = (code) => {
    document.documentElement.lang = code;
    document.querySelectorAll("[data-i18n], [data-i18n-placeholder], [data-i18n-alt]").forEach((el) => {
      const altKey = el.getAttribute("data-i18n-alt");
      if (altKey && TRANSLATIONS[code]?.[altKey]) {
        el.alt = TRANSLATIONS[code][altKey];
      }
      const placeholderKey = el.getAttribute("data-i18n-placeholder");
      const key = placeholderKey || el.getAttribute("data-i18n");
      if (!key) return;
      const val = TRANSLATIONS[code]?.[key];
      if (val === undefined) return;
      if (placeholderKey) {
        el.placeholder = val;
      } else if (!altKey || el.hasAttribute("data-i18n")) {
        el.innerHTML = val;
      }
    });
    if (btn) btn.textContent = code === "es" ? "EN" : "ES";
    localStorage.setItem("lang", code);
    lang = code;
  };

  apply(lang);
  btn?.addEventListener("click", () => apply(lang === "es" ? "en" : "es"));
}

function initNavigation() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-panel");
  const backdrop = document.getElementById("nav-backdrop");
  const links = document.querySelectorAll(".nav-panel a, .nav-desktop a");
  let scrollLockY = 0;

  const lockScroll = () => {
    scrollLockY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollLockY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollLockY);
  };

  const setMenuOpen = (open) => {
    toggle?.setAttribute("aria-expanded", String(open));
    panel?.classList.toggle("is-open", open);
    backdrop?.classList.toggle("is-open", open);
    backdrop?.setAttribute("aria-hidden", open ? "false" : "true");
    header?.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("nav-open", open);
    if (open) lockScroll();
    else unlockScroll();
  };

  const closePanel = () => {
    if (panel?.classList.contains("is-open")) setMenuOpen(false);
  };

  toggle?.addEventListener("click", () => {
    setMenuOpen(!panel?.classList.contains("is-open"));
  });

  backdrop?.addEventListener("click", closePanel);
  links.forEach((link) => link.addEventListener("click", closePanel));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('[data-nav-section]')];

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }
}

function initReveal() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if (reduced) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

function initStaggerGroups() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".stagger-group").forEach((group) => {
    [...group.children].forEach((child, index) => {
      if (reduced) return;
      child.style.setProperty("--stagger-index", String(index));
      if (child.classList.contains("reveal")) {
        child.style.transitionDelay = `${Math.min(index * 0.07, 0.42)}s`;
      }
    });
  });
}

function initHeroParallax() {
  const visual = document.getElementById("hero-visual");
  if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(min-width: 900px)").matches) return;

  window.addEventListener(
    "mousemove",
    (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      visual.style.transform = `perspective(900px) rotateY(${x * 0.35}deg) rotateX(${-y * 0.35}deg) translate3d(${x * 0.5}px, ${y * 0.5}px, 0)`;
    },
    { passive: true }
  );
}

async function initCodeShowcase() {
  const blocks = document.querySelectorAll("[data-code-file]");
  await Promise.all(
    [...blocks].map(async (codeEl) => {
      const url = codeEl.getAttribute("data-code-file");
      if (!url) return;

      const embedded = window.CODE_SNIPPETS?.[url];
      if (embedded) {
        codeEl.textContent = embedded;
        return;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("fetch failed");
        codeEl.textContent = await res.text();
      } catch {
        if (!codeEl.textContent.trim()) {
          codeEl.textContent = "// Fragmento no disponible.";
        }
      }
    })
  );

  document.querySelectorAll("[data-code-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const wrap = btn.closest(".code-block-wrap");
      const code = wrap?.querySelector("code");
      if (!code?.textContent) return;
      const lang = localStorage.getItem("lang") || "es";
      try {
        await navigator.clipboard.writeText(code.textContent);
        const prev = btn.textContent;
        const i18nKey = btn.getAttribute("data-i18n") || "code_copy_btn";
        btn.textContent = TRANSLATIONS[lang]?.code_copied || "Copiado";
        setTimeout(() => {
          btn.textContent = TRANSLATIONS[lang]?.[i18nKey] || prev;
        }, 2000);
      } catch {
        btn.textContent = TRANSLATIONS[lang]?.code_copy_fail || "Error";
      }
    });
  });

  document.querySelectorAll(".code-accordion .code-panel:not(.code-panel--soon)").forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (!panel.open) return;
      document.querySelectorAll(".code-accordion .code-panel:not(.code-panel--soon)").forEach((other) => {
        if (other !== panel) other.open = false;
      });
    });
  });
}

function initLightbox() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

window.openLightbox = function openLightbox(src) {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const galleryShot = document.querySelector(`.gallery-modal img[src="${src}"], .project-mini-gallery img[src="${src}"]`);
  if (!box || !img) return;
  img.src = src;
  img.alt = galleryShot?.alt || "";
  box.classList.add("is-open");
  box.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

window.closeLightbox = function closeLightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (!box) return;
  box.classList.remove("is-open");
  box.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (img) img.src = "";
};

function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-form-status");
  if (!form) return;

  const setStatus = (type, message) => {
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type === "success" ? "is-success" : "is-error");
    statusEl.textContent = message || "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem("lang") || "es";
    const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim() || (lang === "es" ? "Contacto desde portfolio" : "Portfolio contact");
    const mensaje = form.mensaje.value.trim();
    const gotcha = form._gotcha?.value?.trim();

    if (gotcha) return;

    if (!nombre || !email || !mensaje) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn?.querySelector("[data-i18n='contact_btn']");
    const prevLabel = label?.textContent;
    setStatus(null, "");

    if (label) label.textContent = t.contact_sending || "…";
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          email,
          subject: asunto,
          message: mensaje,
          _replyto: email,
        }),
      });

      if (res.ok) {
        form.reset();
        setStatus("success", t.contact_success);
      } else {
        setStatus("error", t.contact_error);
      }
    } catch {
      setStatus("error", t.contact_error);
    } finally {
      if (btn) btn.disabled = false;
      if (label && prevLabel) label.textContent = prevLabel;
    }
  });
}

function initGallery() {
  const modal = document.getElementById("gallery-modal");
  if (!modal) return;

  modal.querySelector(".modal-backdrop")?.addEventListener("click", closeGallery);
  modal.querySelector(".modal-close")?.addEventListener("click", closeGallery);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeGallery();
  });
}

window.openGallery = function openGallery() {
  const modal = document.getElementById("gallery-modal");
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
};

window.closeGallery = function closeGallery() {
  const modal = document.getElementById("gallery-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};
