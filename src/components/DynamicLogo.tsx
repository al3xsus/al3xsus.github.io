// components/DynamicLogo.tsx
import { useStore } from "@nanostores/preact";
import { themeStore } from "../stores/mainStore";

import logoDark from "../images/logo-dark.png";
import logoLight from "../images/logo-light.png";

export default function DynamicLogo() {
  const theme = useStore(themeStore);

  const img = theme === "light" ? logoLight : logoDark; // ImageMetadata

  return (
    <img
      id="logo"
      class="w-16 h-16 md:w-10 md:h-10"
      src={img.src} // <-- string
      width={img.width} // optional but prevents CLS
      height={img.height} // optional but prevents CLS
      alt={`Main Logo, ${theme} mode.`}
      decoding="async"
      loading="eager"
    />
  );
}
