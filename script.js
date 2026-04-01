/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks   = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============================================================
   TYPING ANIMATION — hero role subtitle
   ============================================================ */
const phrases = [
  "AI Developer · Full-Stack Engineer",
  "Building Intelligent Products",
  "MERN Stack · Python · FastAPI",
  "Open to Internships · Mumbai 2026",
];

const typeTarget = document.getElementById("typeTarget");

if (typeTarget) {
  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      typeTarget.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 48);
    } else {
      charIdx--;
      typeTarget.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting   = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 380);
        return;
      }
      setTimeout(type, 22);
    }
  }

  setTimeout(type, 800);
}

/* ============================================================
   SCROLL REVEAL — sections
   ============================================================ */
const revealTargets = document.querySelectorAll(".section");

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObs.unobserve(e.target); }
    });
  },
  { threshold: 0.10 }
);

revealTargets.forEach((el) => { el.classList.add("reveal"); revealObs.observe(el); });

/* Staggered cards */
const cardGroups = document.querySelectorAll(".cards, .education-list, .dual-section, .about-panels");

const cardGroupObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        Array.from(e.target.children).forEach((child, i) => {
          setTimeout(() => child.classList.add("is-visible"), i * 90);
        });
        cardGroupObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.07 }
);

cardGroups.forEach((g) => {
  Array.from(g.children).forEach((c) => c.classList.add("reveal"));
  cardGroupObs.observe(g);
});

/* ============================================================
   NAV ACTIVE HIGHLIGHT on scroll
   ============================================================ */
const sections   = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navAnchors.forEach((a) => {
          a.style.color = "";
          if (a.getAttribute("href") === "#" + e.target.id) a.style.color = "var(--accent)";
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((s) => navObs.observe(s));
