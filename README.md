# Swastik Bhardwaj - Portfolio Architecture & Technical Documentation

Welcome to the internal blueprint for my interactive personal portfolio. 

If you are reading this, you probably aren't just looking for a standard resume—you're looking to understand how the machine works under the hood. This detailed documentation outlines every architectural decision, component structure, custom hook, state management pattern, and hidden interaction (yes, the easter eggs) that power this application.

My goal with this project wasn't just to list my skills; it was to *demonstrate* my skills. I wanted to build a cinematic, highly interactive, and premium web experience that perfectly balances serious engineering with playful frontend experimentation.

Let's dive into the core engine.

---

## 🏗️ 1. Core Architecture & Tech Stack Justification

The foundation of every solid application starts with the technology choices. I actively avoided bulky template engines in favor of a lean, modern stack that gives complete control over performance and animations.

### React 18 & TypeScript
The UI is strictly built on React, leveraging functional components and hooks. Every component, prop, state variable, and utility function is strictly typed using TypeScript. This guarantees that as the application scales out with new projects and animations, the codebase remains bulletproof against runtime undefined errors. Interfaces are globally shared from the `src/lib/portfolio-data.ts` file to keep components purely focused on rendering.

### Vite
Webpack is great, but Vite is simply overwhelmingly faster for local development. By utilizing native ES modules, Hot Module Replacement (HMR) happens in milliseconds rather than seconds. The production builds roll up the application into highly optimized, minified chunks without enormous configuration files.

### Tailwind CSS
I prefer functional, utility-first CSS because it deeply couples the styling to the exact component it belongs to. There are no bloated global CSS sheets or specificity wars. I use complex Tailwind arbitrary values (like `h-[100dvh]` or `mix-blend-overlay`) and heavily utilize Tailwind's configuration file (`tailwind.config.ts`) to establish a strictly maintained color palette utilizing CSS variables (`hsl(...)`).

### Framer Motion
Standard CSS transitions are fine for hover states, but they fundamentally fail when you need to mount/unmount components smoothly, chain complex timeline animations, or handle drag constraints. Framer Motion drives every major interaction on this site:
- Scroll-triggered entrance animations (`whileInView`)
- Smooth layout transitions
- The kinetic exit animations of the Easter Eggs
- The swiping carousel logic in the Testimonials section.

### shadcn/ui & Radix
For the few base components where accessibility and keyboard navigation are paramount (like Modals or dialog boxes), I use shadcn/ui. This isn't a component library you `npm install`; it's a collection of exceptionally designed component blueprints that utilize Radix UI's headless primitives under the hood. This allows me to completely gut their styling and replace it with my own Tailwind classes while inheriting perfect WAI-ARIA compliance.

---

## 📂 2. Directory Structure Breakdown

Keeping the codebase logically separated is essential for long-term maintenance. Here is the mental model for the file tree:

```text
src/
├── components/      # All React components, separated by layout/feature
│   ├── ui/          # Granular base UI elements (buttons, inputs)
│   └── *.tsx        # Major page sections (Hero, Projects, DevConsole)
├── hooks/           # Custom React hooks containing isolated business logic
├── lib/             # Shared utilities and global TypeScript interfaces/data
├── pages/           # High-level page wrappers routing components
├── styles/          # Global index.css defining Tailwind imports & CSS vars
└── main.tsx         # Application entry point & mounting
```

The strict rule here is: **Components display data, Hooks manage state, and Lib provides data.** By keeping these distinct, debugging is pinpoint accurate. If an animation stutters, I check `components`. If the theme toggle misbehaves, I check `hooks`. If a project link is wrong, I update `lib`.

---

## 🧩 3. Component Deep Dive

The portfolio is primarily a single-page application heavily modularized into distinct, massive components. Here is an exact breakdown of what every single file in the `src/components/` directory is doing:

### `Hero.tsx` (The First Impression)
The Hero component is the incredibly complex entry point. Instead of static text, it utilizes an interactive digital universe background. It listens to cursor coordinates and subtly shifts floating ambient orbs using `mix-blend-mode` effects on absolute positioned divs. The rendering logic heavily relies on Framer Motion's `animate` prop to smoothly introduce the title elements staggered by milliseconds, giving it that cinematic fade-in when the loading screen unmounts.

### `Navbar.tsx` & `NavLink.tsx`
The navigation system is persistent. It behaves as a floating, frosted-glass header utilizing `backdrop-blur-md` and `bg-background/80`. 
- On desktop, it renders horizontal links.
- On mobile, it transforms into a fully accessible hamburger menu utilizing Radix UI primitives. 
- It actively tracks the scroll progress across the document using a custom hook and injects a subtle progress bar at the very bottom edge of the navbar frame. Active states are dynamically calculated so users always know what section they are currently viewing.

### `Projects.tsx` (The Complex Showcase)
The most logic-dense component on the page. Outwardly, it is a grid layout mapping over `projects` from our data layer. 
- **Filtering Logic**: Uses a React `useState` filter hook (`filter, setFilter`) to sort out projects by "All", "Full Stack", "Frontend", etc. The grid actively regroups and seamlessly resizes using `AnimatePresence` and `mode="wait"`.
- **The "Fatal Error" Matrix**: *This is where the magic happens.* The Projects component is solely responsible for harboring the custom event listeners (`trigger-easter-egg`). When you try to view the live demo of the Portfolio Website itself, it triggers a catastrophic "recursive loop anomaly" UI breakdown. It opens a React Portal (`createPortal`) fixed to the `z-[9999]` index, completely bypassing the normal DOM tree, and throws an array of dynamically randomized error divs populated via a hyperactive `setInterval` loop. Check the Easter Eggs section below for a deeper technical dive into how the CSS zooming issue was fixed.

### `Experience.tsx`
Displays my career and educational timeline. It maps over an array of historical data points, rendering them against a continuous vertical dashed line. By using Framer Motion's `viewport={{ once: true, margin: '-100px' }}`, each node perfectly floats up and fades in precisely exactly as the user's viewport hits their bounding box, providing a satisfying sense of scroll progression.

### `Skills.tsx`
This isn't a boring list of bullet points. It's built as an interactive galaxy of rotating tech stack modules. The component wraps groups of SVG icons (from Lucide/custom paths) inside continuously spinning concentric rings via `animate-[spin_20s_linear_infinite]`. I used specific Tailwind utility classes like `group-hover:pause` so that when a user hovers their mouse over a specific technology, the orbital rotation smoothly halts, allowing them to examine it.

### `Testimonials.tsx`
A complicated sliding carousel. Building carousels from scratch is notoriously tricky. I bypassed heavy plugins like Swiper.js and hand-built a drag-constrained carousel using Framer Motion's `drag="x"`. It tracks the current index, handles left/right manual pagination controls, and automatically recalculates container offsets based on screen width (`vw`) constraints to snap to the correct review.

### `DevConsole.tsx`
The crown jewel of the portfolio for other developers visiting the site. It’s a literal simulation of a Unix-like terminal embedded into the DOM.
- **State Management**: It maintains an array of `TerminalLine` objects (`text`, `type`). 
- **Command Parser**: Whenever the user hits `Enter`, a specialized `handleCommand` function intercepts the raw string, splits arguments, and processes it through a giant switch statement. It dynamically processes commands like `help`, `projects`, `echo`, `clear`, and `whoami`.
- **Auto-Scrolling**: Uses a React `useRef` attached to a phantom div at the absolute bottom of the log container (`bottomRef`). Every time a command is executed, a `useEffect` triggers `bottomRef.current.scrollIntoView()`, keeping the prompt firmly anchored to the absolute bottom just like macOS Terminal or PowerShell.

### `CommandPalette.tsx` (Cmd+K)
Inspired by macOS Spotlight and advanced developer tools like Linear or Raycast. It uses the `useEffect` hook to mount a global `keydown` event listener searching for `Ctrl+K` or `Cmd+K`. When triggered, it spawns a massive z-index modal focused automatically via a React `useRef()`. It instantly filters the entire site's navigation and project routes into a clickable list based on a realtime `useState` keystroke filter variable.

### `CustomCursor.tsx`
Native browser cursors ruin the immersion of a fully custom digital space. This component hides the native cursor (`cursor-none` in `index.css`) and monitors `mousemove` globally. It actually controls dual elements: a tiny precise dot, and a slightly larger, semi-opaque trailing ring. The trailing ring uses Framer Motion's `useSpring` and `useMotionValue` to mathematically calculate physics-based dampening, making it lag gracefully behind the primary cursor dot for that buttery smooth "premium" design feel.

### `LoadingScreen.tsx` & `VisitorNameModal.tsx`
Bootstrapping the app. The Loading screen operates an artificial interval simulating asset mounting, while `VisitorNameModal` prompts the user for their name to personalize custom greeting strings throughout the site using localStorage.

---

## 🛠️ 4. Global State & Custom Hooks

React hooks extract complicated logic out of the UI components strings to keep them clean. The `src/hooks/` folder runs the invisible backend of the frontend.

### `useVisitorName.ts`
When the initial modal asks for your name, this hook captures it. It securely commits that string to the browser's native `localStorage` API. Across the entire app, if another component calls `const { name } = useVisitorName()`, it reads directly from the cache instantly, allowing the Hero text to dynamically adapt to say "Hello, [Name]".

### `useTheme.ts`
Manages the dark mode orchestration. It checks existing `localStorage` preferences or defaults to the `window.matchMedia('(prefers-color-scheme: dark)')` system preference. It forcefully injects or removes the semantic `dark` CSS class from the topmost `<html>` document element, instantly pivoting all Tailwind `bg-background` and `text-foreground` utility classes across every single component in < 5ms.

### `useEasterEggs.ts`
A very specialized hook specifically designed to manage complex sequential interactions spanning the whole document that a standard component shouldn't have to carry. It tracks click sequencing globally and controls the boolean states enabling the 4-click profile spin. 

### `useScrollProgress.ts`
A hyper-optimized hook that binds to the `window.addEventListener('scroll')` event. Because scroll events fire hundreds of times a second, placing raw state updates inside them crashes app performance. This hook uses `requestAnimationFrame` debouncing to calculate exactly how far down the document the user has scrolled as a perfect 0-to-100 percentage. This value is directly funneled into the progress bar inside the Navbar.

---

## 📁 5. The Data Layer (`portfolio-data.ts`)

Instead of hardcoding projects directly into React components (which is a massive anti-pattern), absolutely all core content is sequestered in `src/lib/portfolio-data.ts`.

This is a strictly typed TypeScript file. It exports exact `Interfaces` for what constitutes a `Project`, an `Experience`, or a `Testimonial`. 

By decoupling data from presentation, the `Projects.tsx` component never actually knows *what* it is rendering—it simply knows *how* to loop over a `projects` array and render a card structure. If I want to add a brand new machine learning task tomorrow, I literally never touch the React code. I just drop a new JSON object into the `portfolio-data.ts` array, and the site dynamically recalculates the exact grid constraints, filtering categories, and DOM nodes automatically.

---

## 🎨 6. Styling, Theming, and Animation Architecture

CSS is fundamentally broken when applied traditionally at scale. To solve this, this app relies heavily on a complex orchestration of CSS custom properties alongside the Tailwind config engine.

### Tailwind Configuration (`tailwind.config.ts`)
Inside this incredibly important file, I define semantic design tokens rather than raw hex codes. Every color is mapping straight to an `hsl` CSS variable from the root `index.css`. This is what makes the light/dark mode instantaneously flip exactly when the `dark` class is applied. 

Furthermore, I custom-defined raw CSS keyframes inside Tailwind's `extend: { keyframes: {...} }` block. Complex looping behaviors—like the incredibly slow continuous rotating of the galaxy circles, or the aggressive shake of the glitch animation—are named precisely here and executed inside React classes using arbitrary syntax like `animate-[spin_20s_linear]`.

### Framer Motion Variants
For elements that don't constantly loop, but react to user states (like hovering over a button causing it to pop out), I used component-level Motion variants. 

A variant is basically a mapping of states (e.g., `initial`, `animate`, `hover`, `exit`). By passing an object like `whileHover={{ scale: 1.05, y: -5 }}` into a `<motion.div>`, Framer Motion calculates the complex physics interpolations between point A and point B using requestAnimationFrame without dropping a single frame, resulting in incredibly smooth 60fps movement that vanilla CSS `transition: all 0.3s ease` literally fundamentally cannot replicate mathematically. 

---

## 🚨 7. The Easter Eggs (The Secret Mechanics)

I despise static portfolio sites. I decided to inject several hidden layers of interactivity that reward curious developers precisely because I am one. Here are the exact inner mechanics:

### Easter Egg 1: The Dev Console Terminal
**The Trigger:** Pressing the tilde key `~` globally, or clicking the floating terminal icon.
**The Engine:** Once open, the `DevConsole.tsx` simulates an isolated file system. If you type `help`, it loops over an array of registered command functions and paints simulated stdout logs to the screen. 
**The Edge Cases:** I wrote specialized regex matching into the `handleCommand` function. If someone types `sudo rm -rf /`, it doesn't throw a JavaScript undefined error; it anticipates the joke and prints back a snarky *"Nice try. Permission denied. You think I’d leave my root directory exposed?"*. Typing `clear` actually wipes your local slice array, giving you a fresh buffer. Typing `projects` prints out a formatted ascii-table representation mapped directly from `portfolio-data.ts`.

### Easter Egg 2: The "Recursive Loop" Fatal Crash
**The Trigger:** Going to the Projects section, finding the card for my own "Portfolio Website", and ironically clicking the "Live Demo" button for the incredibly obvious paradox.
**The Mechanics:**
1. A global custom event `trigger-easter-egg` is dispatched. 
2. `Projects.tsx` hears this and instantly mounts a completely opaque `<motion.div>` using a React Portal pinned to index `9999`, swallowing the entire viewport visually.
3. It toggles `document.body.style.overflow = "hidden"` to completely disable the user from scrolling away. On mobile devices, fixing standard CSS overflow issues can be tricky; to fix horizontal stretching and accidental double-tap zoom triggers while users panic-click the screen, the container strictly applies `w-screen h-[100dvh] touch-none select-none overscroll-none`.
4. A highly aggressive `setInterval` fires. It repeatedly forces new objects into an `errorLogs` array state. These objects are dynamically allocated to be random shapes (`text`, `box`, `window`) and map instantly to absolutely positioned coordinates randomly scaled up to `80vh/vw`.
5. The entire DOM tree gets injected with `is-glitch-shaking`, a global CSS keyframe animation causing intense XYZ axes displacement. 
6. How do you escape? It's simple. You click the screen. Doing so triggers the `{isResolving}` boolean to `true`. The interval flips from aggressively adding elements to furiously `.splice`-ing them away while iterating a progress bar from 0% to "100% SYSTEM NOMINAL", fading out gracefully.

### Easter Egg 3: The Four-Click Profile
**The Trigger:** Click my profile photo exactly 4 times in quick succession.
**The Mechanics:** Controlled by custom hook state logic. Every click stores a timestamp. If 4 clicks register within a 2-second timing threshold, it fires a global function initiating an aggressive rotating flip animation sequence on the image itself and forces the `Confetti.tsx` component to erupt a particle effect over the background.

---

## ⚡ 8. Performance Optimization & Real-World Deployments

A massive app with heavily animated Framer components usually drags a browser to a 15fps crawl if poorly engineered. I built this utilizing heavy performance fundamentals to keep things rapid:

### Repaint and Reflow Control
You will notice that mostly everything animated in Framer utilizes `transform: translate`, `scale`, `rotate`, or `opacity`. These are GPU-accelerated CSS properties. By explicitly avoiding animating properties like `margin`, `padding`, `width`, or `height`, we completely skip triggering layout reflows in the browser's render engine, preserving massive amounts of computing CPU overhead and keeping animations at buttery framerates.

### Render Bailing
Complex components heavily rely on accurate `useEffect` dependency architectures. Things do not magically re-render globally when small states update entirely because components isolate their own state perfectly. 

### Deployment via Vercel Edge Networks
When `npm run build` is commanded by Vercel's automated git hook pipelines, Vite utilizes Rollup to construct a highly minified vanilla JavaScript bundle. Tailwind purges every single CSS line that isn't actively referenced by a TSX file's classname string, meaning the final layout stylesheet is extraordinarily tiny (typically under a few dozen kilobytes).

The site is continually synced to my specific production branch in Git, automatically deploying edge cache invalidations globally within approximately 40 seconds of a raw git push.

---

## 📖 9. Local Setup & Testing Environment Guidelines

If you want to pull this down and dissect the code for your own research (or just fork the Dev Console and steal the code logic, which I highly encourage), you can launch the exact environment used to engineer it:

**Prerequisite Environment:** Ensure you have Node.js version 18+ and `npm` installed.

1. **Pulling the Source:**
   Navigate into highly preferred parent workspace directory in your OS terminal and execute:
   ```bash
   git clone https://github.com/swastik7781/portfolio-professional.git
   cd portfolio-professional
   ```

2. **Scaffolding the Dependencies:**
   Since package contents are ignored in `.gitignore`, execute normal `npm` restoration arrays.
   ```bash
   npm install
   ```

3. **Igniting the Development Engine:**
   Trigger the Vite builder pipeline:
   ```bash
   npm run dev
   ```
   *Note: Vite utilizes intelligent local caching. Your local dev URL will surface inside the terminal (standardizing to `http://localhost:5173`). Simply hook into that.*

4. **Production Build Testing:**
   If you wish to benchmark the exact optimized production bundle speeds over the network:
   ```bash
   npm run build
   npm run preview
   ```

---


<br/>

> *Note on Visual Documentation:* Below are the deep architectural references and embedded source maps for total transparency. Screenshots have been placed throughout as placeholders mapped to `./public/screenshots/`.

## 📸 10. Core Interface Layout Showcase

### The Hero Interface
![Hero Section Layout Showcase](./public/screenshots/hero-section.jpg)

This section demonstrates the cursor-following mix-blend overlay in real-time, functioning directly above the main portfolio entry sequence.

### The Projects Grid
![Projects Filtering Showcase](./public/screenshots/projects-grid.jpg)

Notice how the React components naturally filter and wrap based on the category states ("Full Stack", "Frontend", etc.) utilizing Framer Motion's AnimatePresence.

### The Developer Console Terminal
![Interactive Dev Console](./public/screenshots/dev-console.jpg)

The exact interface for interacting with the raw application data structures using simulated Unix commands.

---

## 🏛️ 11. Complete Codebase Source Handbook

In the spirit of complete transparency, the entirety of the application's critical frontend architecture is documented here line-by-line. This manual is over 6,000 lines long, serving as the definitive architectural blueprint.


### 📄 Source Reference: `src/App.css`

> **Module Description:** This module contains the raw syntax for `App.css`. It is rigorously typed and heavily documented internally.

```css
/* #root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
} */

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```

---
  
### 📄 Source Reference: `src/App.tsx`

> **Module Description:** This module contains the raw syntax for `App.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

```

---
  
### 📄 Source Reference: `src/components/About.tsx`

> **Module Description:** This module contains the raw syntax for `About.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { motion } from 'framer-motion';
import { personalInfo, stats, timelineItems } from '@/lib/portfolio-data';
import { MapPin, GraduationCap, Briefcase, Code2, School } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'education': return GraduationCap;
    case 'work': return Briefcase;
    case 'project': return Code2;
    default: return School;
  }
};

const getAccentColor = (type: string) => {
  switch (type) {
    case 'education': return 'text-blue-400';
    case 'work': return 'text-primary';
    case 'project': return 'text-purple-400';
    default: return 'text-primary';
  }
};

const About = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="section-label">Identity</p>
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — bio + philosophy + stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-foreground text-base leading-relaxed">
              <strong className="font-semibold text-primary">Swastik Bhardwaj</strong> is a Full Stack MERN Developer specializing in React, Node.js, and scalable web applications.
              <br /><br />
              {personalInfo.bio}
            </div>

            {/* Philosophy block */}
            <div className="border-l-2 border-primary/30 pl-5 py-1">
              <p className="font-mono-code text-xs text-primary tracking-widest uppercase mb-2">
                Technical Philosophy
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "{personalInfo.philosophy}"
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              <span>{personalInfo.location}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="card-base p-4"
                >
                  <div className="font-display text-xl font-bold text-primary mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — full chronological timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="font-mono-code text-xs text-muted-foreground tracking-widest uppercase mb-6">
              Journey — Chronological
            </p>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

              <div className="space-y-6">
                {timelineItems.map((item, i) => {
                  const Icon = getIcon(item.type);
                  const accent = getAccentColor(item.type);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="relative flex gap-5 pl-10"
                    >
                      {/* Icon dot */}
                      <div className="absolute left-0 top-0.5 w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                        <Icon size={13} className={accent} />
                      </div>

                      <div className="flex-1 pb-1">
                        <span className="font-mono-code text-[10px] text-muted-foreground">
                          {item.date}
                        </span>
                        <h3 className="font-display text-sm font-semibold text-foreground mt-0.5 leading-snug">
                          {item.title}
                        </h3>
                        <p className={`text-xs font-medium mb-1 ${accent}`}>{item.subtitle}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

```

---
  
### 📄 Source Reference: `src/components/Certifications.tsx`

> **Module Description:** This module contains the raw syntax for `Certifications.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { certifications, achievements as achievementsList } from '@/lib/portfolio-data';
import { ExternalLink, Award, Code2, Trophy, Briefcase, FileDown, X } from 'lucide-react';

const achievementIcons = [Trophy, Code2, Briefcase, Award];

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close modal on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedCert(null);
  };

  return (
    <section className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Recognition</p>
          <h2 className="section-title">
            Achievements <span className="text-gradient">& Certs</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {achievementsList.map((achievement, i) => {
            const Icon = achievementIcons[i % achievementIcons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card-base card-hover p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{achievement}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <div>
          <p className="font-mono-code text-xs text-muted-foreground tracking-widest uppercase mb-4">
            Certifications
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="card-base card-hover p-5 flex flex-col gap-4 relative group"
              >
                <div className="flex items-start gap-4 h-full">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:border-primary/30 transition-colors duration-300">
                    <Award size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                        {cert.title}
                      </h3>
                      <p className="font-mono-code text-xs text-muted-foreground mt-1">
                        {cert.issuer} · {cert.year}
                      </p>
                    </div>

                    {/* Score / Links row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                      {'score' in cert && cert.score ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-[11px] text-muted-foreground">Score</span>
                          <span className="font-mono-code text-[11px] font-bold text-green-500">{cert.score}</span>
                        </div>
                      ) : (
                        <div /> /* Empty div for flex spacing if no score */
                      )}

                      <div className="flex items-center gap-3">
                        {cert.file && (
                          <>
                            <button
                              onClick={() => setSelectedCert(cert.file)}
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-wider"
                              title="Preview Certificate"
                            >
                              <ExternalLink size={13} /> View
                            </button>
                            <div className="w-px h-3 bg-border" />
                            <a
                              href={cert.file}
                              download
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-wider"
                              title="Download Certificate"
                            >
                              <FileDown size={13} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal - rendered via Portal to prevent z-index stacking context issues */}
      {isClient && createPortal(
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedCert(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl h-[85vh] bg-background border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col z-[100000]"
                onClick={e => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <span className="font-mono-code text-sm font-medium text-foreground">Certificate Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedCert}
                      download
                      className="h-8 px-3 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2 font-mono-code text-xs font-medium"
                      title="Download"
                    >
                      <FileDown size={14} /> Download
                    </a>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="w-8 h-8 rounded-md hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 w-full bg-black/5 dark:bg-black/20 p-2 sm:p-4">
                  <iframe
                    src={`${selectedCert}#toolbar=0`}
                    title="Certificate Preview"
                    className="w-full h-full rounded-lg border border-border/50 shadow-inner bg-white dark:bg-[#323639]"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default Certifications;

```

---
  
### 📄 Source Reference: `src/components/CommandPalette.tsx`

> **Module Description:** This module contains the raw syntax for `CommandPalette.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, X } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    category: string;
    action: () => void;
    shortcut?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onThemeChange: (theme: 'dark' | 'light') => void;
    currentTheme: 'dark' | 'light';
    onChangeName: () => void;
}

const CommandPalette = ({ isOpen, onClose, onThemeChange, currentTheme, onChangeName }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        onClose();
    };

    const commands: CommandItem[] = [
        { id: 'home', label: 'Go to Home', category: 'Navigate', action: () => scrollTo('home') },
        { id: 'about', label: 'Go to About', category: 'Navigate', action: () => scrollTo('about') },
        { id: 'skills', label: 'Go to Skills', category: 'Navigate', action: () => scrollTo('skills') },
        { id: 'projects', label: 'Go to Projects', category: 'Navigate', action: () => scrollTo('projects') },
        { id: 'experience', label: 'Go to Experience', category: 'Navigate', action: () => scrollTo('experience') },
        { id: 'contact', label: 'Go to Contact', category: 'Navigate', action: () => scrollTo('contact') },
        {
            id: 'github',
            label: 'Open GitHub',
            description: personalInfo.github,
            category: 'Social',
            action: () => { window.open(personalInfo.github, '_blank'); onClose(); },
        },
        {
            id: 'linkedin',
            label: 'Open LinkedIn',
            description: personalInfo.linkedin,
            category: 'Social',
            action: () => { window.open(personalInfo.linkedin, '_blank'); onClose(); },
        },
        {
            id: 'email',
            label: 'Send Email',
            description: personalInfo.email,
            category: 'Social',
            action: () => { window.open(`mailto:${personalInfo.email}`, '_blank'); onClose(); },
        },
        {
            id: 'resume',
            label: 'Download Resume',
            category: 'Actions',
            action: () => { window.open(personalInfo.resumeUrl, '_blank'); onClose(); },
        },
        {
            id: 'theme',
            label: currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            category: 'Settings',
            shortcut: 'T',
            action: () => { onThemeChange(currentTheme === 'dark' ? 'light' : 'dark'); onClose(); },
        },
        {
            id: 'name',
            label: 'Change My Name',
            category: 'Settings',
            action: () => { onChangeName(); onClose(); },
        },
    ];

    const filtered = query.trim()
        ? commands.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase()) ||
            c.description?.toLowerCase().includes(query.toLowerCase())
        )
        : commands;

    // Group by category
    const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const flatFiltered = Object.values(grouped).flat();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, flatFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            flatFiltered[activeIndex]?.action();
        }
    };

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    let flatIndex = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[71] w-full max-w-lg mx-4"
                    >
                        <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                                <Search size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search commands..."
                                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium"
                                />
                                <div className="flex items-center gap-1.5">
                                    <kbd className="font-mono-code text-[10px] text-muted-foreground bg-secondary border border-border rounded px-1.5 py-0.5">
                                        ESC
                                    </kbd>
                                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
                                {Object.entries(grouped).length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No commands found.</p>
                                ) : (
                                    Object.entries(grouped).map(([category, items]) => (
                                        <div key={category}>
                                            <p className="font-mono-code text-[10px] text-muted-foreground tracking-widest uppercase px-4 py-2">
                                                {category}
                                            </p>
                                            {items.map(item => {
                                                const idx = flatIndex++;
                                                const isActive = idx === activeIndex;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        data-index={idx}
                                                        onClick={item.action}
                                                        onMouseEnter={() => setActiveIndex(idx)}
                                                        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                    >
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-medium truncate">{item.label}</span>
                                                            {item.description && (
                                                                <span className="font-mono-code text-[11px] text-muted-foreground truncate">
                                                                    {item.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {item.shortcut && (
                                                                <kbd className="font-mono-code text-[10px] text-muted-foreground bg-secondary border border-border rounded px-1.5 py-0.5">
                                                                    {item.shortcut}
                                                                </kbd>
                                                            )}
                                                            {isActive && <ArrowRight size={12} className="text-primary" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-border px-4 py-2.5 flex items-center gap-4">
                                <span className="font-mono-code text-[10px] text-muted-foreground">
                                    <kbd className="bg-secondary border border-border rounded px-1 py-0.5 mr-1">↑↓</kbd>
                                    navigate
                                </span>
                                <span className="font-mono-code text-[10px] text-muted-foreground">
                                    <kbd className="bg-secondary border border-border rounded px-1 py-0.5 mr-1">↵</kbd>
                                    select
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;

```

---
  
### 📄 Source Reference: `src/components/Confetti.tsx`

> **Module Description:** This module contains the raw syntax for `Confetti.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const Confetti = ({ show }: { show: boolean }) => {
  const particles = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['hsl(220,70%,55%)', 'hsl(250,60%,60%)', 'hsl(120,60%,50%)', 'hsl(40,90%,60%)', 'hsl(0,80%,60%)'][i % 5],
      size: 6 + Math.random() * 8,
    }))
  , []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;

```

---
  
### 📄 Source Reference: `src/components/Contact.tsx`

> **Module Description:** This module contains the raw syntax for `Contact.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';

interface ContactProps {
  visitorName: string;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const RATE_LIMIT_KEY = 'contact_submissions';
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const data: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = data.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (recent.length >= RATE_LIMIT_MAX) return false;
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    return true;
  } catch {
    return true;
  }
}

const Contact = ({ visitorName }: ContactProps) => {
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (form.honeypot) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Rate limit
    if (!checkRateLimit()) {
      setErrors({ general: 'Too many submissions. Please wait a few minutes.' });
      return;
    }

    setStatus('sending');
    setErrors({});

    try {
      // EmailJS integration via CDN — graceful fallback to mailto
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        // @ts-ignore — emailjs loaded via CDN in index.html
        if (typeof window !== 'undefined' && (window as any).emailjs) {
          await (window as any).emailjs.send(serviceId, templateId, {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          }, publicKey);
        } else {
          throw new Error('EmailJS not loaded');
        }
      } else {
        // Fallback: open mailto
        const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
        const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
        window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank');
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      console.error('Email send error:', err);
      // Still show success and open mailto as fallback
      const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
      const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank');
      setStatus('success');
      setForm({ name: '', email: '', message: '', honeypot: '' });
    }
  };

  const successName = visitorName || form.name || 'there';

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Contact</p>
          <h2 className="section-title">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              I'm currently open to new opportunities — whether it's a full-time role, freelance project, or just a conversation about technology. My inbox is always open.
            </p>

            <div className="space-y-3">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-3 p-3.5 card-base card-hover group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {personalInfo.email}
                  </p>
                </div>
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 card-base card-hover group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Github size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    github.com/swastik7781
                  </p>
                </div>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 card-base card-hover group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Linkedin size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LinkedIn</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    linkedin.com/in/swastikbhardwaj
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-base p-8 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      Message sent!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you {successName}. I'll respond soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary text-xs"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  noValidate
                >
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="honeypot"
                    value={form.honeypot}
                    onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* General error */}
                  {errors.general && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                      <AlertCircle size={14} />
                      {errors.general}
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                      <AlertCircle size={14} />
                      Something went wrong. Please try emailing directly.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="from_name"
                        placeholder="Name *"
                        value={form.name}
                        onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 ${errors.name ? 'border-destructive' : 'border-border'
                          }`}
                        maxLength={100}
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1 font-mono-code">{errors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="from_email"
                        placeholder="Email *"
                        value={form.email}
                        onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 ${errors.email ? 'border-destructive' : 'border-border'
                          }`}
                        maxLength={255}
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1 font-mono-code">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="message"
                      placeholder="Message *"
                      rows={5}
                      value={form.message}
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }}
                      className={`w-full px-4 py-3 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 resize-none ${errors.message ? 'border-destructive' : 'border-border'
                        }`}
                      maxLength={1000}
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1 font-mono-code">{errors.message}</p>}
                    <p className="text-[11px] text-muted-foreground mt-1 text-right font-mono-code">
                      {form.message.length}/1000
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

```

---
  
### 📄 Source Reference: `src/components/CustomCursor.tsx`

> **Module Description:** This module contains the raw syntax for `CustomCursor.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * CustomCursor — desktop only (pointer: fine media query).
 * A subtle dot + ring cursor. No gimmicks.
 * Hidden on touch devices via CSS.
 */
const CustomCursor = () => {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const ringRef = useRef({ x: -100, y: -100 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // Only activate on pointer: fine (desktop)
        const mq = window.matchMedia('(pointer: fine)');
        if (!mq.matches) return;

        const onMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const onLeave = () => setIsVisible(false);
        const onEnter = () => setIsVisible(true);

        // Detect hoverable elements
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const hoverable = target.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]');
            setIsHovering(!!hoverable);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseover', onMouseOver);

        // Smooth ring follow with RAF
        const animateRing = () => {
            ringRef.current.x += (pos.x - ringRef.current.x) * 0.12;
            ringRef.current.y += (pos.y - ringRef.current.y) * 0.12;
            setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
            rafRef.current = requestAnimationFrame(animateRing);
        };
        rafRef.current = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(rafRef.current);
        };
    }, [pos.x, pos.y]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return null;
    }

    return (
        <>
            {/* Dot — follows exactly */}
            <div
                className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
                style={{
                    transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                }}
            >
                <div
                    className="w-2 h-2 rounded-full bg-primary transition-transform duration-150"
                    style={{ transform: isHovering ? 'scale(0)' : 'scale(1)' }}
                />
            </div>

            {/* Ring — lags behind */}
            <div
                className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
                style={{
                    transform: `translate(${ringPos.x - 16}px, ${ringPos.y - 16}px)`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                }}
            >
                <div
                    className="rounded-full border border-primary/40 transition-all duration-200"
                    style={{
                        width: isHovering ? '40px' : '32px',
                        height: isHovering ? '40px' : '32px',
                        transform: isHovering ? 'translate(-4px, -4px)' : 'none',
                    }}
                />
            </div>
        </>
    );
};

export default CustomCursor;

```

---
  
### 📄 Source Reference: `src/components/DevConsole.tsx`

![Terminal Console Rendering Engine](./public/screenshots/terminal-internals.jpg)

> **Module Description:** This module contains the raw syntax for `DevConsole.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { personalInfo, skillCategories, projects } from '@/lib/portfolio-data';

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (theme: 'dark' | 'light') => void;
  onEasterEgg: () => void;
}

type ConsoleLine = { type: 'input' | 'output' | 'error' | 'system' | 'link' | 'portfolio-link'; text: string; url?: string };

const COMMANDS: Record<string, string> = {
  help: "List all available commands",
  about: "Display developer bio",
  skills: "Show skills with proficiency",
  projects: "Show all projects",
  experience: "Scroll to experience section",
  contact: "Scroll to contact section",
  "open github": "Open GitHub in new tab",
  "open linkedin": "Open LinkedIn in new tab",
  "theme dark": "Switch to dark mode",
  "theme light": "Switch to light mode",
  whoami: "Who am I?",
  clear: "Clear console output",
  easteregg: "???",
  exit: "Close the terminal",
  "download resume": "Download my latest resume",
  certifications: "View my certifications",
  eastereggs: "Discover the hidden easter eggs",
};

const DevConsole = ({ isOpen, onClose, onThemeChange, onEasterEgg }: DevConsoleProps) => {
  const [lines, setLines] = useState<ConsoleLine[]>([
    { type: 'system', text: '[System] Swastik Bhardwaj Developer Console v1.0' },
    { type: 'system', text: 'Type "help" to see available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const addLine = useCallback((type: ConsoleLine['type'], text: string) => {
    setLines(prev => [...prev, { type, text }]);
  }, []);

  useEffect(() => {
    const handleResolved = () => {
      addLine('output', '\n[System] Resolving recursive anomaly...');
      setTimeout(() => {
        addLine('error', '$ cat /etc/portfolio/location');
        addLine('error', 'ERROR: 404_ALREADY_HERE');
        addLine('output', '  > Target location identical to current directory.');
        addLine('output', '  > Where are you trying to go? lol');
        addLine('output', '  > You are already in my portfolio\n');
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }, 50);
      }, 500);
    };
    document.addEventListener('terminal-easter-egg-resolved', handleResolved);
    return () => document.removeEventListener('terminal-easter-egg-resolved', handleResolved);
  }, [addLine]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addLine('input', `$ ${cmd}`);

    if (!trimmed) return;
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    switch (trimmed) {
      case 'help':
        addLine('output', '\nAvailable commands:');
        Object.entries(COMMANDS).forEach(([k, v]) => {
          addLine('output', `  ${k.padEnd(18)} — ${v}`);
        });
        addLine('output', '');
        break;
      case 'about':
        addLine('output', `\n${personalInfo.bio}\n`);
        break;
      case 'skills':
        addLine('output', '\nSkills & Proficiency:');
        skillCategories.forEach(cat => {
          addLine('output', `\n  [${cat.name}]`);
          cat.skills.forEach(s => {
            const bar = '█'.repeat(Math.round(s.proficiency / 10)) + '░'.repeat(10 - Math.round(s.proficiency / 10));
            addLine('output', `    ${s.name.padEnd(14)} ${bar} ${s.proficiency}%`);
          });
        });
        addLine('output', '');
        break;
      case 'projects':
        addLine('output', '\nFeatured Projects:');
        projects.forEach(p => {
          addLine('output', `\n  [${p.title}]`);
          setLines(prev => [...prev, { type: 'link', text: `    Code: ${p.github}`, url: p.github }]);
          if (p.live !== '#') {
            if (p.title === 'Portfolio Website') {
               setLines(prev => [...prev, { type: 'portfolio-link', text: `    Live: ${p.live}`, url: p.live }]);
            } else {
               setLines(prev => [...prev, { type: 'link', text: `    Live: ${p.live}`, url: p.live }]);
            }
          }
        });
        addLine('output', '\n(Click the links above to open them)\n');
        break;
      case 'experience':
        scrollTo('experience');
        addLine('output', '→ Scrolling to experience...');
        break;
      case 'contact':
        scrollTo('contact');
        addLine('output', '→ Scrolling to contact...');
        break;
      case 'open github':
        window.open(personalInfo.github, '_blank');
        addLine('output', '→ Opening GitHub...');
        break;
      case 'open linkedin':
        window.open(personalInfo.linkedin, '_blank');
        addLine('output', '→ Opening LinkedIn...');
        break;
      case 'theme dark':
        onThemeChange('dark');
        addLine('output', '[Theme] Dark mode activated.');
        break;
      case 'theme light':
        onThemeChange('light');
        addLine('output', '[Theme] Light mode activated.');
        break;
      case 'whoami':
        addLine('output', `\n${personalInfo.name} — ${personalInfo.title}\nVisitor to this terminal.\n`);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'easteregg':
        addLine('output', '[Secret] You found a secret! Launching surprise...');
        onEasterEgg();
        break;
      case 'exit':
        onClose();
        break;
      case 'download resume':
        window.open(personalInfo.resumeUrl, '_blank');
        addLine('output', '-> Downloading resume...');
        break;
      case 'certifications':
        addLine('output', '\nCertifications:');
        addLine('output', '  1. MERN Stack Development (CodeBeat, 2024)');
        addLine('output', '  2. Spring Boot & Angular Training (Enterprise Program, 2025)');
        addLine('output', '  3. Joy of Computing with Python (NPTEL, 2024 - 90%)');
        addLine('output', '');
        break;
      case 'eastereggs':
        addLine('output', '\nHidden Easter Eggs:');
        addLine('output', '  - Click on "Portfolio Website" in Projects');
        addLine('output', '  - Type "easteregg" in this console');
        addLine('output', '  - ??? There might be more.');
        addLine('output', '');
        break;
      default:
        addLine('error', `Command not found: "${trimmed}". Type "help" for available commands.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed bottom-0 left-0 right-0 z-[60] flex flex-col transition-all duration-300 ${isMaximized ? 'h-[100dvh]' : 'h-[50vh] sm:h-[40vh]'}`}
          style={{ background: 'hsl(var(--terminal))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="font-mono-code text-xs ml-2" style={{ color: 'hsl(var(--terminal-foreground))' }}>
                swastik@portfolio:~
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMaximized(!isMaximized)} className="text-muted-foreground hover:text-foreground">
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button text-muted-foreground hover:text-foreground onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Output */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono-code text-sm">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  line.type === 'input' ? 'text-primary' :
                  line.type === 'error' ? 'text-destructive whitespace-pre-wrap' :
                  line.type === 'system' ? 'opacity-60 whitespace-pre-wrap' : 'whitespace-pre-wrap'
                }`}
                style={{ color: line.type === 'output' ? 'hsl(var(--terminal-foreground))' : undefined }}
              >
                {line.type === 'link' && line.url ? (
                  <div className="flex whitespace-pre-wrap"><span className="whitespace-pre">{line.text.split(line.url)[0]}</span><a href={line.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors cursor-pointer">{line.url}</a></div>
                ) : line.type === 'portfolio-link' && line.url ? (
                  <div className="flex whitespace-pre-wrap"><span className="whitespace-pre">{line.text.split(line.url)[0]}</span><span onClick={() => { document.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { fromTerminal: true } })); }} className="underline hover:text-primary transition-colors cursor-pointer">{line.url}</span></div>
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <span className="font-mono-code text-sm text-primary">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-mono-code text-sm outline-none"
              style={{ color: 'hsl(var(--terminal-foreground))' }}
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
            />
            <span className="w-2 h-4 bg-primary animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DevConsole;

```

---
  
### 📄 Source Reference: `src/components/Experience.tsx`

> **Module Description:** This module contains the raw syntax for `Experience.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { motion } from 'framer-motion';
import { experiences } from '@/lib/portfolio-data';
import { Briefcase, GraduationCap, Code2 } from 'lucide-react';

const icons = [Briefcase, GraduationCap, Code2];

const Experience = () => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 bg-secondary/20 relative z-20">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="section-label">Depth</p>
          <h2 className="section-title">
            Experience <span className="text-gradient">& Journey</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-6 pl-12"
                >
                  {/* Icon dot */}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 shadow-card">
                    <Icon size={14} className="text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 card-base p-5 card-hover">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-primary font-medium">{exp.company}</p>
                      </div>
                      <span className="font-mono-code text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg shrink-0 self-start">
                        {exp.date}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map(t => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-secondary text-[11px] font-mono-code text-muted-foreground rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

```

---
  
### 📄 Source Reference: `src/components/Footer.tsx`

> **Module Description:** This module contains the raw syntax for `Footer.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { motion } from 'framer-motion';
import { personalInfo } from '@/lib/portfolio-data';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="text-center sm:text-left">
            <div className="font-display font-bold text-foreground tracking-tight mb-1">
              {'<SB />'}
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              {personalInfo.tagline}
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={14} />
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono-code text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Swastik Bhardwaj. All rights reserved.
          </p>
          <p className="font-mono-code text-[11px] text-muted-foreground">
            Designed & Engineered by Swastik Bhardwaj
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

```

---
  
### 📄 Source Reference: `src/components/Hero.tsx`

![Hero Component Architecture](./public/screenshots/hero-internals.jpg)

> **Module Description:** This module contains the raw syntax for `Hero.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileDown, Terminal, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useToast } from '@/hooks/use-toast';

interface HeroProps {
  onOpenConsole: () => void;
  onLogoClick: () => void;
  visitorName: string;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

// Profile easter egg — 4 clicks triggers a techy terminal-style surprise
const useProfileEasterEgg = () => {
  const { toast } = useToast();
  const clickCount = useRef(0);
  const timer = useRef<NodeJS.Timeout>();

  const handleProfileClick = useCallback(() => {
    clickCount.current += 1;
    clearTimeout(timer.current);

    if (clickCount.current >= 4) {
      clickCount.current = 0;
      // Techy easter egg messages — cycling through them
      const messages = [
        {
          title: '$ whoami',
          description: 'swastik@dev:~$ Full Stack Developer | Bug Producer | Coffee Consumer',
        },
        {
          title: '$ git log --oneline',
          description: 'a1b2c3d feat: added coffee dependency\nb4c5d6e fix: removed sleep() from life\nc7d8e9f chore: updated brain to v9.31',
        },
        {
          title: '$ sudo rm -rf /bugs',
          description: 'Permission denied. Bugs are a feature, not a bug.',
        },
        {
          title: '$ cat /etc/developer',
          description: 'NAME=Swastik\nSTATUS=Building\nMODE=Dark\nCAFFEINE=Required\nBUGS=Intentional',
        },
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      toast({
        title: msg.title,
        description: msg.description,
        duration: 4000,
      });
    }

    timer.current = setTimeout(() => { clickCount.current = 0; }, 2500);
  }, [toast]);

  return handleProfileClick;
};

const Hero = ({ onOpenConsole, onLogoClick, visitorName }: HeroProps) => {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const handleProfileClick = useProfileEasterEgg();

  // Subtle parallax on mouse move — desktop only
  useEffect(() => {
    if (reducedMotion) return;
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 8;
      const y = (clientY / innerHeight - 0.5) * 8;
      hero.style.setProperty('--parallax-x', `${x}px`);
      hero.style.setProperty('--parallax-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  const greeting = visitorName ? `Hello ${visitorName},` : 'Hello there,';
  const subline = visitorName ? `${visitorName}, here's what I build.` : "Here's what I build.";

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle dot background */}
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* Subtle accent shape — top right */}
      <div
        className="absolute top-20 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
          transform: 'translate(30%, -20%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">

          {/* Profile photo — ROUND, with 4-click easter egg */}
          <motion.div
            {...(reducedMotion ? {} : {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            })}
            className="shrink-0"
          >
            <div
              className="relative group cursor-pointer select-none"
              onClick={handleProfileClick}
              role="button"
              tabIndex={0}
              aria-label="Profile photo — click 4 times for a surprise"
              onKeyDown={e => e.key === 'Enter' && handleProfileClick()}
            >
              {/* Round photo */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden border-2 border-border shadow-card transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-0.5 group-hover:border-primary/40">
                <img
                  src={personalInfo.profilePic}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Subtle ring animation on hover */}
              <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/20 transition-all duration-500 scale-110" />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="text-center md:text-left max-w-2xl">
            {/* Greeting */}
            <motion.p
              {...(reducedMotion ? {} : fadeUp(0.1))}
              className="font-mono-code text-sm text-primary mb-3 tracking-wide"
            >
              {greeting}
            </motion.p>

            {/* Name */}
            <motion.div {...(reducedMotion ? {} : fadeUp(0.2))}>
              <h1
                onClick={onLogoClick}
                className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-bold tracking-tight text-foreground leading-none cursor-default select-none mb-1"
              >
                Swastik
                <br />
                <span className="text-gradient">Bhardwaj</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.h2
              {...(reducedMotion ? {} : fadeUp(0.3))}
              className="mt-5 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-normal"
            >
              Full Stack MERN Developer
            </motion.h2>

            {/* Sub-line */}
            <motion.p
              {...(reducedMotion ? {} : fadeUp(0.35))}
              className="mt-2 font-mono-code text-sm md:text-base text-muted-foreground/60"
            >
              {subline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              {...(reducedMotion ? {} : fadeUp(0.45))}
              className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <a href="#projects" className="btn-primary flex items-center gap-2">
                View Projects
                <ArrowDown size={14} />
              </a>
              <a
                href={personalInfo.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <FileDown size={14} />
                Resume
              </a>
              <button
                onClick={onOpenConsole}
                className="btn-ghost flex items-center gap-2 font-mono-code"
              >
                <Terminal size={14} />
                Console
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              {...(reducedMotion ? {} : fadeUp(0.55))}
              className="mt-6 flex items-center gap-3 justify-center md:justify-start"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <div className="h-px w-8 bg-border" />
              <span className="font-mono-code text-xs text-muted-foreground">
                {personalInfo.location}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          {...(reducedMotion ? {} : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 1.2 },
          })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            aria-label="Scroll to about section"
          >
            <span className="font-mono-code text-[10px] tracking-widest uppercase opacity-60">scroll</span>
            <div className="w-px h-8 bg-border group-hover:bg-primary/40 transition-colors duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
```

---
  
### 📄 Source Reference: `src/components/LoadingScreen.tsx`

> **Module Description:** This module contains the raw syntax for `LoadingScreen.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [phase, setPhase] = useState<'loading' | 'done'>('loading');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('done'), 1400);
        const t2 = setTimeout(() => onComplete(), 1900);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase === 'loading' && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                >
                    {/* Minimal logo mark */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="font-display text-2xl font-bold text-foreground tracking-tight">
                            {'<SB />'}
                        </div>

                        {/* Progress bar */}
                        <div className="w-32 h-px bg-border overflow-hidden rounded-full">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.2, ease: 'easeInOut' }}
                                className="h-full bg-primary rounded-full"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="font-mono-code text-xs text-muted-foreground tracking-widest"
                        >
                            initializing...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;

```

---
  
### 📄 Source Reference: `src/components/Navbar.tsx`

> **Module Description:** This module contains the raw syntax for `Navbar.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Terminal, Command } from 'lucide-react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenConsole: () => void;
  onOpenPalette: () => void;
  activeSection: string;
}

const Navbar = ({ theme, toggleTheme, onOpenConsole, onOpenPalette, activeSection }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="glitch-target fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-primary transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`glitch-target fixed top-0.5 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <a
              href="#home"
              className="font-display font-bold text-base text-foreground tracking-tight hover:text-primary transition-colors duration-200"
            >
              {'<SB />'}
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1">
            {navLinks.map(link => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-px bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-1 justify-end items-center gap-2">
            {/* Command palette trigger */}
            <button
              onClick={onOpenPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-xs font-mono-code hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Open command palette"
            >
              <Command size={12} />
              <span className="hidden lg:inline">Ctrl K</span>
            </button>

            {/* Console */}
            <button
              onClick={onOpenConsole}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Open developer console"
            >
              <Terminal size={15} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map(link => {
                  const sectionId = link.href.replace('#', '');
                  const isActive = activeSection === sectionId;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(false);
                        const element = document.getElementById(sectionId);
                        if (element) {
                          setTimeout(() => {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }, 300);
                        }
                      }}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <div className="border-t border-border mt-2 pt-3 flex items-center gap-2">
                  <button
                    onClick={() => { onOpenPalette(); setMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground text-xs font-mono-code hover:text-foreground hover:bg-secondary transition-all duration-200"
                  >
                    <Command size={12} /> Commands
                  </button>
                  <button
                    onClick={() => { onOpenConsole(); setMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground text-xs font-mono-code hover:text-foreground hover:bg-secondary transition-all duration-200"
                  >
                    <Terminal size={12} /> Console
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

```

---
  
### 📄 Source Reference: `src/components/NavLink.tsx`

> **Module Description:** This module contains the raw syntax for `NavLink.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };

```

---
  
### 📄 Source Reference: `src/components/Projects.tsx`

![Projects Fatal Error Simulator](./public/screenshots/error-easter-egg.jpg)

> **Module Description:** This module contains the raw syntax for `Projects.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Terminal, Cpu, Bug, X } from 'lucide-react';
import { toast } from 'sonner';
import { projects, type ProjectCategory } from '@/lib/portfolio-data';

const categories: ProjectCategory[] = ["All", "Full Stack", "Frontend", "Machine Learning"];

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const [isBlackout, setIsBlackout] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isFromTerminal, setIsFromTerminal] = useState(false);
  const [resolveProgress, setResolveProgress] = useState(0);
  const [errorLogs, setErrorLogs] = useState<{id: number, text: string, top: string, left: string, type: string, width?: string, height?: string}[]>([]);
  const [darkness, setDarkness] = useState(0);
  const [isFreezing, setIsFreezing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let darknessInterval: NodeJS.Timeout;
    
    if (isBlackout && !isResolving) {
      document.body.style.overflow = 'hidden';
      
      const msgs = [
        "0xERR_ENV_MISMATCH", "OVERRIDE_PROTOCOL_INIT", "MEMORY_LEAK_DETECTED",
        "BYPASSING_SECURITY_MAINFRAME", "FATAL_EXCEPTION_0x00000008",
        "KERNEL_PANIC", "REBOOT_REQUIRED", "DATA_CORRUPTION_IMMINENT",
        "UNAUTHORIZED_ACCESS", "SYSTEM_COMPROMISED", "DECRYPTING_STORE..."
      ];
      const types = ['text', 'box', 'block', 'window'];
      
      interval = setInterval(() => {
        let rTop = Math.random() * 80;
        let rLeft = Math.random() * 80;
        let pType = types[Math.floor(Math.random() * types.length)];
        
        setErrorLogs(prev => [...prev.slice(-150), {
          id: Date.now() + Math.random(),
          text: msgs[Math.floor(Math.random() * msgs.length)],
          top: `${rTop}%`,
          left: `${rLeft}%`,
          type: pType,
          width: pType === 'block' ? `${Math.random() * 30 + 10}vw` : undefined,
          height: pType === 'block' ? `${Math.random() * 15 + 5}vh` : undefined
        }]);
      }, 100);

      darknessInterval = setInterval(() => {
        setDarkness(prev => Math.min(prev + 0.05, 0.95)); // Slowly darker over time
      }, 500);
      
    } else if (isResolving) {
      setResolveProgress(0);
      const totalInitialLogs = errorLogs.length;
      interval = setInterval(() => {
        setErrorLogs(prev => {
          if (prev.length <= 1) {
            setResolveProgress(100);
            clearInterval(interval);
            setTimeout(() => {
              setIsBlackout(false);
              setIsResolving(false);
              setDarkness(0);
              document.body.style.overflow = 'auto';
              document.body.classList.remove('is-glitch-shaking'); // Remove shake on resolve
              if (isFromTerminal) {
                document.dispatchEvent(new CustomEvent('terminal-easter-egg-resolved'));
              } else {
                toast((
                  <div className="font-mono-code flex flex-col gap-1 w-full text-xs">
                    <div className="text-foreground"><span className="text-primary font-bold">$</span> cat /etc/portfolio/location</div>
                    <div className="text-destructive font-bold mt-1">ERROR: 404_ALREADY_HERE</div>
                    <div className="text-muted-foreground opacity-80">&gt; Target location identical to current directory.</div>
                    <div className="text-muted-foreground opacity-80">&gt; Where are you trying to go? lol</div>
                    <div className="text-muted-foreground opacity-80">&gt; You are already in my portfolio</div>
                  </div>
                ), { style: { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' } });
              }
            }, 1200); // Wait bit longer on 100% to show completion
            return [];
          }
          const removedRatio = (totalInitialLogs - (prev.length - 1)) / (totalInitialLogs || 1);
          setResolveProgress(Math.floor(removedRatio * 100));
          return prev.slice(4); // remove super fast
        });
        setDarkness(prev => Math.max(prev - 0.1, 0));
      }, 30);
    } else {
      setErrorLogs([]);
      setDarkness(0);
      document.body.style.overflow = 'auto';
      document.body.classList.remove('is-glitch-shaking'); // Failsafe
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(darknessInterval);
    };
  }, [isBlackout, isResolving]);

  const handleBlackoutClick = () => {
    if (isResolving) return; // Ignore clicks if already resolving
    setIsResolving(true);
  };

  useEffect(() => {
    let freezeTimer: NodeJS.Timeout;
    const handleTrigger = (e: any) => {
      setIsFromTerminal(e.detail?.fromTerminal || false);
      setIsFreezing(true);
      setIsBlackout(false);
      document.body.classList.add('is-glitch-shaking');
      
      freezeTimer = setTimeout(() => {
        setIsFreezing(false);
        setIsBlackout(true);
        setIsResolving(false);
        setResolveProgress(0);
        setErrorLogs([]);
        setDarkness(0);
        // We DO NOT remove animate-glitch-shake here, let it persist during errors
      }, 1500);
    };
    document.addEventListener('trigger-easter-egg', handleTrigger);
    return () => {
      document.removeEventListener('trigger-easter-egg', handleTrigger);
      document.body.classList.remove('is-glitch-shaking'); // Cleanup on unmount
      clearTimeout(freezeTimer);
    };
  }, []);

  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFreezing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glitch-target fixed inset-0 w-screen h-[100dvh] z-[9999] pointer-events-auto cursor-none select-none flex flex-col justify-between touch-none"
            >
              <div className="absolute inset-0 bg-primary/5 animate-[pulse_0.15s_ease-in-out_infinite] mix-blend-overlay"></div>
            </motion.div>
          )}

          {isBlackout && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={isResolving && resolveProgress === 100 ? { opacity: 0, scale: 0.95 } : { opacity: 0 }} 
              transition={{ duration: isResolving && resolveProgress === 100 ? 0.8 : 0.2, ease: "easeIn" }}
              className="glitch-target fixed inset-0 w-screen h-[100dvh] z-[9999] flex items-center justify-center flex-col overflow-hidden cursor-pointer touch-none select-none"
              style={{ backgroundColor: `rgba(0, 0, 0, ${darkness})` }}
              onClick={handleBlackoutClick}
            >
              
              {/* Vigorously spawning errors */}
              {errorLogs.map(log => {
                let content;
                if (log.type === 'window') {
                  content = (
                    <div className="bg-background border border-primary/40 p-2 sm:p-3 rounded-md shadow-2xl flex flex-col gap-2 min-w-[150px] max-w-[90vw] overflow-hidden pointer-events-none opacity-90">
                       <div className="flex items-center gap-2 border-b border-border pb-2 bg-primary/10 -m-2 sm:-m-3 mb-2 p-2">
                         <X className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                         <span className="text-[10px] sm:text-xs font-bold font-mono text-primary">System.Alert</span>
                       </div>
                       <div className="flex items-center gap-2 sm:gap-3">
                         <Bug className="text-primary animate-pulse h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
                         <span className="font-mono-code text-xs sm:text-sm font-bold text-foreground break-all">{log.text}</span>
                       </div>
                    </div>
                  );
                } else if (log.type === 'box') {
                  content = (
                    <div className="bg-primary text-primary-foreground font-mono-code text-xs sm:text-sm font-bold p-1.5 sm:p-2 border border-black max-w-[90vw] break-all pointer-events-none drop-shadow-lg opacity-80">
                      [ERROR] {log.text}
                    </div>
                  );
                } else if (log.type === 'block') {
                  content = (
                     <div className="bg-foreground border border-primary/30 backdrop-blur-md pointer-events-none opacity-30" style={{ width: log.width, height: log.height }} />
                  );
                } else {
                  content = (
                    <div className="font-mono-code text-[10px] sm:text-sm md:text-base font-bold max-w-[90vw] break-all pointer-events-none text-primary">
                      {log.text}
                    </div>
                  );
                }
                
                return (
                  <div key={log.id} className="absolute z-10" style={{ top: log.top, left: log.left }}>
                    {content}
                  </div>
                );
              })}
              
              {/* Central Box */}
              <div 
                className={`relative z-50 flex flex-col items-center p-6 sm:p-8 bg-background/95 backdrop-blur-xl rounded-2xl border-2 border-primary w-[90vw] sm:w-[85vw] max-w-lg shadow-2xl transition-all duration-300 ${resolveProgress === 100 ? 'border-green-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (!isResolving) setIsResolving(true);
                }}
              >
                <div className="absolute -top-8 bg-background border-2 border-primary rounded-lg px-4 py-2">
                  <span className="font-display font-black text-2xl sm:text-3xl text-primary tracking-tight">&lt;SB /&gt;</span>
                </div>
                
                <h1 className={`font-mono-code text-lg sm:text-xl md:text-2xl font-bold tracking-widest uppercase text-center mt-6 ${resolveProgress === 100 ? 'text-green-500' : 'text-primary animate-pulse'}`}>
                  {resolveProgress === 100 ? "SYSTEM NOMINAL" : (isResolving ? "RESTORING PROTOCOLS..." : "SYSTEM CRASH DETECTED")}
                </h1>
                
                {isResolving ? (
                  <div className="mt-8 mb-4 relative w-full flex flex-col items-center">
                    <div className="font-mono-code text-xs sm:text-sm text-primary mb-3 text-center tracking-widest break-all">
                      [{resolveProgress === 100 ? "█".repeat(20) : "█".repeat(Math.floor(resolveProgress / 5))}{"░".repeat(20 - Math.floor(resolveProgress / 5))}]
                    </div>
                    <div className="font-mono-code text-[10px] sm:text-xs text-muted-foreground animate-pulse">
                      RESTORING CORE... {resolveProgress}%
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full bg-primary/5 border border-primary/20 p-3 sm:p-4 rounded-lg mt-6 mb-6 sm:mb-8 text-left">
                       <div className="flex items-center gap-2 mb-2 text-primary">
                         <Terminal size={16} />
                         <span className="font-mono text-sm font-semibold text-primary">Runtime Error Log</span>
                       </div>
                       <p className="font-mono text-xs text-muted-foreground opacity-80 h-16 overflow-hidden leading-relaxed">
                         [FATAL] Recursive loop anomaly.<br/>
                         [WARN] Client accessing internal origin.<br/>
                         [CRIT] Paradox detected: Portfolio in Portfolio.<br/>
                         Awaiting user manual override to restore.
                       </p>
                    </div>
                    <button className="text-primary-foreground font-mono-code text-[10px] sm:text-xs md:text-sm font-semibold border-2 border-primary px-3 sm:px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-all cursor-pointer text-center w-full shadow-lg">
                      CLICK ANYWHERE ON SCREEN TO RESTORE
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Proof</p>
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === cat
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`card-base card-hover p-6 flex flex-col group ${project.featured ? 'sm:col-span-1' : ''
                  }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono-code text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {project.category}
                      </span>
                    </div>
                    <a
                      href={project.live !== "#" ? project.live : project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (project.title === "Portfolio Website") {
                          e.preventDefault();
                          document.dispatchEvent(new CustomEvent('trigger-easter-egg'));
                        }
                      }}
                      className="font-display text-base font-semibold text-foreground hover:text-primary transition-colors duration-200 leading-snug cursor-pointer underline-offset-4 hover:underline"
                    >
                      {project.title}
                    </a>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 h-8 rounded-lg border border-border flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-200"
                      aria-label="Code"
                    >
                      <Github size={14} />
                      <span>Code</span>
                    </a>
                    {project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (project.title === "Portfolio Website") {
                            e.preventDefault();
                            document.dispatchEvent(new CustomEvent('trigger-easter-egg'));
                          }
                        }}
                        className="px-3 py-1.5 h-8 rounded-lg border border-border flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-200"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-secondary text-[11px] font-mono-code text-muted-foreground rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/swastik7781"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <Github size={15} />
            <span>More on GitHub</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

```

---
  
### 📄 Source Reference: `src/components/ScrollProgressBar.tsx`

> **Module Description:** This module contains the raw syntax for `ScrollProgressBar.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useScrollProgress } from '@/hooks/useScrollProgress';

const ScrollProgressBar = () => {
    const progress = useScrollProgress();

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none"
            aria-hidden="true"
        >
            <div
                className="h-full bg-primary transition-none"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ScrollProgressBar;

```

---
  
### 📄 Source Reference: `src/components/Skills.tsx`

![Skills Orbital Rotation System](./public/screenshots/skills-galaxy.jpg)

> **Module Description:** This module contains the raw syntax for `Skills.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories } from '@/lib/portfolio-data';

// Skill icon component — uses devicons CDN
const SkillIcon = ({ icon, name }: { icon: string; name: string }) => {
  const iconMap: Record<string, string> = {
    react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    spring: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
    c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    vscode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
    postman: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
    eclipse: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg',
    api: null,
  };

  const src = iconMap[icon];

  if (!src) {
    // Fallback: first 2 letters
    return (
      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
        <span className="font-mono-code text-[9px] font-bold text-primary uppercase">
          {name.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-6 h-6 object-contain"
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].name);
  const activeSkills = skillCategories.find(c => c.name === activeCategory)?.skills || [];

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 bg-secondary/20 relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Capability</p>
          <h2 className="section-title">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {skillCategories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeCategory === cat.name
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {activeSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="card-base card-hover p-4 flex flex-col items-center justify-center gap-3 group text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-card border border-border/50 group-hover:border-primary/40 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.15)] flex items-center justify-center transition-all duration-300">
                  <SkillIcon icon={skill.icon} name={skill.name} />
                </div>
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* All skills summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="font-mono-code text-xs text-muted-foreground tracking-widest uppercase mb-6 text-center sm:text-left">
            All Technologies
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
            {skillCategories.flatMap(cat => cat.skills).map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-card/40 border border-border/50 rounded-xl hover:border-primary/40 hover:bg-secondary/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="w-8 h-8 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                  <SkillIcon icon={skill.icon} name={skill.name} />
                </div>
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground font-mono-code transition-colors duration-300 text-center whitespace-nowrap">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

```

---
  
### 📄 Source Reference: `src/components/Testimonials.tsx`

![Carousel Drag Physics Matrix](./public/screenshots/carousel-physics.jpg)

> **Module Description:** This module contains the raw syntax for `Testimonials.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import { testimonials } from '@/lib/portfolio-data';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // swipe left (next)
    if (diff > 50) next();
    // swipe right (prev)
    if (diff < -50) prev();
    
    setTouchStart(null);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary/20 relative z-10">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-center"
        >
          <p className="section-label mx-auto w-fit">Testimonials</p>
          <h2 className="section-title">
            What People <span className="text-gradient">Say</span>
          </h2>
          <div className="section-divider mx-auto" />
        </motion.div>

        {/* Clean Single-Card Fade Carousel */}
        <div 
          className="relative min-h-[320px] md:min-h-[350px] flex items-center justify-center p-2"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  next();
                } else if (swipe > swipeConfidenceThreshold) {
                  prev();
                }
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%] cursor-grab active:cursor-grabbing"
            >
              <div className="card-base p-8 sm:p-12 text-center shadow-card-hover border-primary/10 bg-card">
                <Quote className="mx-auto text-primary/20 mb-6" size={36} />
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 italic max-w-2xl mx-auto">
                  "{testimonials[current].quote}"
                </p>
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-8">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary/50 flex items-center justify-center shadow-sm">
                    {testimonials[current].photo ? (
                      <img src={testimonials[current].photo} alt={testimonials[current].name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-muted-foreground font-mono-code text-xl">{testimonials[current].name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-foreground text-sm sm:text-base">{testimonials[current].name}</div>
                    <div className="font-mono-code text-xs text-muted-foreground mt-0.5">{testimonials[current].role}</div>
                    {testimonials[current].portfolio && (
                      <a
                        href={testimonials[current].portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-primary/20 transition-all duration-300"
                      >
                        View Portfolio <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-6 md:mt-10 relative z-20">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;


```

---
  
### 📄 Source Reference: `src/components/ui/accordion.tsx`

> **Module Description:** This module contains the raw syntax for `accordion.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

```

---
  
### 📄 Source Reference: `src/components/ui/alert-dialog.tsx`

> **Module Description:** This module contains the raw syntax for `alert-dialog.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

```

---
  
### 📄 Source Reference: `src/components/ui/alert.tsx`

> **Module Description:** This module contains the raw syntax for `alert.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

```

---
  
### 📄 Source Reference: `src/components/ui/aspect-ratio.tsx`

> **Module Description:** This module contains the raw syntax for `aspect-ratio.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };

```

---
  
### 📄 Source Reference: `src/components/ui/avatar.tsx`

> **Module Description:** This module contains the raw syntax for `avatar.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

```

---
  
### 📄 Source Reference: `src/components/ui/badge.tsx`

> **Module Description:** This module contains the raw syntax for `badge.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

```

---
  
### 📄 Source Reference: `src/components/ui/breadcrumb.tsx`

> **Module Description:** This module contains the raw syntax for `breadcrumb.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return <Comp ref={ref} className={cn("transition-colors hover:text-foreground", className)} {...props} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

```

---
  
### 📄 Source Reference: `src/components/ui/button.tsx`

> **Module Description:** This module contains the raw syntax for `button.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

```

---
  
### 📄 Source Reference: `src/components/ui/calendar.tsx`

> **Module Description:** This module contains the raw syntax for `calendar.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

```

---
  
### 📄 Source Reference: `src/components/ui/card.tsx`

> **Module Description:** This module contains the raw syntax for `card.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

```

---
  
### 📄 Source Reference: `src/components/ui/carousel.tsx`

> **Module Description:** This module contains the raw syntax for `carousel.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

```

---
  
### 📄 Source Reference: `src/components/ui/chart.tsx`

> **Module Description:** This module contains the raw syntax for `chart.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };

```

---
  
### 📄 Source Reference: `src/components/ui/checkbox.tsx`

> **Module Description:** This module contains the raw syntax for `checkbox.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

```

---
  
### 📄 Source Reference: `src/components/ui/collapsible.tsx`

> **Module Description:** This module contains the raw syntax for `collapsible.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

```

---
  
### 📄 Source Reference: `src/components/ui/command.tsx`

> **Module Description:** This module contains the raw syntax for `command.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

```

---
  
### 📄 Source Reference: `src/components/ui/context-menu.tsx`

> **Module Description:** This module contains the raw syntax for `context-menu.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};

```

---
  
### 📄 Source Reference: `src/components/ui/dialog.tsx`

> **Module Description:** This module contains the raw syntax for `dialog.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

```

---
  
### 📄 Source Reference: `src/components/ui/drawer.tsx`

> **Module Description:** This module contains the raw syntax for `drawer.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

```

---
  
### 📄 Source Reference: `src/components/ui/dropdown-menu.tsx`

> **Module Description:** This module contains the raw syntax for `dropdown-menu.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

```

---
  
### 📄 Source Reference: `src/components/ui/form.tsx`

> **Module Description:** This module contains the raw syntax for `form.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };

```

---
  
### 📄 Source Reference: `src/components/ui/hover-card.tsx`

> **Module Description:** This module contains the raw syntax for `hover-card.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };

```

---
  
### 📄 Source Reference: `src/components/ui/input-otp.tsx`

> **Module Description:** This module contains the raw syntax for `input-otp.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Dot />
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

```

---
  
### 📄 Source Reference: `src/components/ui/input.tsx`

> **Module Description:** This module contains the raw syntax for `input.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

```

---
  
### 📄 Source Reference: `src/components/ui/label.tsx`

> **Module Description:** This module contains the raw syntax for `label.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

```

---
  
### 📄 Source Reference: `src/components/ui/menubar.tsx`

> **Module Description:** This module contains the raw syntax for `menubar.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
MenubarShortcut.displayname = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};

```

---
  
### 📄 Source Reference: `src/components/ui/navigation-menu.tsx`

> **Module Description:** This module contains the raw syntax for `navigation-menu.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};

```

---
  
### 📄 Source Reference: `src/components/ui/pagination.tsx`

> **Module Description:** This module contains the raw syntax for `pagination.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

```

---
  
### 📄 Source Reference: `src/components/ui/popover.tsx`

> **Module Description:** This module contains the raw syntax for `popover.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

```

---
  
### 📄 Source Reference: `src/components/ui/progress.tsx`

> **Module Description:** This module contains the raw syntax for `progress.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

```

---
  
### 📄 Source Reference: `src/components/ui/radio-group.tsx`

> **Module Description:** This module contains the raw syntax for `radio-group.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

```

---
  
### 📄 Source Reference: `src/components/ui/resizable.tsx`

> **Module Description:** This module contains the raw syntax for `resizable.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

```

---
  
### 📄 Source Reference: `src/components/ui/scroll-area.tsx`

> **Module Description:** This module contains the raw syntax for `scroll-area.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };

```

---
  
### 📄 Source Reference: `src/components/ui/select.tsx`

> **Module Description:** This module contains the raw syntax for `select.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

```

---
  
### 📄 Source Reference: `src/components/ui/separator.tsx`

> **Module Description:** This module contains the raw syntax for `separator.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

```

---
  
### 📄 Source Reference: `src/components/ui/sheet.tsx`

> **Module Description:** This module contains the raw syntax for `sheet.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

```

---
  
### 📄 Source Reference: `src/components/ui/sidebar.tsx`

> **Module Description:** This module contains the raw syntax for `sidebar.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
      />
    );
  },
);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ ...props }, ref) => (
  <li ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

```

---
  
### 📄 Source Reference: `src/components/ui/skeleton.tsx`

> **Module Description:** This module contains the raw syntax for `skeleton.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };

```

---
  
### 📄 Source Reference: `src/components/ui/slider.tsx`

> **Module Description:** This module contains the raw syntax for `slider.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

```

---
  
### 📄 Source Reference: `src/components/ui/sonner.tsx`

> **Module Description:** This module contains the raw syntax for `sonner.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

```

---
  
### 📄 Source Reference: `src/components/ui/switch.tsx`

> **Module Description:** This module contains the raw syntax for `switch.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

```

---
  
### 📄 Source Reference: `src/components/ui/table.tsx`

> **Module Description:** This module contains the raw syntax for `table.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

```

---
  
### 📄 Source Reference: `src/components/ui/tabs.tsx`

> **Module Description:** This module contains the raw syntax for `tabs.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

```

---
  
### 📄 Source Reference: `src/components/ui/textarea.tsx`

> **Module Description:** This module contains the raw syntax for `textarea.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

```

---
  
### 📄 Source Reference: `src/components/ui/toast.tsx`

> **Module Description:** This module contains the raw syntax for `toast.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};

```

---
  
### 📄 Source Reference: `src/components/ui/toaster.tsx`

> **Module Description:** This module contains the raw syntax for `toaster.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

```

---
  
### 📄 Source Reference: `src/components/ui/toggle-group.tsx`

> **Module Description:** This module contains the raw syntax for `toggle-group.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

```

---
  
### 📄 Source Reference: `src/components/ui/toggle.tsx`

> **Module Description:** This module contains the raw syntax for `toggle.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };

```

---
  
### 📄 Source Reference: `src/components/ui/tooltip.tsx`

> **Module Description:** This module contains the raw syntax for `tooltip.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

```

---
  
### 📄 Source Reference: `src/components/ui/use-toast.ts`

> **Module Description:** This module contains the raw syntax for `use-toast.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };

```

---
  
### 📄 Source Reference: `src/components/VisitorNameModal.tsx`

> **Module Description:** This module contains the raw syntax for `VisitorNameModal.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VisitorNameModalProps {
    onSubmit: (name: string) => void;
}

const VisitorNameModal = ({ onSubmit }: VisitorNameModalProps) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(t);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter your name.');
            return;
        }
        if (trimmed.length > 40) {
            setError('Name must be under 40 characters.');
            return;
        }
        onSubmit(trimmed);
    };

    const handleSkip = () => onSubmit('');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6"
            style={{ background: 'hsl(var(--background) / 0.85)', backdropFilter: 'blur(8px)' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-elevated"
            >
                {/* Header */}
                <div className="mb-6">
                    <p className="font-mono-code text-xs text-primary tracking-widest uppercase mb-3">
                        Welcome
                    </p>
                    <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
                        What should I call you?
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        I'll use your name to personalize your visit.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(''); }}
                            placeholder="Your name"
                            maxLength={40}
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground
                         placeholder:text-muted-foreground text-sm font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                         transition-all duration-200"
                            autoComplete="given-name"
                        />
                        {error && (
                            <p className="text-xs text-destructive mt-1.5 font-mono-code">{error}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground
                         font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                        >
                            Continue
                        </button>
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground
                         font-medium text-sm transition-all duration-200 hover:text-foreground hover:bg-secondary active:scale-95"
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default VisitorNameModal;

```

---
  
### 📄 Source Reference: `src/hooks/use-mobile.tsx`

> **Module Description:** This module contains the raw syntax for `use-mobile.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

```

---
  
### 📄 Source Reference: `src/hooks/use-toast.ts`

> **Module Description:** This module contains the raw syntax for `use-toast.ts`. It is rigorously typed and heavily documented internally.

```typescript
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };

```

---
  
### 📄 Source Reference: `src/hooks/useCommandPalette.ts`

> **Module Description:** This module contains the raw syntax for `useCommandPalette.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
            if (e.key === 'Escape') {
                close();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [toggle, close]);

    return { isOpen, open, close, toggle };
}

```

---
  
### 📄 Source Reference: `src/hooks/useEasterEggs.ts`

> **Module Description:** This module contains the raw syntax for `useEasterEggs.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useEffect, useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useEasterEggs() {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const logoClickCount = useRef(0);
  const logoTimer = useRef<NodeJS.Timeout>();
  const konamiBuffer = useRef<string[]>([]);

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const handleLogoClick = useCallback(() => {
    logoClickCount.current += 1;
    clearTimeout(logoTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      toast({
        title: "🎮 Secret Unlocked!",
        description: "You found a hidden easter egg! You're a curious dev. I like that.",
      });
    }
    logoTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
  }, [toast]);

  useEffect(() => {
    const handleKonami = (e: KeyboardEvent) => {
      konamiBuffer.current.push(e.key);
      if (konamiBuffer.current.length > KONAMI.length) {
        konamiBuffer.current.shift();
      }
      if (konamiBuffer.current.join(',') === KONAMI.join(',')) {
        konamiBuffer.current = [];
        toast({
          title: "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️",
          description: "Konami Code activated! You're a true gamer-developer. 🕹️",
        });
        triggerConfetti();
      }
    };
    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [toast, triggerConfetti]);

  return { handleLogoClick, triggerConfetti, showConfetti };
}

```

---
  
### 📄 Source Reference: `src/hooks/useReducedMotion.ts`

> **Module Description:** This module contains the raw syntax for `useReducedMotion.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
    const [reducedMotion, setReducedMotion] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return reducedMotion;
}

```

---
  
### 📄 Source Reference: `src/hooks/useScrollProgress.ts`

> **Module Description:** This module contains the raw syntax for `useScrollProgress.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect } from 'react';

export function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, pct)));
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return progress;
}

```

---
  
### 📄 Source Reference: `src/hooks/useTheme.ts`

> **Module Description:** This module contains the raw syntax for `useTheme.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = useCallback((t: 'dark' | 'light') => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(prev => prev === 'dark' ? 'light' : 'dark'), []);

  return { theme, setTheme, toggleTheme };
}

```

---
  
### 📄 Source Reference: `src/hooks/useVisitorName.ts`

> **Module Description:** This module contains the raw syntax for `useVisitorName.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useCallback } from 'react';

export function useVisitorName() {
    const [visitorName, setVisitorNameState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('visitor_name') || '';
        }
        return '';
    });

    const hasName = visitorName.trim().length > 0;

    const setVisitorName = useCallback((name: string) => {
        const trimmed = name.trim();
        setVisitorNameState(trimmed);
        if (typeof window !== 'undefined') {
            if (trimmed) {
                localStorage.setItem('visitor_name', trimmed);
            } else {
                localStorage.removeItem('visitor_name');
            }
        }
    }, []);

    const clearName = useCallback(() => {
        setVisitorNameState('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('visitor_name');
        }
    }, []);

    return { visitorName, setVisitorName, clearName, hasName };
}

```

---
  
### 📄 Source Reference: `src/index.css`

> **Module Description:** This module contains the raw syntax for `index.css`. It is rigorously typed and heavily documented internally.

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Premium light theme — warm, clean, high contrast */
    --background: 0 0% 98%;
    --foreground: 220 25% 10%;
    --card: 0 0% 100%;
    --card-foreground: 220 25% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 25% 10%;
    --primary: 217 85% 48%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 14% 93%;
    --secondary-foreground: 220 25% 10%;
    --muted: 220 14% 93%;
    --muted-foreground: 220 12% 42%;
    --accent: 245 58% 52%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 86%;
    --input: 220 13% 86%;
    --ring: 217 85% 48%;
    --radius: 0.625rem;
    --terminal: 220 14% 96%;
    --terminal-foreground: 142 76% 36%;
    --terminal-accent: 217 85% 48%;
    --glow: 217 85% 48%;
    --surface: 220 20% 96%;
    --surface-elevated: 0 0% 100%;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 220 25% 10%;
    --sidebar-primary: 217 85% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 14% 93%;
    --sidebar-accent-foreground: 220 25% 10%;
    --sidebar-border: 220 13% 86%;
    --sidebar-ring: 217 85% 48%;
  }

  .dark {
    /* Deep charcoal system */
    --background: 222 18% 7%;
    --foreground: 210 16% 90%;
    --card: 222 16% 10%;
    --card-foreground: 210 16% 90%;
    --popover: 222 16% 10%;
    --popover-foreground: 210 16% 90%;
    --primary: 217 91% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 222 14% 14%;
    --secondary-foreground: 210 16% 90%;
    --muted: 222 14% 14%;
    --muted-foreground: 220 10% 52%;
    --accent: 245 55% 62%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62% 42%;
    --destructive-foreground: 210 40% 98%;
    --border: 222 14% 16%;
    --input: 222 14% 16%;
    --ring: 217 91% 58%;
    --terminal: 222 25% 5%;
    --terminal-foreground: 142 71% 65%;
    --terminal-accent: 217 91% 65%;
    --glow: 217 91% 58%;
    --surface: 222 16% 10%;
    --surface-elevated: 222 14% 13%;

    --sidebar-background: 222 18% 8%;
    --sidebar-foreground: 210 16% 90%;
    --sidebar-primary: 217 91% 58%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 222 14% 14%;
    --sidebar-accent-foreground: 210 16% 90%;
    --sidebar-border: 222 14% 16%;
    --sidebar-ring: 217 91% 58%;
  }
}

@layer base {
  * {
    @apply border-border;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-size: 16px;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
    line-height: 1.65;
    overflow-x: hidden;
    font-size: 1rem;
  }

  ::selection {
    background: hsl(var(--primary) / 0.2);
    color: hsl(var(--foreground));
  }

  :focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: hsl(var(--background));
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
  }
}

@layer utilities {

  /* Typography */
  .font-mono-code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  .font-display {
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: -0.02em;
  }

  .font-body {
    font-family: 'Inter', 'Space Grotesk', sans-serif;
  }

  /* Text gradient — used sparingly */
  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  }

  /* Elevation shadows — no glow, real depth */
  .shadow-card {
    box-shadow:
      0 1px 3px hsl(0 0% 0% / 0.06),
      0 4px 12px hsl(0 0% 0% / 0.08);
  }

  .shadow-card-hover {
    box-shadow:
      0 2px 8px hsl(0 0% 0% / 0.08),
      0 8px 24px hsl(0 0% 0% / 0.12);
  }

  .shadow-elevated {
    box-shadow:
      0 4px 16px hsl(0 0% 0% / 0.1),
      0 16px 40px hsl(0 0% 0% / 0.14);
  }

  /* Glow — only on active/focus/hover, never permanent */
  .glow-sm {
    box-shadow: 0 0 0 1px hsl(var(--primary) / 0.15), 0 0 20px -4px hsl(var(--glow) / 0.25);
  }

  .glow-md {
    box-shadow: 0 0 0 1px hsl(var(--primary) / 0.2), 0 0 32px -6px hsl(var(--glow) / 0.3);
  }

  /* Grid background */
  .grid-bg {
    background-image:
      linear-gradient(hsl(var(--border) / 0.4) 1px, transparent 1px),
      linear-gradient(90deg, hsl(var(--border) / 0.4) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Dot background */
  .dot-bg {
    background-image: radial-gradient(circle, hsl(var(--border) / 0.6) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  /* Section spacing */
  .section-padding {
    @apply py-24 px-6;
  }

  .section-container {
    @apply max-w-5xl mx-auto;
  }

  /* Faster Earthquake / Error Shake Animation */
  @keyframes glitch-shake {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    10% { transform: translate(-3px, 3px) rotate(-1.5deg); }
    20% { transform: translate(3px, -3px) rotate(1.5deg); }
    30% { transform: translate(-3px, -3px) rotate(-1.5deg); }
    40% { transform: translate(3px, 3px) rotate(1.5deg); }
    50% { transform: translate(-4px, 0) rotate(0deg); }
    60% { transform: translate(4px, 0) rotate(0deg); }
    70% { transform: translate(0, -4px) rotate(0deg); }
    80% { transform: translate(0, 4px) rotate(0deg); }
    90% { transform: translate(-3px, 3px) rotate(-1.5deg); }
  }

  body.is-glitch-shaking .glitch-target {
    animation: glitch-shake 0.15s cubic-bezier(.36,.07,.19,.97) infinite;
    filter: contrast(120%) saturate(120%);
    transform-origin: center center;
  }

  /* Section heading — larger, more presence */
  .section-label {
    @apply font-mono-code text-xs text-primary tracking-widest uppercase mb-3;
  }

  .section-title {
    @apply font-display text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight;
  }

  .section-divider {
    @apply w-10 h-0.5 bg-primary rounded-full mb-10;
  }

  /* Card base */
  .card-base {
    @apply bg-card border border-border rounded-xl shadow-card transition-all duration-300;
  }

  .card-hover {
    @apply hover:shadow-card-hover hover:-translate-y-0.5;
  }

  /* Button variants */
  .btn-primary {
    @apply px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95;
  }

  .btn-secondary {
    @apply px-6 py-2.5 rounded-lg border border-border text-foreground font-semibold text-sm bg-transparent transition-all duration-200 hover:bg-secondary active:scale-95;
  }

  .btn-ghost {
    @apply px-4 py-2 rounded-lg text-muted-foreground font-medium text-sm transition-all duration-200 hover:text-foreground hover:bg-secondary active:scale-95;
  }

  /* Skill bar */
  .skill-bar-track {
    @apply w-full h-1.5 bg-secondary rounded-full overflow-hidden;
  }

  .skill-bar-fill {
    @apply h-full bg-primary rounded-full;
  }

  /* Timeline */
  .timeline-line {
    @apply absolute left-4 top-0 bottom-0 w-px bg-border;
  }

  .timeline-dot {
    @apply absolute left-4 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background -translate-x-1/2 mt-1.5 z-10;
  }

  /* Light mode — ensure good contrast on cards and sections */
  :root .card-base {
    box-shadow: 0 1px 3px hsl(0 0% 0% / 0.05), 0 4px 12px hsl(0 0% 0% / 0.06);
  }

  :root .card-hover:hover {
    box-shadow: 0 2px 8px hsl(0 0% 0% / 0.07), 0 8px 24px hsl(0 0% 0% / 0.09);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Custom cursor — desktop only */
  @media (pointer: fine) {
    .cursor-none-desktop {
      cursor: none;
    }
  }
}
```

---
  
### 📄 Source Reference: `src/lib/portfolio-data.ts`

> **Module Description:** This module contains the raw syntax for `portfolio-data.ts`. It is rigorously typed and heavily documented internally.

```typescript
export const personalInfo = {
  name: "Swastik Bhardwaj",
  title: "Full Stack Developer",
  tagline: "Full Stack Developer building structured digital systems.",
  taglines: ["Full-Stack Developer", "MERN Stack", "Spring Boot", "Problem Solver"],
  bio: "I build production-ready web applications with clean architecture and intentional design. I care about performance, scalability, and writing code that other engineers actually enjoy reading. Currently pursuing B.Tech in Computer Science (6th Semester) at Silicon University with a CGPA of 9.31.",
  philosophy: "I believe great software is the result of clear thinking, not clever tricks. I write systems that are easy to understand, easy to extend, and hard to break.",
  github: "https://github.com/swastik7781",
  linkedin: "https://www.linkedin.com/in/swastik-bhardwaj-02963937a/",
  email: "swastikbhardwaj457@gmail.com",
  resumeUrl: "/resume.pdf",
  profilePic: "/profile.jpg",
  location: "Bhubaneswar, India",
};

export const stats = [
  { label: "CGPA", value: "9.31" },
  { label: "Lines of Code", value: "40K+" },
  { label: "Projects Built", value: "6+" },
  { label: "Learning Spirit", value: "∞" },
];

export const achievements = [
  "Maintained 9.31 CGPA throughout B.Tech in Computer Science at Silicon University",
  "Built and deployed a full Campus ERP system as major academic project",
  "Completed MERN Stack internship at CodeBeat with production deployments",
  "Scored 90% in Joy of Computing with Python (NPTEL Certification)",
];

export const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "React", proficiency: 90, icon: "react" },
      { name: "Angular", proficiency: 75, icon: "angular" },
      { name: "HTML5", proficiency: 95, icon: "html5" },
      { name: "CSS3", proficiency: 92, icon: "css3" },
      { name: "JavaScript", proficiency: 90, icon: "javascript" },
      { name: "TypeScript", proficiency: 80, icon: "typescript" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", proficiency: 85, icon: "nodejs" },
      { name: "Express.js", proficiency: 85, icon: "express" },
      { name: "Spring Boot", proficiency: 70, icon: "spring" },
      { name: "REST APIs", proficiency: 90, icon: "api" },
    ],
  },
  {
    name: "Languages",
    skills: [
      { name: "C", proficiency: 80, icon: "c" },
      { name: "JavaScript", proficiency: 90, icon: "javascript" },
      { name: "Python", proficiency: 75, icon: "python" },
      { name: "Java", proficiency: 80, icon: "java" },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "MongoDB", proficiency: 85, icon: "mongodb" },
      { name: "PostgreSQL", proficiency: 75, icon: "postgresql" },
      { name: "MySQL", proficiency: 80, icon: "mysql" },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", proficiency: 90, icon: "git" },
      { name: "GitHub", proficiency: 90, icon: "github" },
      { name: "VS Code", proficiency: 95, icon: "vscode" },
      { name: "Postman", proficiency: 85, icon: "postman" },
      { name: "Eclipse IDE", proficiency: 80, icon: "eclipse" },
    ],
  },
];

export type ProjectCategory = "All" | "Full Stack" | "Machine Learning" | "Frontend";

export const projects = [
  {
    title: "Portfolio Website",
    description: "This very portfolio — engineered with React, TypeScript, Framer Motion, and Tailwind CSS. Features a command palette, visitor personalization, custom cursor, easter eggs, and a production-grade contact system.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
    category: "Frontend" as ProjectCategory,
    github: "https://github.com/swastik7781/portfolio-professional.git",
    live: "https://swastikbhardwaj.vercel.app",
    featured: true,
  },
  {
    title: "Campus Management System (ERP)",
    description: "A comprehensive ERP solution for managing campus operations — student records, attendance, grades, and administrative workflows — with role-based access control and a clean dashboard interface.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/Campus-Management-System/ERP-System.git",
    live: "#",
    featured: true,
  },
  {
    title: "CR Election System",
    description: "Full-stack voting platform with real-time result tracking, secure authentication, and a live vote-counting dashboard for class representative elections.",
    tech: ["HTML", "CSS", "Java Servlet (JSP)", "Apache Tomcat"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/cr_election.git",
    live: "https://cr-election-xsfa.vercel.app/",
    featured: true,
  },
  {
    title: "Employee Management System",
    description: "Enterprise-grade employee management with JWT authentication, full CRUD operations, role-based dashboards, and a clean RESTful API architecture.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/Employee-Management-System.git",
    live: "#",
    featured: false,
  },
  {
    title: "Library Management System",
    description: "Clean, functional library management interface for tracking books, members, and borrowing records — with search, filter, and overdue tracking capabilities.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "Full Stack" as ProjectCategory,
    github: "https://github.com/swastik7781/Library-Management-System.git",
    live: "https://silicon-library-management-system.vercel.app",
    featured: false,
  },
  {
    title: "Dynamic Retail Demand Forecasting",
    description: "Advanced machine learning pipeline using Random Forest and Decision Trees to predict retail sales and classify holiday impacts with 91% R² and 86% accuracy.",
    tech: ["Python", "NumPy", "Pandas", "Seaborn", "Matplotlib"],
    category: "Machine Learning" as ProjectCategory,
    github: "https://github.com/Dynamic-Retail-Demand-Forecasting-ML/Dynamic-Retail-Demand-Forecasting.git",
    live: "https://bigdaddyproject.vercel.app",
    featured: true,
  },
  {
    title: "NewsFlow - News WebApp",
    description: "A responsive News Website Dashboard simulating a real-world platform for exploring categorized news content effortlessly.",
    tech: ["React", "React Router", "Tailwind CSS"],
    category: "Frontend" as ProjectCategory,
    github: "https://github.com/swastik7781/News-Web-App",
    live: "https://swastiknews.vercel.app/",
    featured: false,
  },
];

// Timeline items for About section — chronological order
export const timelineItems = [
  {
    type: "education",
    date: "2020-21",
    title: "10th from K.V. No.1 BBSR",
    subtitle: "AISSE — 96.00%",
    description: "Completed schooling at Kendriya Vidyalaya No.1 Bhubaneswar with 96% in AISSE (CBSE Board).",
  },
  {
    type: "education",
    date: "2022-23",
    title: "12th from K.V. No.1 BBSR",
    subtitle: "AISSCE — 91.00%",
    description: "Completed higher secondary at Kendriya Vidyalaya No.1 Bhubaneswar with 91% in AISSCE (CBSE Board).",
  },
  {
    type: "education",
    date: "2023 – Present",
    title: "B.Tech in Computer Science & Engineering",
    subtitle: "Silicon University · CGPA: 9.31 · 6th Semester",
    description: "Pursuing a rigorous CSE curriculum with a focus on data structures, algorithms, and software engineering. Currently in 6th semester (3rd year).",
  },
  {
    type: "work",
    date: "Jun – Jul 2024",
    title: "MERN Stack Developer Intern",
    subtitle: "CodeBeat",
    description: "Built production features, developed RESTful APIs, and implemented authentication systems on client projects using the MERN stack.",
  },
  {
    type: "work",
    date: "Jun – Jul 2025",
    title: "Spring Boot & Angular Training",
    subtitle: "Enterprise Development",
    description: "Intensive enterprise Java training — layered architecture, dependency injection, and reactive Angular frontends.",
  },
  {
    type: "project",
    date: "2025",
    title: "Major Project — Campus ERP",
    subtitle: "Academic (B.Tech CSE)",
    description: "Led full-stack development of a Campus Management ERP as the major academic project. Handled architecture design, database modeling, API development, and deployment.",
  },
  {
    type: "work",
    date: "Jan 13, 2026 – Apr 20, 2026",
    title: "AI Powered AR/VR aided Computer Vision Builder",
    subtitle: "IIT Delhi Program",
    description: "Enrolled in an advanced course focused on building AI-powered AR/VR applications with computer vision integration, exploring cutting-edge technologies in augmented and virtual environments.",
  },
];

export const experiences = [
  {
    role: "AI Powered AR/VR aided Computer Vision Builder",
    company: "IIT Delhi Program",
    date: "Jan 13, 2026 – Apr 20, 2026",
    description: "Enrolled in an advanced course focused on building AI-powered AR/VR applications with computer vision integration, exploring cutting-edge technologies in augmented and virtual environments.",
    tech: ["AI", "AR/VR", "Computer Vision"],
  },
  {
    role: "Major Project — Campus ERP",
    company: "Academic (B.Tech CSE)",
    date: "2025",
    description: "Led full-stack development of a Campus Management ERP as the major academic project. Handled architecture design, database modeling, API development, and deployment.",
    tech: ["React", "Node.js", "MongoDB", "Express.js"],
  },
  {
    role: "Spring Boot & Angular Training",
    company: "Enterprise Development",
    date: "Jun – Jul 2025",
    description: "Intensive enterprise Java development training with Spring Boot and Angular. Built full-stack enterprise applications with layered architecture, dependency injection, and reactive frontend patterns.",
    tech: ["Spring Boot", "Angular", "Java", "TypeScript"],
  },
  {
    role: "MERN Stack Developer Intern",
    company: "CodeBeat",
    date: "Jun – Jul 2024",
    description: "Built production features using the MERN stack. Developed RESTful APIs, implemented JWT authentication systems, and collaborated with senior developers on client-facing projects.",
    tech: ["MongoDB", "Express.js", "React", "Node.js"],
  },
];

export const testimonials = [
  {
    name: "Auroshikha Tripathy",
    role: "Ex-Senior Developer at Owision",
    company: "",
    quote: "Swastik has an incredible ability to break down complex problems into clean, elegant solutions. His dedication to writing maintainable code and his eye for design make him stand out as a developer.",
    rating: 5,
    photo: "/photos/auroshikha.png",
    portfolio: "https://auroshikhatripathyportfolio.vercel.app/",
  },
  {
    name: "T. Sribatsa Patro",
    role: "Ex Developer at Rumango pvt ltd",
    company: "",
    quote: "Swastik demonstrates exceptional problem-solving skills and a strong understanding of full-stack development. His ability to architect clean solutions and deliver production-ready code is impressive for his experience level.",
    rating: 5,
    photo: "/photos/sribatsa.png",
    portfolio: "https://sribatsa.vercel.app/",
  },
  {
    name: "Abhijeet Dash",
    role: "Intern at IIT Ropar",
    company: "",
    quote: "Working with Swastik was a great experience. He brings both technical depth and a collaborative mindset to every project. His code quality and attention to detail consistently exceeded expectations.",
    rating: 5,
    photo: "/photos/abhijeet.jpg",
    portfolio: "https://abhijeet-dash.vercel.app/",
  },
  {
    name: "Khushi Tiwari",
    role: "Developer at Penthara Technologies",
    company: "",
    quote: "Swastik is an extraordinarily talented developer. His focus on creating structured, scalable, and beautifully designed digital systems makes him a standout engineer. He constantly delivers above and beyond requirements.",
    rating: 5,
    photo: "/photos/khushi.jpeg",
  },
];

export const certifications = [
  {
    title: "MERN Stack Development",
    issuer: "CodeBeat",
    year: "2024",
    file: "/certificates/mern.pdf"
  },
  {
    title: "Spring Boot & Angular Training",
    issuer: "Enterprise Program",
    year: "2025",
    file: "/certificates/springboot.pdf"
  },
  {
    title: "Joy of Computing with Python",
    issuer: "NPTEL",
    year: "2024",
    score: "90%",
    file: "/certificates/nptel-python.pdf"
  },
];

```

---
  
### 📄 Source Reference: `src/lib/utils.ts`

> **Module Description:** This module contains the raw syntax for `utils.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---
  
### 📄 Source Reference: `src/main.tsx`

> **Module Description:** This module contains the raw syntax for `main.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

```

---
  
### 📄 Source Reference: `src/pages/Index.tsx`

> **Module Description:** This module contains the raw syntax for `Index.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import DevConsole from '@/components/DevConsole';
import Confetti from '@/components/Confetti';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import CommandPalette from '@/components/CommandPalette';
import VisitorNameModal from '@/components/VisitorNameModal';
import { useTheme } from '@/hooks/useTheme';
import { useEasterEggs } from '@/hooks/useEasterEggs';
import { useVisitorName } from '@/hooks/useVisitorName';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { AnimatePresence } from 'framer-motion';

const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

const Index = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { handleLogoClick, triggerConfetti, showConfetti } = useEasterEggs();
  const { visitorName, setVisitorName, hasName } = useVisitorName();
  const { isOpen: paletteOpen, open: openPalette, close: closePalette } = useCommandPalette();

  const [consoleOpen, setConsoleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Show name modal on first visit (after loading)
  useEffect(() => {
    if (!loading && !hasName) {
      const t = setTimeout(() => setShowNameModal(true), 400);
      return () => clearTimeout(t);
    }
  }, [loading, hasName]);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [loading]);

  // Ctrl + ` shortcut for console
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setConsoleOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNameSubmit = useCallback((name: string) => {
    setVisitorName(name);
    setShowNameModal(false);
  }, [setVisitorName]);

  const handleChangeName = useCallback(() => {
    setShowNameModal(true);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${
      // Apply cursor-none on desktop when custom cursor is active
      typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
        ? 'cursor-none-desktop'
        : ''
      }`}>
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Visitor name modal */}
      <AnimatePresence>
        {showNameModal && (
          <VisitorNameModal onSubmit={handleNameSubmit} />
        )}
      </AnimatePresence>

      {/* Command palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={closePalette}
        onThemeChange={setTheme}
        currentTheme={theme}
        onChangeName={handleChangeName}
      />

      {/* Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenConsole={() => setConsoleOpen(true)}
        onOpenPalette={openPalette}
        activeSection={activeSection}
      />

      <main className="glitch-target">
        <Hero
          onOpenConsole={() => setConsoleOpen(true)}
          onLogoClick={handleLogoClick}
          visitorName={visitorName}
        />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Testimonials />
        <Contact visitorName={visitorName} />
      </main>

      <div className="glitch-target">
        <Footer />
      </div>

      {/* Dev Console */}
      <DevConsole
        isOpen={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onThemeChange={setTheme}
        onEasterEgg={triggerConfetti}
      />

      {/* Confetti easter egg */}
      <Confetti show={showConfetti} />
    </div>
  );
};

export default Index;

```

---
  
### 📄 Source Reference: `src/pages/NotFound.tsx`

> **Module Description:** This module contains the raw syntax for `NotFound.tsx`. It is rigorously typed and heavily documented internally.

```typescript
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-sm"
      >
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-8xl font-bold text-foreground/10 mb-6 select-none"
        >
          404
        </motion.div>

        <div className="w-10 h-px bg-primary mx-auto mb-6" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-mono-code text-xs text-primary tracking-widest uppercase mb-3">
            Page not found
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3 tracking-tight">
            This route doesn't exist.
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            The page you're looking for has been moved, deleted, or never existed.
            Let's get you back on track.
          </p>

          <div className="flex items-center justify-center gap-3">
            <a
              href="/"
              className="btn-primary flex items-center gap-2"
            >
              <Home size={14} />
              Back to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Subtle decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono-code text-[11px] text-muted-foreground/40 mt-12"
        >
          {location.pathname}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;

```

---
  
### 📄 Source Reference: `src/test/example.test.ts`

> **Module Description:** This module contains the raw syntax for `example.test.ts`. It is rigorously typed and heavily documented internally.

```typescript
import { describe, it, expect } from "vitest";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

```

---
  
### 📄 Source Reference: `src/test/setup.ts`

> **Module Description:** This module contains the raw syntax for `setup.ts`. It is rigorously typed and heavily documented internally.

```typescript
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

```

---
  
### 📄 Source Reference: `src/vite-env.d.ts`

> **Module Description:** This module contains the raw syntax for `vite-env.d.ts`. It is rigorously typed and heavily documented internally.

```typescript
/// <reference types="vite/client" />

```

---
  
<!-- DOCUMENTATION CHECKSUM -->
<!-- Total Embedded Lines: 9367 -->
<!-- Total Embedded Words: 31184 -->
<!-- End of Handbook -->
