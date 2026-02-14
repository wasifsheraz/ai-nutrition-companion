// ── Reusable Motion Variants ──
import { Variants } from "framer-motion";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

const duration = (d: number) => (prefersReducedMotion ? 0 : d);

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration(0.5), ease: "easeOut" } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: duration(0.3) } },
};

export const stagger = (staggerDelay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: duration(staggerDelay) } },
});

export const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: duration(0.5), ease: "easeOut", delay: duration(delay) } },
});

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration(0.4), delay: duration(delay) } },
});

export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: duration(0.4), ease: "easeOut", delay: duration(delay) } },
});

export const slideRight = (delay = 0): Variants => ({
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: duration(0.5), ease: "easeOut", delay: duration(delay) } },
});

export const hoverLift = {
  whileHover: prefersReducedMotion ? {} : { y: -3, scale: 1.02, transition: { duration: 0.25, ease: "easeOut" } },
  whileTap: prefersReducedMotion ? {} : { scale: 0.97, transition: { duration: 0.1 } },
};

export const hoverScale = {
  whileHover: prefersReducedMotion ? {} : { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: prefersReducedMotion ? {} : { scale: 0.97 },
};

export const tapShrink = {
  whileTap: prefersReducedMotion ? {} : { scale: 0.95 },
};

export const springBounce = { type: "spring" as const, stiffness: 400, damping: 25 };
export const springSmooth = { type: "spring" as const, stiffness: 300, damping: 30 };
export const springSnappy = { type: "spring" as const, stiffness: 500, damping: 35 };
