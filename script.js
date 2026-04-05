// ── Mobile sidebar ──
const mobToggle = document.getElementById("mob-toggle");
const sidebar   = document.getElementById("sidebar");

if (mobToggle && sidebar) {
  mobToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    mobToggle.classList.toggle("open", open);
    mobToggle.setAttribute("aria-expanded", String(open));
  });
}

// ── Close sidebar when nav link clicked ──
document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar?.classList.remove("open");
    mobToggle?.classList.remove("open");
    mobToggle?.setAttribute("aria-expanded", "false");
  });
});

// ── Active nav on scroll ──
const sections  = Array.from(document.querySelectorAll(".sec[id]"));
const navItems  = Array.from(document.querySelectorAll(".nav-item"));

const setActive = (id) => {
  navItems.forEach((el) => {
    el.classList.toggle("is-active", el.dataset.section === id);
  });
};

if (sections.length && navItems.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      const hit = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit) setActive(hit.target.id);
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.65] }
  );
  sections.forEach((s) => obs.observe(s));
  setActive(sections[0]?.id ?? "about");
}
