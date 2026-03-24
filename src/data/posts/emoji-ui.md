---
title: "Emoji UI"
description: "Using emojis as graphical elements."
slug: "emoji-ui"
created: 2026-03-11
tags: ["Svelte", "Emoji-UI", "emoji", "web development"]
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjgx9l1b94tl7gs4pzeyp.png"
canonical: ""
project: ""
linkedinURL: ""
devtoURL: ""
mediumURL: ""
---

Emojis are a very interesting subject. It was invented in Japan approximately one human life [ago](https://blog.gingerbeardman.com/2024/05/10/emoji-history-the-missing-years/), but nowadays, it's everywhere around the world. And with AI tools using emojis by default, reality became even more saturated with them. 

Emojis back then:
<figure>
<img src="https://cdn.gingerbeardman.com/images/posts/emoji-history-sharp-pi-4000-emoji-table-16-16.png#pi4000" alt="Emoji present on the Sharp PI-4000 (1994)" title="Emoji present on the Sharp PI-4000 (1994)"/>
<figcaption>Emoji present on the Sharp PI-4000 (1994)</figcaption>
</figure>

[Emojis now](https://www.forbes.com/sites/katharinabuchholz/2024/07/12/a-short-history-of-the-emoji-infographic/):
<figure>
<img src="https://imageio.forbes.com/specials-images/imageserve/66913bd8c7b3af9024299265/20240712-Emojis-Forbes/0x0.jpg?width=960&dpr=1.5" alt="Number of the emojis by year" title="Number of the emojis by year"/>
<figcaption>Number of the emojis by year</figcaption>
</figure>

And one of the most interesting things about emojis is that technically, that's not (just) an image, but a part of the Unicode table, together with other symbols, letters and numbers. Which means, they're (somewhat) omnipresent across devices and platforms.

So, I was thinking, is it possible to create a UI, using only emojis as graphical elements (obviously not counting cards, containers, etc)? Your first response would be - yes, obviously? Why do you even need to write a project for that? But think about it. How close that UI would be to a "serious" one?

Anyway, let's go straight to making it. First of all, I use Svelte simply because I want to see it in action. You're free to use any other framework/library (I wrote the first version of the project in React, but it was obvious overkill) or not use any and enjoy the pure vanilla JS. I've talked with Gemini a bit, and it's supposed to pair emoji UI with glassmorphism, which is...questionable, but we can live with that.
Here is my prompt for GitHub CoPilot to create the first iteration of the project:

> Create a Svelte (Vite) app scaffold. UI: Glassmorphism (blur, semi-transparent) using only Unicode/emojis for icons (no SVGs/images). CSS: Pure CSS with a manual Atomic utility system (spacing, flex). Features: Dark mode toggle (Svelte store + prefers-color-scheme). Structure: Top navbar with Emoji tabs to switch views (Buttons, Radios, Inputs) using Svelte transitions. Components: GlassCard.svelte, ThemeToggle.svelte. Use CSS variables for all values.

Results are immediately "playable", but not really impressive. Let's fix that.

### Icons

Well, it's the most obvious thing we start with, treating emojis as icons.

I've created the EmojiIcon component:

```svelte
<script>
  export let icon;
  export let label = ""; 
  export let deco = false;
  export let title = "";

  let className = "";
  export { className as class };
</script>

<span 
  {title}
  role={deco ? null : "img"} 
  aria-label={deco ? null : label} 
  aria-hidden={deco ? "true" : "false"}
  class="sym {className}"
  {...$$restProps}
>
  {icon}
</span>
```

And here is the result: some emojis, "natural", and slightly changed, using the basic filters.

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9w76hlgsgxmjlqjc64iu.png" alt="Emojis, natural and slightly changed" title="Emojis, natural and slightly changed"/>
<figcaption>Emojis, natural and slightly changed</figcaption>
</figure>

### Buttons

It's the second simplest component, right after EmojiIcon:

```svetle
<script>
    import EmojiIcon from "./EmojiIcon.svelte";
    
    export let icon = "🆗";
    export let text = "";
    export let iconBtn = false; 
    export let reverse = false;
    
    export let title = "";
    export let ariaLabel = text || title || (iconBtn ? "icon button" : "button");
    
    let className = "";
    export { className as class };
  </script>
  
  <button 
    class="{className}" 
    class:btn={!iconBtn} 
    class:btn-icon={iconBtn}
    class:flex-reverse={reverse}
    aria-label={ariaLabel} 
    {title}
    {...$$restProps}
  >
    {#if text && !iconBtn}
      <span class="btn-text">{text}</span>
    {/if}
    
    <EmojiIcon {icon} deco={true} />
  </button>
  
  <style>
    button {
      transition: all var(--transition-fast, 150ms);
    }
  
    .flex-reverse {
      flex-direction: row-reverse;
    }
  
    .btn-text {
      line-height: 1;
    }
  </style>
```

And here is the result: buttons and icon buttons, rounded and different in size:

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0o3ai9z4rg8jec5e6oxc.png" alt="Buttons in different styles" title="Buttons in different styles"/>
<figcaption>Buttons in different styles</figcaption>
</figure>

### Radiobuttons and checkboxes

If you think about it, radio buttons and checkboxes are extremely similar. The only difference is that radio buttons are pack animals, while checkboxes can coexist in groups but prefer solitary placement. So here is the unified element:

```svetle
<script>
  export let type = "radio";
  export let group;
  export let value;
  export let label = "";
  export let disabled = false;
  export let theme = "radiobutton";
  export let invert = false; 

  export let off = null;
  export let on = null;

  // default themes
  const themes = {
    radiobutton: { off: "🔘", on: "⚫" },
    circle: { off: "🔴", on: "⭕" },
    green_square: { off: "🟩", on: "✅" },
    blue_square: { off: "🟦", on: "☑️" },
  };

  $: activeOff = off ?? themes[theme]?.off ?? "🔘";
  $: activeOn = on ?? themes[theme]?.on ?? "⚫";

  // Manual Checkbox Logic
  function handleCheckbox(e) {
    if (e.target.checked) {
      group = [...group, value];
    } else {
      group = group.filter((v) => v !== value);
    }
  }
</script>

<label
  class="emoji-input"
  class:disabled
  class:is-inverted={invert}
  style="--emoji-off: '{activeOff}'; --emoji-on: '{activeOn}';"
>
  {#if type === "checkbox"}
    <input
      type="checkbox"
      checked={group.includes(value)}
      on:change={handleCheckbox}
      {disabled}
      {...$$restProps}
    />
  {:else}
    <input type="radio" bind:group {value} {disabled} {...$$restProps} />
  {/if}

  <span class="emoji-text">
    <slot>{label}</slot>
  </span>
</label>

<style>
  .emoji-input {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    width: fit-content;
    user-select: none;
    gap: 0.5rem;
  }

  .emoji-input:not(.disabled):hover {
    background: var(--glass-bg-hover, rgba(255, 255, 255, 0.1));
  }
  .emoji-input:not(.disabled):active {
    transform: scale(0.96);
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .emoji-text::before {
    display: inline-block;
    width: 1.5em;
    text-align: center;
    font-size: 1.3rem;
    content: var(--emoji-off);
    transition:
      filter 0.2s ease,
      transform 0.2s ease;
  }

  input:checked + .emoji-text::before {
    content: var(--emoji-on);
  }

  .is-inverted input:checked + .emoji-text::before {
    content: var(--emoji-off) !important;
    filter: invert(1);
    transform: scale(1.1);
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
    filter: grayscale(1);
  }

  [disabled] {
    cursor: not-allowed;
    opacity: 0.5;
    filter: grayscale(1);
    pointer-events: none; /* Stops clicks entirely */
  }
</style>
```

Techically, you can use whatever you want for your checkboxes and radios, but for the sake of consistency, I've chosen "squares" for checkboxes (🟩 and ✅, 🟦 and ☑️, ✔️ and ❌) and "circles" for radios (🔘 and inverted 🔘, ⚪ and ⚫, 🔴 and ⭕ (まる maru, japanese equivalent of a checkmark)). There are more possible pairs, and you're free to experiment, obviously. 

Radiobuttons:
<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3itteclai8phro2hh9zp.png" alt="Radiobuttons" title="Radiobuttons"/>
<figcaption>Radiobuttons</figcaption>
</figure>

Checkboxes:
<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tlwxwcz8vtuesbjiia8q.png" alt="Checkboxes" title="Checkboxes"/>
<figcaption>Checkboxes</figcaption>
</figure>

> If you're really invested, you can even make a tri-state checkbox by using ✅, ❎, and 🟩.

### The main element

And here is the main star of the whole project, a mockup of an emoji-driven dashboard, the Emoji Analytics Dashboard (quite a long image, better open it in new tab):
<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dn6bshyqv2gpnh1p7o10.png" alt="Emoji Analytics Dashboard" title="Emoji Analytics Dashboard"/>
<figcaption>Emoji Analytics Dashboard</figcaption>
</figure>

### A few 👎
Unfortunately, the deeper you go, the more and more hidden dangers you'll encounter. One of the most obvious things is that not all emojis are widely available across platforms, systems, and browsers. For example, Chrome on Windows doesn't show country flag emojis because Windows' default font, Segoe UI Emoji, deliberately lacks flag support to avoid political complexities. Instead, Chrome displays two-letter country codes (e.g., "JP" instead of a flag of Japan). That's why there is a thing called [RGI](https://emojipedia.org/glossary#rgi), or Recommended for General Interchange, which is _"A subset of emojis which is likely to be widely supported across multiple platforms"_. The keyword is _"likely"_, not guaranteed. Because surprise-surprise, emoji flags are RGI, despite Windows & Chrome combination not representing them properly.
The second thing is that emojis are slightly different platform- and device-wise. It's not that much of a problem, just a mere nuance, but you should keep it in mind.

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9cao43pc1lomy6zt71xl.png" alt="Crocodile emoji across platforms" title="🐊 across platforms"/>
<figcaption>🐊 across platforms</figcaption>
</figure>

[Sometimes](https://thedavidbarton.github.io/blog/os-dependent-emoji-display/), even the different versions of the same OS can return different results:

<figure>
<img src="https://thedavidbarton.github.io/img/blog/os-dependent-emoji-display-02.png" alt="Crocodile emoji Windows versions" title="🐊 across Windows versions"/>
<figcaption>🐊 across Windows versions</figcaption>
</figure>

But there are ways to go around. First of all, you can always check how the emoji would look on different platforms, using an emoji encyclopedia, like [emojiterra](https://emojiterra.com/). And the second is to return the most fitting emoji for the platform, using the [userAgent](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent) property. Like, here:

```javascript

const userAgent = window.navigator.userAgent

// Mac
if (userAgent.includes("Macintosh")) {
   // insert Apple-compatible emoji
} 
else if (userAgent.includes("Windows")) {
   // insert Windows-compatible emoji
} 
// etc
```

Also, there is one more thing, is not that much of a flaw _per se_, but rather mildly infuriating. Technically, you can generate emojis randomly, no need to store an array of predefined ones. But that would mean a breach of WAI-ARIA accessibility principles, since the Unicode table doesn't ([always](https://cldr.unicode.org/translation/characters/short-names-and-keywords)) store description.

```javascript
  function getRandomSafeEmoji() {
    const emojiRanges = [
      [0x1f600, 0x1f64f], // Emoticons (Faces, etc.)
      [0x1f300, 0x1f320], // Misc Symbols & Pictographs (Nature, Food)
      [0x1f400, 0x1f4d0], // Animals & Objects
      [0x1f680, 0x1f6c0], // Transport & Map Symbols
    ];

    // Pick a random range from our safe list
    const range = emojiRanges[Math.floor(Math.random() * emojiRanges.length)];

    // Generate a random code point within that range
    const codePoint =
      Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    return String.fromCodePoint(codePoint);
  }
```

### A way more 👍
Despite all it's flaws, emoji stays a very powerful instrument. You can do a LOT. Like, using emoji as cursor? Not a problem.

```css
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>✒️</text></svg>") 16 0, auto;
```

Using emoji as favicon? Easy.

```html
    <link
      rel="icon"
      type="image/svg+xml"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>"
    />
```

Using emojis as the only graphical elements? Yes, definitely. Even that very simple project can show, that you don't need to spend time on choosing the proper icons and stuff. Use emojis to speed up development of the MVP and add all the bells and whistles later. 

**Don't Be Afraid To Experiment!**

You can try live at [https://al3xsus.github.io/emoji-ui/](https://al3xsus.github.io/emoji-ui/)
You can see code at [https://github.com/al3xsus/emoji-ui](https://github.com/al3xsus/emoji-ui)

Thanks for your attention. Feel free to share your opinion in comments.