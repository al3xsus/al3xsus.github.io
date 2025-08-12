import { useState } from "preact/hooks";
import VisualCoreComplex from "./VisualCoreComplex";
import VisualCoreSimple from "./VisualCoreSimple";

export default function HeroElement() {
  const themes = ["blueprint", "sustainable", "journal", "deco"]; // Available themes
  const [theme, setTheme] = useState(
    themes[Math.floor(Math.random() * themes.length)]
  ); // Randomly select a theme
  const [mode, setMode] = useState("simple"); // Default mode

  return (
    <div className="w-full h-full flex-col items-center justify-center">
      <div className="w-full flex gap-1 rounded-lg border border-grid overflow-hidden bg-background">
        <button
          type="button"
          id="theme-toggle"
          className={`p-2 hover:bg-secondary transition-colors grow-1 ${
            mode === "complex" ? "bg-primary" : "bg-background"
          }`}
          aria-label="Set Complex Mode"
          onClick={() => setMode("complex")}
          disabled={mode === "complex"}
        >
          Complex
        </button>
        <button
          type="button"
          id="theme-toggle"
          className={`p-2 hover:bg-secondary transition-colors grow-1 ${
            mode === "simple" ? "bg-primary" : "bg-background"
          }`}
          aria-label="Set Simple Mode"
          onClick={() => setMode("simple")}
          disabled={mode === "simple"}
        >
          Simple
        </button>
      </div>
      {mode === "complex" && (
        <div class="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
          {themes.map((buttonTheme) => (
            <button
              key={buttonTheme}
              class={`cursor-pointer px-2 py-1 rounded text-foreground transition-colors ${
                buttonTheme === theme
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : ""
              }`}
              onClick={() => setTheme(buttonTheme)}
              aria-label={`Set Theme to ${
                buttonTheme.charAt(0).toUpperCase() + buttonTheme.slice(1)
              }`}
            >
              {buttonTheme.charAt(0).toUpperCase() + buttonTheme.slice(1)}
            </button>
          ))}
        </div>
      )}

      {mode === "complex" ? (
        // <VisualCoreComplex theme={theme} />
        <text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Under construction, please check back later!
        </text>
      ) : (
        <VisualCoreSimple theme={theme} />
      )}
    </div>
  );
}
