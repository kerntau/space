/**
 * kerntau Space — Minimal
 * Monochrome, serif/sans contrast, generous whitespace.
 * Pure CSS + Motion.
 */

import { useState, useCallback, useRef, useEffect, useLayoutEffect, type PointerEvent } from "react";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import {
  House, NotebookText, Github, AtSign, Check, Wind, Sun, Moon,
  MapPinned, CalendarDays, Braces, X, type LucideIcon,
} from "lucide-react";

// ======== THEME ========

type ThemeMode = "light" | "dark";

interface ThemeColors {
  bg: string;
  fg: string;
  fgSecondary: string;
  fgMuted: string;
  divider: string;
  hover: string;
}

const THEMES: Record<ThemeMode, ThemeColors> = {
  light: {
    bg: "#FAFAFA",
    fg: "#0A0A0A",
    fgSecondary: "rgba(10,10,10,0.45)",
    fgMuted: "rgba(10,10,10,0.25)",
    divider: "rgba(10,10,10,0.08)",
    hover: "rgba(10,10,10,0.04)",
  },
  dark: {
    bg: "#0A0E14",
    fg: "#FAFAFA",
    fgSecondary: "rgba(250,250,250,0.45)",
    fgMuted: "rgba(250,250,250,0.25)",
    divider: "rgba(250,250,250,0.08)",
    hover: "rgba(250,250,250,0.05)",
  },
};

// ======== DATA ========

interface LinkItem {
  label: string;
  url: string;
  icon: LucideIcon;
  ariaLabel?: string;
  copyable?: boolean;
}

const NAV_LINKS: LinkItem[] = [
  { label: "Home", url: "https://my.coox.one", icon: House, ariaLabel: "打开 Home，新窗口" },
  { label: "Blog", url: "https://blog.coox.one", icon: NotebookText, ariaLabel: "打开 Blog，新窗口" },
];

const SOCIALS: LinkItem[] = [
  { label: "Email", url: "mailto:cotovo@qq.com", icon: AtSign, ariaLabel: "复制邮箱地址", copyable: true },
  { label: "GitHub", url: "https://github.com/cotovo", icon: Github, ariaLabel: "打开 GitHub 主页，新窗口" },
  { label: "抖音", url: "https://v.douyin.com/HWMgjLaTtFk", icon: DouyinIcon, ariaLabel: "打开抖音主页，新窗口" },
  { label: "Bilibili", url: "https://space.bilibili.com/9655855", icon: BilibiliIcon, ariaLabel: "打开 Bilibili 主页，新窗口" },
];

const ABOUT = [
  { icon: MapPinned, value: "湖北 · 十堰" },
  { icon: CalendarDays, value: "2006 / 10" },
  { icon: Braces, value: "计算机科学" },
] as const;

const YEAR = new Date().getFullYear();

const BANNERS = [
  { text: "新域名 ", link: { label: "coox.one", url: "https://coox.one" }, suffix: " 已上线" },
  { text: "迁移至 Cloudflare，不稳定敬请谅解，稳定访问 ", link: { label: "cot.wiki", url: "https://cot.wiki" }, suffix: "" },
];

// ======== CUSTOM ICONS ========

function DouyinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.037 1.51-.556 2.769-1.56 3.773s-2.262 1.52-3.773 1.56H5.333c-1.51-.05-2.769-.556-3.773-1.56S.04 18.857 0 17.347v-7.36c.037-1.511.556-2.765 1.56-3.76 1.004-.996 2.263-1.52 3.773-1.574h.774l-1.574-1.6a.714.714 0 0 1-.213-.48.639.639 0 0 1 .213-.507l.027-.027a.73.73 0 0 1 .506-.213c.195 0 .366.07.512.213L8.16 4.653h7.68l2.08-2.08a.717.717 0 0 1 .506-.213c.196 0 .367.07.507.213l.027.027c.142.14.213.311.213.507a.714.714 0 0 1-.213.48l-1.574 1.66zm-12.48 3.04c-.683.037-1.26.285-1.733.747a2.32 2.32 0 0 0-.747 1.733v7.467c0 .683.249 1.265.747 1.733.498.469 1.076.723 1.733.747h13.334c.683-.024 1.265-.278 1.733-.747.469-.468.723-1.05.747-1.733V10.2c-.024-.683-.278-1.265-.747-1.733a2.32 2.32 0 0 0-1.733-.747H5.333zm3.36 2.987c.356 0 .653.124.907.373.25.25.373.55.373.907v.533h.533c.356 0 .653.124.907.373.25.25.373.55.373.907v.533c0 .356-.124.653-.373.907a1.23 1.23 0 0 1-.907.373h-.533v.533c0 .356-.124.653-.373.907a1.23 1.23 0 0 1-.907.373h-.533a1.23 1.23 0 0 1-.907-.373 1.23 1.23 0 0 1-.373-.907v-.533h-.533a1.23 1.23 0 0 1-.907-.373 1.23 1.23 0 0 1-.373-.907v-.533c0-.356.124-.653.373-.907.25-.25.55-.373.907-.373h.533v-.533c0-.356.124-.653.373-.907.25-.25.55-.373.907-.373h.533zm6.347 0c.356 0 .653.124.907.373.25.25.373.55.373.907v.533h.533c.356 0 .653.124.907.373.25.25.373.55.373.907v.533c0 .356-.124.653-.373.907a1.23 1.23 0 0 1-.907.373h-.533v.533c0 .356-.124.653-.373.907a1.23 1.23 0 0 1-.907.373h-.533a1.23 1.23 0 0 1-.907-.373 1.23 1.23 0 0 1-.373-.907v-.533h-.533a1.23 1.23 0 0 1-.907-.373 1.23 1.23 0 0 1-.373-.907v-.533c0-.356.124-.653.373-.907.25-.25.55-.373.907-.373h.533v-.533c0-.356.124-.653.373-.907.25-.25.55-.373.907-.373h.533z" />
    </svg>
  );
}

// ======== WIND CHIME ========

let sharedAudioCtx: AudioContext | null = null;

function playWindChime() {
  try {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return;
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") sharedAudioCtx = new Ctor();
    if (sharedAudioCtx.state === "suspended") void sharedAudioCtx.resume();
    const ctx = sharedAudioCtx;
    const freq = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5][Math.floor(Math.random() * 6)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    vibrato.frequency.value = 6;
    vibratoGain.gain.value = 3;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.3);
    vibrato.stop(ctx.currentTime + 1.3);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      vibrato.disconnect();
      vibratoGain.disconnect();
    };
  } catch {
    /* noop */
  }
}

function fallbackCopy(text: string) {
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.readOnly = true;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "0";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  try {
    ta.focus({ preventScroll: true });
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
    if (activeElement?.isConnected) {
      activeElement.focus({ preventScroll: true });
    }
  }
}

const EASE = [0.25, 1, 0.5, 1] as const;

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

const dividerIn = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: 0.2 } },
};

// ======== CODEX PET ========

const PET_SPRITESHEET = "/pets/yuexinmiao/spritesheet.webp";
const PET_COLUMNS = 8;
const PET_ROWS = 9;

type PetAction = "idle" | "running-right" | "running-left" | "waving" | "jumping";

const PET_ACTIONS: Record<PetAction, { row: number; durations: number[]; loop: boolean }> = {
  idle: { row: 0, durations: [280, 110, 110, 140, 140, 320], loop: true },
  "running-right": { row: 1, durations: [120, 120, 120, 120, 120, 120, 120, 220], loop: true },
  "running-left": { row: 2, durations: [120, 120, 120, 120, 120, 120, 120, 220], loop: true },
  waving: { row: 3, durations: [140, 140, 140, 280], loop: false },
  jumping: { row: 4, durations: [140, 140, 140, 140, 280], loop: false },
};

const PET_RESTING_ACTIONS: PetAction[] = ["idle", "waving", "jumping"];
const PET_WALK_SPEED = 44;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPetGutter() {
  if (typeof window === "undefined") return 16;
  return window.innerWidth < 640 ? 12 : 16;
}

function getEstimatedPetWidth() {
  if (typeof window === "undefined") return 96;
  return clamp(window.innerWidth * 0.1, 72, 96);
}

function getInitialPetX() {
  if (typeof window === "undefined") return 16;
  const gutter = getPetGutter();
  return Math.max(gutter, window.innerWidth - getEstimatedPetWidth() - gutter);
}

function YuexinmiaoPet() {
  const [action, setAction] = useState<PetAction>("idle");
  const [frame, setFrame] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [travelX, setTravelX] = useState(getInitialPetX);
  const [travelDuration, setTravelDuration] = useState(0.35);
  const petRef = useRef<HTMLButtonElement>(null);
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travelXRef = useRef(0);
  const boundsRef = useRef({ min: getPetGutter(), max: getInitialPetX() });
  const reducedMotionRef = useRef(false);
  const pageVisibleRef = useRef(!document.hidden);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setFrame(0);
  }, [action]);

  useEffect(() => {
    if (reducedMotion || !pageVisible) {
      setFrame(0);
      return;
    }

    const current = PET_ACTIONS[action];
    const displayFrame = Math.min(frame, current.durations.length - 1);
    const timeout = window.setTimeout(() => {
      setFrame((value) => {
        const next = value + 1;
        if (next < current.durations.length) return next;
        return current.loop ? 0 : value;
      });
    }, current.durations[displayFrame]);

    return () => window.clearTimeout(timeout);
  }, [action, frame, pageVisible, reducedMotion]);

  useEffect(() => () => {
    if (actionTimer.current) window.clearTimeout(actionTimer.current);
    if (walkTimer.current) window.clearTimeout(walkTimer.current);
  }, []);

  useEffect(() => {
    travelXRef.current = travelX;
  }, [travelX]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const updatePetBounds = useCallback(() => {
    const gutter = getPetGutter();
    const petWidth = petRef.current?.getBoundingClientRect().width ?? getEstimatedPetWidth();
    const max = Math.max(gutter, window.innerWidth - petWidth - gutter);
    boundsRef.current = { min: gutter, max };

    setTravelX((value) => {
      const next = reducedMotionRef.current ? max : clamp(value, gutter, max);
      travelXRef.current = next;
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    updatePetBounds();
    window.addEventListener("resize", updatePetBounds);
    return () => window.removeEventListener("resize", updatePetBounds);
  }, [updatePetBounds]);

  const clearWalkTimer = useCallback(() => {
    if (walkTimer.current) {
      window.clearTimeout(walkTimer.current);
      walkTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const visible = !document.hidden;
      pageVisibleRef.current = visible;
      setPageVisible(visible);

      if (!visible) {
        if (actionTimer.current) {
          window.clearTimeout(actionTimer.current);
          actionTimer.current = null;
        }
        clearWalkTimer();
        setAction("idle");
        setFrame(0);
        setTravelDuration(0.35);
      }
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [clearWalkTimer]);

  const scheduleStroll = useCallback((delay = 1600) => {
    clearWalkTimer();

    walkTimer.current = window.setTimeout(() => {
      if (reducedMotionRef.current || !pageVisibleRef.current) return;

      const { min, max } = boundsRef.current;
      const currentX = clamp(travelXRef.current, min, max);
      const range = max - min;

      if (range < 24) {
        scheduleStroll(2400);
        return;
      }

      const minStep = Math.min(96, Math.max(44, range * 0.28));
      let nextX = currentX;

      for (let i = 0; i < 6; i++) {
        const candidate = Math.round(min + Math.random() * range);
        if (Math.abs(candidate - currentX) >= minStep) {
          nextX = candidate;
          break;
        }
      }

      if (Math.abs(nextX - currentX) < 8) {
        scheduleStroll(1800);
        return;
      }

      const distance = Math.abs(nextX - currentX);
      const duration = Math.max(1300, Math.min(4200, (distance / PET_WALK_SPEED) * 1000));
      const nextAction = nextX > currentX ? "running-right" : "running-left";

      setAction(nextAction);
      setTravelDuration(duration / 1000);
      setTravelX(nextX);

      walkTimer.current = window.setTimeout(() => {
        if (reducedMotionRef.current || !pageVisibleRef.current) return;
        setAction("idle");
        scheduleStroll(1600 + Math.random() * 2600);
      }, duration + 120);
    }, delay);
  }, [clearWalkTimer]);

  useEffect(() => {
    if (reducedMotion || !pageVisible) {
      if (actionTimer.current) {
        window.clearTimeout(actionTimer.current);
        actionTimer.current = null;
      }
      clearWalkTimer();
      setTravelDuration(0.35);
      setTravelX(boundsRef.current.max);
      setAction("idle");
      return;
    }

    scheduleStroll();

    return clearWalkTimer;
  }, [clearWalkTimer, pageVisible, reducedMotion, scheduleStroll]);

  const playAction = useCallback((nextAction: PetAction) => {
    if (reducedMotion || !pageVisible) return;
    if (actionTimer.current) window.clearTimeout(actionTimer.current);
    clearWalkTimer();
    const duration = PET_ACTIONS[nextAction].durations.reduce((sum, value) => sum + value, 0);
    setTravelDuration(0.28);
    setAction(nextAction);
    actionTimer.current = window.setTimeout(() => {
      setAction("idle");
      actionTimer.current = null;
      scheduleStroll(1000);
    }, duration + 80);
  }, [clearWalkTimer, pageVisible, reducedMotion, scheduleStroll]);

  const handlePointerEnter = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    playAction("waving");
  }, [playAction]);

  const current = PET_ACTIONS[action];
  const displayFrame = Math.min(frame, current.durations.length - 1);
  const x = (displayFrame / (PET_COLUMNS - 1)) * 100;
  const y = (current.row / (PET_ROWS - 1)) * 100;

  return (
    <motion.button
      ref={petRef}
      type="button"
      aria-label="和月薪喵打招呼"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{
        opacity: 1,
        x: travelX,
        y: action === "jumping" && !reducedMotion ? [0, -16, 0] : 0,
        scale: 1,
      }}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      transition={{
        opacity: { duration: 0.35, ease: EASE },
        x: { duration: PET_RESTING_ACTIONS.includes(action) ? 0.35 : travelDuration, ease: "easeInOut" },
        y: { duration: action === "jumping" ? 0.55 : 0.25, ease: EASE },
        scale: { duration: 0.2, ease: EASE },
      }}
      onPointerEnter={handlePointerEnter}
      onFocus={() => playAction("waving")}
      onClick={() => playAction("jumping")}
      className="themed-interactive fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-0 sm:bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20 block cursor-pointer border-0 bg-transparent p-0 opacity-90 hover:opacity-100 focus-visible:opacity-100"
      style={{
        width: "clamp(72px, 10vw, 96px)",
        aspectRatio: "192 / 208",
        backgroundImage: `url(${PET_SPRITESHEET})`,
        backgroundSize: `${PET_COLUMNS * 100}% ${PET_ROWS * 100}%`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundRepeat: "no-repeat",
        imageRendering: "auto",
        touchAction: "manipulation",
        willChange: "transform, opacity",
      }}
    />
  );
}

// ======== UPTIME (isolated to prevent full-tree re-render every second) ========

function Uptime() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = new Date("2025-11-10T00:00:00").getTime();
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const diff = Date.now() - start;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${d}天 ${String(h).padStart(2, "0")}时 ${String(m).padStart(2, "0")}分 ${String(s).padStart(2, "0")}秒`;
    };
    update();
    let intervalId: number | null = null;
    const stopTimer = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };
    const startTimer = () => {
      if (intervalId || document.hidden) return;
      update();
      intervalId = window.setInterval(update, 1000);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };
    startTimer();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  return <span ref={ref} />;
}

// ======== RAIN BACKDROP ========

function RainBackdrop({ theme }: { theme: ThemeMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const colorRef = useRef(
    theme === "dark" ? { r: 250, g: 250, b: 250 } : { r: 10, g: 10, b: 10 }
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getDpr = () => window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const syncCanvasSize = () => {
      const dpr = getDpr();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const clearCanvas = () => ctx.clearRect(0, 0, width, height);

    syncCanvasSize();

    // --- Multi-layer parallax rain ---
    interface Drop {
      x: number; y: number; length: number; speed: number;
      opacity: number; lineWidth: number; layer: number;
    }
    const drops: Drop[] = [];
    const isMobile = width < 768;
    const totalDrops = Math.min(isMobile ? 80 : 180, Math.floor(width / (isMobile ? 10 : 6)));
    const layerConfigs = [
      { ratio: 0.4, sMin: 2, sMax: 4, lMin: 5, lMax: 10, oMin: 0.03, oMax: 0.07, lw: 0.5 },
      { ratio: 0.35, sMin: 4, sMax: 7, lMin: 9, lMax: 18, oMin: 0.06, oMax: 0.13, lw: 1 },
      { ratio: 0.25, sMin: 7, sMax: 12, lMin: 14, lMax: 26, oMin: 0.10, oMax: 0.20, lw: 1.5 },
    ];
    for (let li = 0; li < layerConfigs.length; li++) {
      const lc = layerConfigs[li];
      const n = Math.floor(totalDrops * lc.ratio);
      for (let i = 0; i < n; i++) {
        drops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: lc.lMin + Math.random() * (lc.lMax - lc.lMin),
          speed: lc.sMin + Math.random() * (lc.sMax - lc.sMin),
          opacity: lc.oMin + Math.random() * (lc.oMax - lc.oMin),
          lineWidth: lc.lw,
          layer: li,
        });
      }
    }

    // --- Elliptical ripple rings (perspective, multi-ring, staggered) ---
    interface Ring { x: number; y: number; r: number; maxR: number; o: number; delay: number; aspect: number; }
    const rings: Ring[] = [];

    // --- Splash particles (gravity-affected) ---
    interface Splash { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; o: number; size: number; }
    const splashes: Splash[] = [];

    // --- Impact flashes (brief bright dot at landing point) ---
    interface Flash { x: number; y: number; r: number; o: number; life: number; }
    const flashes: Flash[] = [];

    // --- Lightning ---
    let lightning = 0;
    let lightningTimer = 0;
    let nextLightning = 6000 + Math.random() * 18000;

    let raf: number | null = null;
    let lastTime = 0;
    const shouldAnimate = () => !motionQuery.matches && !document.hidden;

    const animate = (now: number) => {
      raf = null;
      if (!shouldAnimate()) {
        if (motionQuery.matches) clearCanvas();
        return;
      }

      const dt = lastTime ? Math.min(50, now - lastTime) : 16;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      const target = themeRef.current === "dark"
        ? { r: 250, g: 250, b: 250 }
        : { r: 10, g: 10, b: 10 };
      colorRef.current.r += (target.r - colorRef.current.r) * 0.05;
      colorRef.current.g += (target.g - colorRef.current.g) * 0.05;
      colorRef.current.b += (target.b - colorRef.current.b) * 0.05;
      const base = `${Math.round(colorRef.current.r)},${Math.round(colorRef.current.g)},${Math.round(colorRef.current.b)}`;
      const wind = 0.28 + Math.sin(now * 0.0003) * 0.12;
      // Rain intensity oscillation (gusts)
      const intensity = 0.75 + 0.25 * Math.sin(now * 0.00015) + 0.12 * Math.sin(now * 0.0007);

      // Lightning flash
      lightningTimer += dt;
      if (lightningTimer > nextLightning) {
        lightning = themeRef.current === "dark" ? 0.12 : 0.07;
        lightningTimer = 0;
        nextLightning = 8000 + Math.random() * 22000;
      }
      if (lightning > 0) {
        ctx.fillStyle = `rgba(255,255,255,${lightning})`;
        ctx.fillRect(0, 0, width, height);
        lightning *= 0.88;
        if (lightning < 0.002) lightning = 0;
      }

      // Rain drops (globalAlpha — no per-drop gradient allocation)
      drops.forEach((d) => {
        const x2 = d.x + wind * d.length;
        const y2 = d.y + d.length;
        ctx.globalAlpha = d.opacity;
        ctx.strokeStyle = `rgb(${base})`;
        ctx.lineWidth = d.lineWidth;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const sp = d.speed * intensity;
        d.y += sp;
        d.x += wind * sp;

        if (d.y > height) {
          const sx = d.x + wind * d.length;
          const sy = height - 1;
          if (d.layer >= 1 && Math.random() > 0.2) {
            // Impact flash (brief bright dot)
            flashes.push({ x: sx, y: sy, r: 1 + Math.random() * 1.5, o: d.opacity * 3.5, life: 0 });
            // Multi-ring elliptical ripples (staggered, decelerating)
            const ringCount = d.layer === 2 ? 3 : 2;
            const baseSize = 3 + Math.random() * (d.layer === 2 ? 9 : 5);
            for (let ri = 0; ri < ringCount; ri++) {
              rings.push({
                x: sx, y: sy, r: 0,
                maxR: baseSize * (1 - ri * 0.2),
                o: d.opacity * (2.8 - ri * 0.6),
                delay: ri * 7,
                aspect: 0.3 + Math.random() * 0.1,
              });
            }
            // Splash particles
            if (d.layer === 2 || (d.layer === 1 && Math.random() > 0.4)) {
              const pCount = 2 + Math.floor(Math.random() * 4);
              for (let pi = 0; pi < pCount; pi++) {
                const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.7;
                const pSpeed = 0.6 + Math.random() * 1.8;
                splashes.push({
                  x: sx, y: sy,
                  vx: Math.cos(angle) * pSpeed + wind * 2,
                  vy: Math.sin(angle) * pSpeed,
                  life: 0,
                  maxLife: 250 + Math.random() * 350,
                  o: d.opacity * 3.5,
                  size: 0.6 + Math.random() * 1.2,
                });
              }
            }
          }
          d.y = -d.length;
          d.x = Math.random() * width;
        }
        if (d.x > width) d.x = 0;
        if (d.x < -20) d.x = width;
      });
      ctx.globalAlpha = 1;

      // Impact flashes (brief bright dot at landing point, ~120ms)
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life += dt;
        if (f.life > 120) { flashes.splice(i, 1); continue; }
        const lr = f.life / 120;
        ctx.fillStyle = `rgba(${base},${Math.min(1, f.o * (1 - lr))})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * (1 + lr * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Elliptical ripple rings (full ellipse, decelerating, thinning)
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        if (ring.delay > 0) { ring.delay -= dt; continue; }
        const progress = ring.r / ring.maxR;
        ring.r += (1 - progress) * 0.8 + 0.05;
        ring.o *= 0.94;
        if (ring.r >= ring.maxR || ring.o < 0.004) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(${base},${ring.o})`;
        ctx.lineWidth = 0.8 * (1 - progress) + 0.2;
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, ring.r, ring.r * ring.aspect, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Splash particles with gravity
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i];
        sp.life += dt;
        if (sp.life > sp.maxLife) { splashes.splice(i, 1); continue; }
        sp.vy += 0.1; // gravity
        sp.x += sp.vx;
        sp.y += sp.vy;
        const lr = sp.life / sp.maxLife;
        const alpha = sp.o * (1 - lr);
        ctx.fillStyle = `rgba(${base},${alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (1 - lr * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle bottom mist
      const grad = ctx.createLinearGradient(0, height * 0.75, 0, height);
      grad.addColorStop(0, `rgba(${base},0)`);
      grad.addColorStop(1, `rgba(${base},${themeRef.current === "dark" ? 0.03 : 0.018})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      raf = window.requestAnimationFrame(animate);
    };

    const startRain = () => {
      if (raf !== null || !shouldAnimate()) return;
      lastTime = 0;
      raf = window.requestAnimationFrame(animate);
    };

    const stopRain = (clear = false) => {
      if (raf !== null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
      lastTime = 0;
      if (clear) clearCanvas();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      syncCanvasSize();
      if (motionQuery.matches) clearCanvas();
    };
    const handleVisibility = () => {
      if (document.hidden) {
        stopRain();
      } else {
        startRain();
      }
    };
    const handleMotionPreference = () => {
      if (motionQuery.matches) {
        stopRain(true);
      } else {
        startRain();
      }
    };

    handleMotionPreference();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionPreference);
    return () => {
      stopRain();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionPreference);
    };
  }, []); // theme via ref — no re-init on toggle

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ======== APP ========

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [chiming, setChiming] = useState(false);
  const [showBanner, setShowBanner] = useState(() => !sessionStorage.getItem("banner-dismissed-v2"));
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerPaused, setBannerPaused] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("/avatar.png");
  const [showInitials, setShowInitials] = useState(false);
  const [themeToggling, setThemeToggling] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chimeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const themeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;

  const email = "cotovo@qq.com";
  const ToggleIcon = theme === "light" ? Moon : Sun;
  const nextThemeLabel = theme === "light" ? "深色" : "浅色";

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEMES[theme].bg);
  }, [theme]);

  // Auto-follow system theme (only if user hasn't manually chosen)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const next = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", THEMES[next].bg);
        setTheme(next);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => () => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    if (chimeTimer.current) window.clearTimeout(chimeTimer.current);
    if (themeTimer.current) window.clearTimeout(themeTimer.current);
  }, []);

  useEffect(() => {
    if (!showBanner || bannerPaused || reduceMotion || BANNERS.length < 2) return;
    let intervalId: number | null = null;
    const stopTimer = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };
    const startTimer = () => {
      if (intervalId || document.hidden) return;
      intervalId = window.setInterval(() => setBannerIndex((i) => (i + 1) % BANNERS.length), 2600);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };
    startTimer();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [bannerPaused, showBanner, reduceMotion]);

  const handleCopy = useCallback(() => {
    const showCopyFeedback = (success: boolean) => {
      setCopied(success);
      setCopyFailed(!success);
      setShowToast(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => {
        setCopied(false);
        setCopyFailed(false);
        setShowToast(false);
        copyTimer.current = null;
      }, 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(() => showCopyFeedback(true)).catch(() => showCopyFeedback(fallbackCopy(email)));
    } else {
      showCopyFeedback(fallbackCopy(email));
    }
  }, []);

  const handleChime = useCallback(() => {
    setChiming(true);
    if (chimeTimer.current) window.clearTimeout(chimeTimer.current);
    chimeTimer.current = window.setTimeout(() => {
      setChiming(false);
      chimeTimer.current = null;
    }, 800);
    playWindChime();
  }, []);

  const dismissBanner = useCallback(() => {
    sessionStorage.setItem("banner-dismissed-v2", "1");
    setShowBanner(false);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    // Set data-theme synchronously so CSS variables change immediately
    document.documentElement.setAttribute("data-theme", next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEMES[next].bg);
    setThemeToggling(true);
    if (themeTimer.current) window.clearTimeout(themeTimer.current);
    themeTimer.current = window.setTimeout(() => {
      setThemeToggling(false);
      themeTimer.current = null;
    }, 700);
    localStorage.setItem("theme", next);
    setTheme(next);
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <main
        aria-label="kerntau 个人主页"
        className="themed relative min-h-dvh w-full overflow-x-hidden font-sans flex items-center justify-center"
        style={{ background: 'var(--t-bg)', color: 'var(--t-fg)' }}
      >
        {/* Rain Backdrop */}
        <RainBackdrop theme={theme} />

        {/* Codex Pet */}
        <YuexinmiaoPet />

        {/* Welcome Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: EASE }}
              onPointerEnter={() => setBannerPaused(true)}
              onPointerLeave={() => setBannerPaused(false)}
              onFocusCapture={() => setBannerPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setBannerPaused(false);
              }}
              className="themed fixed top-0 left-0 right-0 z-40 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--t-banner-bg)',
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderBottom: '1px solid var(--t-divider)',
              }}
            >
              <div className="relative flex items-center justify-center py-2 px-4 sm:px-6 w-full max-w-2xl">
                <div className="themed flex-1 text-center text-[11px] tracking-wide overflow-hidden" style={{ color: 'var(--t-fg-secondary)' }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={bannerIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {BANNERS[bannerIndex].text}
                      <a
                        href={BANNERS[bannerIndex].link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`打开 ${BANNERS[bannerIndex].link.label}，新窗口`}
                        className="themed editorial-link font-medium"
                        style={{ color: 'var(--t-fg)' }}
                      >
                        {BANNERS[bannerIndex].link.label}
                      </a>
                      {BANNERS[bannerIndex].suffix}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="themed-interactive absolute right-1 sm:right-2 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full hover:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
                  style={{ color: 'var(--t-fg-muted)' }}
                  aria-label="关闭横幅"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
              exit={{ opacity: 0, x: "-50%", y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="themed fixed left-1/2 z-50 text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap"
              style={{ backgroundColor: 'var(--t-fg)', color: 'var(--t-bg)', top: showBanner ? "3.5rem" : "1.5rem" }}
              role={copyFailed ? "alert" : "status"}
              aria-live={copyFailed ? "assertive" : "polite"}
              aria-atomic="true"
            >
              {copyFailed ? "复制失败，请手动打开邮箱" : "邮箱已复制"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md px-6 sm:px-8 py-[calc(3rem+env(safe-area-inset-top))] pb-[calc(3rem+env(safe-area-inset-bottom))] flex flex-col items-center"
        >
          {/* Avatar */}
          <motion.div variants={scaleIn} className="relative mb-6 sm:mb-8">
            <div
              className="themed-interactive w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative hover:scale-105"
              style={{ border: '1px solid var(--t-divider)' }}
            >
              {!imgLoaded && (
                <div
                  aria-hidden="true"
                  className="themed absolute inset-0 animate-pulse"
                  style={{ background: 'var(--t-shimmer)' }}
                />
              )}
              {showInitials ? (
                <div
                  className="themed w-full h-full flex items-center justify-center font-serif text-2xl"
                  style={{ color: 'var(--t-fg-secondary)', background: 'var(--t-hover)' }}
                >
                  P
                </div>
              ) : (
                <img
                  src={avatarSrc}
                  alt="kerntau"
                  width={80}
                  height={80}
                  decoding="async"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => {
                    if (avatarSrc === "/avatar.png") {
                      setAvatarSrc("https://github.com/cotovo.png");
                    } else {
                      setShowInitials(true);
                      setImgLoaded(true);
                    }
                  }}
                  className="w-full h-full object-cover"
                  style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
                />
              )}
            </div>
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.35, 1, 0.35] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="themed absolute bottom-1 right-1 w-2 h-2 rounded-full border-2 z-10"
              style={{ backgroundColor: 'var(--t-fg)', borderColor: 'var(--t-bg)' }}
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-none mb-3"
          >
            kerntau
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-[0.25em] uppercase font-medium mb-4"
            style={{ color: 'var(--t-fg-secondary)' }}
          >
            Frontend Crafter
          </motion.p>

          {/* About inline */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-[11px] mb-8 sm:mb-10"
            style={{ color: 'var(--t-fg-muted)' }}
          >
            {ABOUT.map(({ icon: Icon, value }, i) => (
              <span key={value} className="flex items-center gap-1.5">
                {i > 0 && <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--t-fg-muted)' }} />}
                <Icon className="w-3 h-3" strokeWidth={1.75} />
                {value}
              </span>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={dividerIn}
            className="h-px w-10 sm:w-12 mb-6 sm:mb-8"
            style={{ backgroundColor: 'var(--t-divider)', transformOrigin: "center" }}
          />

          {/* Navigate */}
          <motion.div variants={fadeUp} className="flex items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            {NAV_LINKS.map(({ label, url, icon: Icon, ariaLabel }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel ?? label}
                className="group -mx-2 -my-3 flex min-h-11 items-center gap-2 rounded-full px-2 py-3 text-sm font-medium themed-interactive hover:scale-105"
                style={{ color: 'var(--t-fg)' }}
              >
                <Icon className="w-3.5 h-3.5 group-hover:text-current group-focus-visible:text-current" strokeWidth={1.75} style={{ color: 'var(--t-fg-muted)', transition: 'color 0.2s ease' }} />
                <span className="editorial-link">{label}</span>
              </a>
            ))}
          </motion.div>

          {/* Socials — icon only */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return s.copyable ? (
                <button
                  key={s.label}
                  type="button"
                  onClick={handleCopy}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full themed-interactive hover:scale-105 cursor-pointer"
                  style={{ color: copied ? 'var(--t-fg)' : 'var(--t-fg-secondary)' }}
                  aria-label={copied ? "邮箱地址已复制" : copyFailed ? "邮箱复制失败，再试一次" : s.ariaLabel ?? s.label}
                >
                  {copied ? <Check className="w-[18px] h-[18px]" strokeWidth={1.75} /> : <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
                  <span
                    aria-hidden="true"
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] leading-none tracking-wider px-1.5 py-0.5 rounded-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 themed-interactive whitespace-nowrap pointer-events-none"
                    style={{ backgroundColor: 'var(--t-fg)', color: 'var(--t-bg)' }}
                  >
                    {s.label}
                  </span>
                </button>
              ) : (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full themed-interactive hover:scale-105"
                  style={{ color: 'var(--t-fg-secondary)' }}
                  aria-label={s.ariaLabel ?? s.label}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  <span
                    aria-hidden="true"
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] leading-none tracking-wider px-1.5 py-0.5 rounded-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 themed-interactive whitespace-nowrap pointer-events-none"
                    style={{ backgroundColor: 'var(--t-fg)', color: 'var(--t-bg)' }}
                  >
                    {s.label}
                  </span>
                </a>
              );
            })}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={dividerIn}
            className="h-px w-10 sm:w-12 mb-6 sm:mb-8"
            style={{ backgroundColor: 'var(--t-divider)', transformOrigin: "center" }}
          />

          {/* Quote */}
          <motion.p
            variants={fadeUp}
            className="font-serif text-base italic text-center leading-relaxed mb-6 sm:mb-8 relative"
            style={{ color: 'var(--t-fg-secondary)' }}
          >
            <span className="font-serif text-2xl mr-0.5" style={{ color: 'var(--t-fg-muted)' }}>"</span>
            起风了，唯有努力生存。
            <span className="font-serif text-2xl ml-0.5" style={{ color: 'var(--t-fg-muted)' }}>"</span>
          </motion.p>

          {/* Controls */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 sm:gap-4 mb-5">
            <button
              type="button"
              onClick={handleChime}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full themed-interactive cursor-pointer"
              style={{ backgroundColor: 'var(--t-hover)' }}
              aria-label="播放风铃音效"
            >
              <motion.div
                animate={chiming && !reduceMotion ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.6 }}
              >
                <Wind className="w-4 h-4" strokeWidth={1.75} style={{ color: 'var(--t-fg-secondary)' }} />
              </motion.div>
              <AnimatePresence>
                {chiming && !reduceMotion &&
                  [0, 1].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      initial={{ scale: 1, opacity: 0.4 }}
                      animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.12 }}
                      className="absolute inset-0 rounded-full border pointer-events-none"
                      style={{ borderColor: 'var(--t-fg)' }}
                    />
                  ))}
              </AnimatePresence>
              <span
                aria-hidden="true"
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-[10px] leading-none tracking-wider px-1.5 py-0.5 rounded-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 themed-interactive whitespace-nowrap pointer-events-none"
                style={{ backgroundColor: 'var(--t-fg)', color: 'var(--t-bg)' }}
              >
                轻抚风铃
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full themed-interactive cursor-pointer"
              style={{ backgroundColor: 'var(--t-hover)' }}
              aria-label={`切换到${nextThemeLabel}主题`}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ToggleIcon className="w-4 h-4" strokeWidth={1.75} style={{ color: 'var(--t-fg-secondary)' }} />
              </motion.div>
              <AnimatePresence>
                {themeToggling && !reduceMotion &&
                  [0, 1].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      initial={{ scale: 1, opacity: 0.35 }}
                      animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.12 }}
                      className="absolute inset-0 rounded-full border pointer-events-none"
                      style={{ borderColor: 'var(--t-fg)' }}
                    />
                  ))}
              </AnimatePresence>
              <span
                aria-hidden="true"
                className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-[10px] leading-none tracking-wider px-1.5 py-0.5 rounded-full opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 themed-interactive whitespace-nowrap pointer-events-none"
                style={{ backgroundColor: 'var(--t-fg)', color: 'var(--t-bg)' }}
              >
                切换主题
              </span>
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--t-fg-muted)' }}>
              © {YEAR} kerntau
            </p>
            <p className="text-[10px] tracking-wide" style={{ color: 'var(--t-fg-muted)' }}>
              本站由 <a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" aria-label="打开 Cloudflare，新窗口" className="editorial-link">Cloudflare</a> 强力驱动 · 运行 <Uptime />
            </p>
          </motion.div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
