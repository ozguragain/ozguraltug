"use client";

import { useEffect, useRef } from "react";

const CHARS = " .:-=+*#%@";

function makeAscii(cols: number, rows: number, time: number) {
  let output = "";

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const wave =
        Math.sin(x * 0.34 + time * 1.15) +
        Math.sin(y * 0.28 + time * 1.45) +
        Math.sin((x + y) * 0.16 + time * 0.8);

      const normalized = (wave + 3) / 6;
      const index = Math.min(
        CHARS.length - 1,
        Math.max(0, Math.floor(normalized * CHARS.length))
      );

      output += CHARS[index];
    }

    output += "\n";
  }

  return output;
}

export function CursorGlow() {
  const asciiRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const element = asciiRef.current;
    if (!element) {
      return;
    }

    const supportsMask =
      typeof window.CSS !== "undefined" &&
      (window.CSS.supports("mask-image", "radial-gradient(black, transparent)") ||
        window.CSS.supports("-webkit-mask-image", "radial-gradient(black, transparent)"));
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!supportsMask || !finePointer.matches || reducedMotion.matches) {
      element.style.display = "none";
      return;
    }

    let hideTimer = 0;
    let animationFrame = 0;
    let isVisible = false;
    let lastMeasure = 0;
    let lastPointerTimestamp = 0;

    const current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    const target = {
      x: current.x,
      y: current.y
    };

    const updateField = (x: number, y: number, radius = 16) => {
      element.style.setProperty("--ascii-x", `${x}px`);
      element.style.setProperty("--ascii-y", `${y}px`);
      element.style.setProperty("--ascii-radius", `${radius}rem`);
    };

    const measure = (time: number) => {
      const computed = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(computed.fontSize || "14");
      const lineHeight = Number.parseFloat(computed.lineHeight || `${fontSize * 1.2}`);
      const charWidth = fontSize * 0.62;
      const columns = Math.ceil(window.innerWidth / charWidth) + 2;
      const rows = Math.ceil(window.innerHeight / lineHeight) + 2;

      element.textContent = makeAscii(columns, rows, time / 1000);
      lastMeasure = time;
    };

    const render = (time: number) => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;

      updateField(current.x, current.y, Number.parseFloat(element.style.getPropertyValue("--ascii-radius")) || 16);
      element.style.opacity = isVisible ? "1" : "0";

      if (time - lastMeasure > 160) {
        measure(time);
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - target.x;
      const deltaY = event.clientY - target.y;
      const deltaTime = lastPointerTimestamp
        ? Math.max(16, event.timeStamp - lastPointerTimestamp)
        : 16;
      const velocity = Math.hypot(deltaX, deltaY) / deltaTime;
      const radius = Math.min(19.5, Math.max(14.5, 15 + velocity * 2.2));

      target.x = event.clientX;
      target.y = event.clientY;
      lastPointerTimestamp = event.timeStamp;
      element.style.setProperty("--ascii-radius", `${radius}rem`);
      isVisible = true;
      element.classList.add("ascii-overlay--active");

      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }

      hideTimer = window.setTimeout(() => {
        isVisible = false;
        element.classList.remove("ascii-overlay--active");
      }, 700);
    };

    const handleResize = () => {
      measure(performance.now());
      updateField(current.x, current.y);
    };

    const handlePointerLeave = () => {
      isVisible = false;
      element.style.setProperty("--ascii-radius", "16rem");
      element.classList.remove("ascii-overlay--active");
    };

    measure(0);
    updateField(current.x, current.y);
    animationFrame = window.requestAnimationFrame(render);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("blur", handlePointerLeave);

      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }
    };
  }, []);

  return <pre ref={asciiRef} aria-hidden="true" className="ascii-overlay" />;
}
