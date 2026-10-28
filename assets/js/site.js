(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 星空粒子 ---------- */

  const field = document.querySelector("[data-starfield]");

  if (field) {
    const random = (() => {
      let state = 20261029;
      return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();

    const eases = ["ease-in-out", "ease-out", "ease-in", "cubic-bezier(0.4, 0, 0.6, 1)"];
    const drift = (maxAmplitude) => ({
      dx: (random() * 2 - 1) * (1.5 + random() * maxAmplitude),
      dy: (random() * 2 - 1) * (1.5 + random() * maxAmplitude),
      driftDuration: 32 + random() * 48,
      driftDelay: -random() * 80
    });

    const setVars = (el, values) => {
      for (const [key, value] of Object.entries(values)) {
        el.style.setProperty(key, value);
      }
    };

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 32; i += 1) {
      const size = 7 + random() * 15;
      const scale = 1 - (size - 7) / 22;
      const peak = (0.3 + random() * 0.3) * (0.55 + scale * 0.45);
      const star = document.createElement("span");
      star.className = "star star--point";
      setVars(star, {
        "--x": `${(random() * 100).toFixed(2)}%`,
        "--y": `${(random() * 100).toFixed(2)}%`,
        "--size": `${size.toFixed(2)}px`,
        "--dur": `${(6 + random() * 12).toFixed(2)}s`,
        "--delay": `${(-random() * 18).toFixed(2)}s`,
        "--peak": peak.toFixed(3),
        "--floor": (peak * (0.32 + random() * 0.2)).toFixed(3),
        "--ease": eases[Math.floor(random() * eases.length)],
        ...Object.fromEntries(Object.entries(drift(6)).map(([key, value]) => [
          `--${key === "driftDuration" ? "ddur" : key === "driftDelay" ? "ddelay" : key}`,
          `${value.toFixed(2)}${key.startsWith("drift") ? "s" : "vmin"}`
        ]))
      });
      fragment.appendChild(star);
    }

    for (let i = 0; i < 38; i += 1) {
      const peak = 0.18 + random() * 0.24;
      const dust = document.createElement("span");
      dust.className = "star star--dust";
      setVars(dust, {
        "--x": `${(random() * 100).toFixed(2)}%`,
        "--y": `${(random() * 100).toFixed(2)}%`,
        "--size": `${(1.2 + random() * 2.4).toFixed(2)}px`,
        "--dur": `${(10 + random() * 14).toFixed(2)}s`,
        "--delay": `${(-random() * 24).toFixed(2)}s`,
        "--peak": peak.toFixed(3),
        "--floor": (peak * (0.35 + random() * 0.25)).toFixed(3),
        "--ease": eases[Math.floor(random() * eases.length)],
        ...Object.fromEntries(Object.entries(drift(4.5)).map(([key, value]) => [
          `--${key === "driftDuration" ? "ddur" : key === "driftDelay" ? "ddelay" : key}`,
          `${value.toFixed(2)}${key.startsWith("drift") ? "s" : "vmin"}`
        ]))
      });
      fragment.appendChild(dust);
    }

    const shootingStars = [
      { x: 8, y: 16, len: 16, angle: 24, shootX: 34, shootY: 15, duration: 19, delay: 3 },
      { x: 62, y: 8, len: 12, angle: 28, shootX: 26, shootY: 14, duration: 27, delay: 13 }
    ];

    for (const shot of shootingStars) {
      const el = document.createElement("span");
      el.className = "shooting-star";
      setVars(el, {
        "--x": `${shot.x}vw`,
        "--y": `${shot.y}vh`,
        "--len": `${shot.len}vw`,
        "--angle": `${shot.angle}deg`,
        "--shoot-x": `${shot.shootX}vw`,
        "--shoot-y": `${shot.shootY}vh`,
        "--shoot-dur": `${shot.duration}s`,
        "--shoot-delay": `${shot.delay}s`
      });
      fragment.appendChild(el);
    }

    field.appendChild(fragment);
  }

  /* ---------- 导航状态 ---------- */

  const nav = document.querySelector("[data-site-nav]");

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 移动端菜单 ---------- */

  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-menu-panel]");

  if (toggle && panel) {
    let lastFocused = null;

    const focusables = () =>
      Array.from(panel.querySelectorAll("a[href], button:not([disabled])")).filter(
        (el) => el.offsetParent !== null
      );

    const setOpen = (open) => {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      document.documentElement.style.overflow = open ? "hidden" : "";

      if (open) {
        lastFocused = document.activeElement;
        requestAnimationFrame(() => {
          panel.classList.add("is-open");
          focusables()[0]?.focus();
        });
      } else {
        panel.classList.remove("is-open");
        if (lastFocused instanceof HTMLElement) lastFocused.focus();
      }
    };

    toggle.addEventListener("click", () => {
      setOpen(panel.hasAttribute("hidden"));
    });

    const closeButton = panel.querySelector("[data-menu-close]");
    closeButton?.addEventListener("click", () => setOpen(false));

    document.addEventListener("keydown", (event) => {
      if (panel.hidden) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    panel.addEventListener("click", (event) => {
      if (event.target.closest("a[href]")) setOpen(false);
    });

    const desktop = window.matchMedia("(min-width: 768px)");
    desktop.addEventListener("change", (event) => {
      if (event.matches && !panel.hidden) setOpen(false);
    });
  }

  /* ---------- 首屏文字扫光 ---------- */

  const hero = document.querySelector("[data-hero]");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && finePointer && !reduceMotion) {
    const targets = Array.from(hero.querySelectorAll("[data-spotlight]"));
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${x - rect.left}px`);
        el.style.setProperty("--my", `${y - rect.top}px`);
      }
    };

    const reset = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      for (const el of targets) {
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
      }
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        x = event.clientX;
        y = event.clientY;
        if (!frame) frame = requestAnimationFrame(paint);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", reset);
  }
})();
