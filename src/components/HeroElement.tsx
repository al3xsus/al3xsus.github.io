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
    <div className="w-full h-full flex-col items-center justify-space-around   align-middle">
      <h3 className="text-3xl font-bold mb-4">Under Construction</h3>
      <p className="text-lg">
        Everything is under construction, pls come back later when it's done
      </p>
    </div>
  );
}
