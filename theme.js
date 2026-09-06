const storageKey = "upbf-theme";
const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(storageKey);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
  } catch {
    return null;
  }
}

function updateToggle(theme) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle?.setAttribute("aria-label", label);

  if (themeLabel) {
    themeLabel.textContent = label;
  }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeColor?.setAttribute("content", theme === "dark" ? "#171918" : "#761d2b");
  updateToggle(theme);
}

function saveTheme(theme) {
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The site still works when storage is unavailable.
  }
}

applyTheme(getSavedTheme() || root.dataset.theme || (systemTheme.matches ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

systemTheme.addEventListener("change", (event) => {
  if (!getSavedTheme()) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

// Close the mobile menu after navigation and return focus on Escape.
const navToggle = document.querySelector("#nav-toggle");
document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navToggle) navToggle.checked = false;
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.checked) {
    navToggle.checked = false;
    navToggle.focus();
  }
});
