import { useStore } from "@nanostores/preact";
import { bgPatternStore, toggleBgPattern } from "../stores/mainStore";

export default function bgPatternButton() {
  const bgPattern = useStore(bgPatternStore);

  return (
    <button
      type="button"
      id="bg-pattern-toggle"
      class="p-2 hover:bg-grid transition-colors rounded-lg"
      aria-label={`Toggle Background Pattern`}
      onClick={toggleBgPattern}
    >
      <svg
        id="bg-pattern-icon"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        stroke-linecap="round"
      >
        {bgPattern === "dot-grid" ? (
          <path
            id="grid-paper-icon"
            d="M2 2v20h20V2zm19 6h-5V3h5zm-6-5v5H9V3zM3 9h5v6H3zm6 0h6v6H9zM8 3v5H3V3zM3 21v-5h5v5zm6-5h6v5H9zm12 5h-5v-5h5zm-5-6V9h5v6z"
          ></path>
        ) : (
          <path
            stroke-width="2"
            id="dot-grid-icon"
            d="M5.99 6H6m5.99 0H12m5.99 0H18M5.99 12H6m5.99 0H12m5.99 0H18M5.99 18H6m5.99 0H12m5.99 0H18"
          ></path>
        )}
      </svg>
    </button>
  );
}
