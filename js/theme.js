import { icon } from "./icons.js";

const KEY = "flowboard:v1:theme";

export function loadTheme() {
  try {
    return localStorage.getItem(KEY) || "system";
  } catch {
    return "system";
  }
}

function isDarkNow() {
  return (
    document.documentElement.getAttribute("data-theme") === "dark" ||
    (!document.documentElement.hasAttribute("data-theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

function updateToggleButton() {
  const btn = document.querySelector("#themeToggle");
  const dark = isDarkNow();
  btn.innerHTML = icon(dark ? "sun" : "moon");
  btn.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme",
  );
}

export function applyTheme(theme) {
  if (theme === "system")
    document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  updateToggleButton();
}

export function syncSettingsRadios() {
  const theme = document.documentElement.getAttribute("data-theme") || "system";
  document.querySelectorAll('input[name="theme"]').forEach((r) => {
    r.checked = r.value === theme;
  });
}

export function initTheme() {
  applyTheme(loadTheme());
  document.querySelector("#themeToggle").addEventListener("click", () => {
    applyTheme(isDarkNow() ? "light" : "dark");
    syncSettingsRadios();
  });
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateToggleButton);
}
