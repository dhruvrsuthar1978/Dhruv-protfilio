// Mobile sidebar
const mobToggle = document.getElementById("mob-toggle");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("sb-backdrop");
const body = document.body;
const mediaMobile = window.matchMedia("(max-width: 760px)");

requestAnimationFrame(() => {
  body.classList.add("page-ready");
});

const syncMenuState = (open) => {
  sidebar?.classList.toggle("open", open);
  mobToggle?.classList.toggle("open", open);
  backdrop?.classList.toggle("open", open);
  mobToggle?.setAttribute("aria-expanded", String(open));
  body.classList.toggle("menu-open", open && mediaMobile.matches);
};

if (mobToggle && sidebar) {
  mobToggle.addEventListener("click", () => {
    syncMenuState(!sidebar.classList.contains("open"));
  });
}

backdrop?.addEventListener("click", () => syncMenuState(false));

document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    syncMenuState(false);
  });
});

document.addEventListener("click", (event) => {
  if (!mediaMobile.matches || !sidebar?.classList.contains("open")) return;
  if (sidebar.contains(event.target) || mobToggle?.contains(event.target)) return;
  syncMenuState(false);
});

mediaMobile.addEventListener("change", (event) => {
  if (!event.matches) {
    syncMenuState(false);
  }
});

// Active nav on scroll
const sections = Array.from(document.querySelectorAll(".sec[id]"));
const navItems = Array.from(document.querySelectorAll(".nav-item"));

const setActive = (id) => {
  navItems.forEach((el) => {
    el.classList.toggle("is-active", el.dataset.section === id);
  });
};

if (sections.length && navItems.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      const hit = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (hit) setActive(hit.target.id);
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.65] }
  );

  sections.forEach((section) => obs.observe(section));
  setActive(sections[0]?.id ?? "about");
}

// Reveal on scroll
const revealItems = Array.from(document.querySelectorAll(".reveal"));

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        animateChildren(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 80, 280)}ms`;
    revealObserver.observe(item);
  });
}

// Stagger child tags/pills when their parent section becomes visible
function animateChildren(parent) {
  const children = parent.querySelectorAll(".tags span, .pills span");
  children.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px) scale(0.92)";
    el.style.transition = `opacity 380ms ease ${i * 55}ms, transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      });
    });
  });
}

// Counter animation for stat pills
function animateCounter(el, target, suffix) {
  const duration = 1200;
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Parse and animate stat pill numbers
const pillEls = document.querySelectorAll(".pills span");
const pillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.dataset.original || el.textContent;
      el.dataset.original = text;
      const match = text.match(/^(\d+(?:\.\d+)?)([\+\/\s].*)$/);
      if (match) {
        const num = parseFloat(match[1]);
        const suffix = match[2];
        animateCounter(el, num, suffix);
      }
      observer.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

pillEls.forEach((el) => pillObserver.observe(el));
