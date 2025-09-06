// Header elevation
const header = document.querySelector("[data-elevate]");
const mobileBtn = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const yearEl = document.getElementById("year");

// Set year
yearEl.textContent = new Date().getFullYear();

// Elevation on scroll
function onScroll() {
  if (window.scrollY > 8) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
}
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
mobileBtn?.addEventListener("click", () => {
  const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
  mobileBtn.setAttribute("aria-expanded", String(!expanded));
  if (mobileMenu.hasAttribute("hidden")) mobileMenu.removeAttribute("hidden");
  else mobileMenu.setAttribute("hidden", "");
});

// Smooth in-page nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!mobileMenu?.hasAttribute("hidden")) mobileMenu.setAttribute("hidden", "");
  });
});

// IO reveal animations
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.2 });

document.querySelectorAll("[data-io]").forEach(el => io.observe(el));

// Forms (mock submit + localStorage)
function attachForm(formId, storageKey, successMsg) {
  const form = document.getElementById(formId);
  if (!form) return;

  const msg = form.querySelector(".form-msg");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Simple validation
    let invalid = false;
    form.querySelectorAll("input[required]").forEach(inp => {
      if (!inp.value.trim()) {
        inp.focus();
        invalid = true;
      }
    });
    if (invalid) return;

    // Optional email format check
    const email = data.email?.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Please enter a valid email.";
      msg.style.color = "#fecaca";
      return;
    }

    // Persist locally (can be wired to backend later)
    const prev = JSON.parse(localStorage.getItem(storageKey) || "[]");
    prev.push({ ...data, ts: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(prev));

    form.reset();
    msg.textContent = successMsg;
    msg.style.color = "#a7f3d0";

    // Optional: mailto fallback for quick POC
    // window.location.href = `mailto:hello@okhotu.com?subject=${encodeURIComponent('New '+formId)}&body=${encodeURIComponent(JSON.stringify(data,null,2))}`;
  });
}

attachForm("areaForm", "okhotu_area_requests", "Thanks! We’ll prioritize your area.");
attachForm("waitlistForm", "okhotu_waitlist", "You’re in! Watch your inbox for an invite.");
