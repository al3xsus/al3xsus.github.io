import { persistentAtom } from "@nanostores/persistent";
import { onMount } from "nanostores";

export const bgPatternStore = persistentAtom("background-pattern", "dot-grid");

export const themeStore = persistentAtom("theme", "light");

export function toggleTheme() {
  themeStore.set(themeStore.get() === "light" ? "dark" : "light");
}

export function toggleBgPattern() {
  bgPatternStore.set(
    bgPatternStore.get() === "dot-grid" ? "grid-paper" : "dot-grid"
  );
}

const initThemeStoreSubscribe = () => {
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  };

  themeStore.subscribe((theme) => {
    applyTheme(theme);
  });
};

const initBgPatternStoreSubscribe = () => {
  const applyBgPattern = (pattern) => {
    if (pattern === "dot-grid") {
      document.body.classList.remove("grid-paper");
      document.body.classList.add("dot-grid");
    } else if (pattern === "grid-paper") {
      document.body.classList.remove("dot-grid");
      document.body.classList.add("grid-paper");
    }
  };

  bgPatternStore.subscribe((pattern) => {
    applyBgPattern(pattern);
  });
};

if (typeof window !== "undefined") {
  onMount(themeStore, initThemeStoreSubscribe);
  onMount(bgPatternStore, initBgPatternStoreSubscribe);
}
