/**
 * kerntau Space — Minimal
 * Monochrome, serif/sans contrast, generous whitespace.
 * Pure CSS + Motion.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  Home, BookOpen, Github, Mail, Check, Wind, Sun, Moon,
  MapPin, Calendar, GraduationCap, X, type LucideIcon,
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
    bg: "#0A0A0A",
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
  copyable?: boolean;
}

const NAV_LINKS: LinkItem[] = [
  { label: "Home", url: "https://my.coox.one", icon: Home },
  { label: "Blog", url: "https://blog.coox.one", icon: BookOpen },
];

const SOCIALS: LinkItem[] = [
  { label: "Email", url: "mailto:cotovo@qq.com", icon: Mail, copyable: true },
  { label: "GitHub", url: "https://github.com/cotovo", icon: Github },
  { label: "抖音", url: "https://v.douyin.com/HWMgjLaTtFk", icon: DouyinIcon },
  { label: "Bilibili", url: "https://space.bilibili.com/9655855", icon: BilibiliIcon },
];

const ABOUT = [
  { icon: MapPin, value: "湖北 · 十堰" },
  { icon: Calendar, value: "2006 / 10" },
  { icon: GraduationCap, value: "计算机科学" },
] as const;

const YEAR = new Date().getFullYear();

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
    if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
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
    vibrato.connect(osc.frequency);
    vibrato.start();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.3);
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

// ======== MOTION ========

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

// ======== UPTIME (isolated to prevent full-tree re-render every second) ========

function Uptime() {
  const [uptime, setUptime] = useState("");
  useEffect(() => {
    const start = new Date("2025-11-10T00:00:00").getTime();
    const update = () => {
      const diff = Date.now() - start;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUptime(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{uptime}</>;
}

// ======== APP ========

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [chiming, setChiming] = useState(false);
  const [showBanner, setShowBanner] = useState(() => !sessionStorage.getItem("banner-dismissed"));
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const email = "cotovo@qq.com";
  const t = THEMES[theme];
  const ToggleIcon = theme === "light" ? Moon : Sun;

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEMES[theme].bg);
  }, [theme]);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setShowToast(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => { setCopied(false); setShowToast(false); }, 2000);
    });
  }, []);

  const handleChime = useCallback(() => {
    setChiming(true);
    setTimeout(() => setChiming(false), 800);
    playWindChime();
  }, []);

  const dismissBanner = useCallback(() => {
    sessionStorage.setItem("banner-dismissed", "1");
    setShowBanner(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main
        aria-label="kerntau 个人主页"
        className="relative min-h-screen w-full overflow-x-hidden font-sans flex items-center justify-center"
        style={{ background: t.bg, color: t.fg }}
      >
        {/* Welcome Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center"
              style={{
                backgroundColor: theme === "dark" ? "rgba(250,250,250,0.05)" : "rgba(10,10,10,0.035)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderBottom: `1px solid ${t.divider}`,
              }}
            >
              <div className="flex items-center gap-3 py-2.5 px-5 sm:px-6 w-full max-w-md">
                <p className="flex-1 text-center text-[11px] tracking-wide" style={{ color: t.fgSecondary }}>
                  欢迎来到{" "}
                  <a
                    href="https://coox.one/emm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link font-medium"
                    style={{ color: t.fg }}
                  >
                    coox.one
                  </a>
                  {" "}— 新域名上线
                </p>
                <button
                  onClick={dismissBanner}
                  className="flex-shrink-0 transition-opacity duration-200 hover:opacity-50 cursor-pointer"
                  style={{ color: t.fgMuted }}
                  aria-label="关闭横幅"
                >
                  <X className="w-3.5 h-3.5" />
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
              className="fixed left-1/2 z-50 text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap"
              style={{ backgroundColor: t.fg, color: t.bg, top: showBanner ? "3.5rem" : "1.5rem" }}
              role="status"
            >
              邮箱已复制
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md px-6 sm:px-8 py-12 flex flex-col items-center"
        >
          {/* Avatar */}
          <motion.div variants={scaleIn} className="relative mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
              <img
                src="/avatar.png"
                alt="kerntau"
                width={80}
                height={80}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span
              className="absolute bottom-0.5 right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2"
              style={{ backgroundColor: t.fg, borderColor: t.bg }}
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
            style={{ color: t.fgSecondary }}
          >
            Frontend Crafter
          </motion.p>

          {/* About inline */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-[11px] mb-8 sm:mb-10"
            style={{ color: t.fgMuted }}
          >
            {ABOUT.map(({ icon: Icon, value }, i) => (
              <span key={value} className="flex items-center gap-1.5">
                {i > 0 && <span className="w-1 h-1 rounded-full" style={{ backgroundColor: t.fgMuted }} />}
                <Icon className="w-3 h-3" />
                {value}
              </span>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="h-px w-10 sm:w-12 mb-6 sm:mb-8"
            style={{ backgroundColor: t.divider }}
          />

          {/* Navigate */}
          <motion.div variants={fadeUp} className="flex items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            {NAV_LINKS.map(({ label, url, icon: Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm font-medium transition-opacity duration-200 hover:opacity-50"
                style={{ color: t.fg }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: t.fgMuted }} />
                <span className="editorial-link">{label}</span>
              </a>
            ))}
          </motion.div>

          {/* Socials — icon only */}
          <motion.div variants={fadeUp} className="flex items-center gap-5 sm:gap-6 mb-8 sm:mb-10">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return s.copyable ? (
                <button
                  key={s.label}
                  onClick={handleCopy}
                  className="transition-opacity duration-200 hover:opacity-50 cursor-pointer"
                  style={{ color: copied ? t.fg : t.fgSecondary }}
                  aria-label={s.label}
                >
                  {copied ? <Check className="w-[18px] h-[18px]" /> : <Icon className="w-[18px] h-[18px]" />}
                </button>
              ) : (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 hover:opacity-50"
                  style={{ color: t.fgSecondary }}
                  aria-label={s.label}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              );
            })}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="h-px w-10 sm:w-12 mb-6 sm:mb-8"
            style={{ backgroundColor: t.divider }}
          />

          {/* Quote */}
          <motion.p
            variants={fadeUp}
            className="font-serif text-base italic text-center leading-relaxed mb-6 sm:mb-8"
            style={{ color: t.fgSecondary }}
          >
            起风了，唯有努力生存。
          </motion.p>

          {/* Controls */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 sm:gap-4 mb-5">
            <button
              onClick={handleChime}
              className="relative p-2.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ backgroundColor: t.hover }}
              aria-label="播放风铃音效"
            >
              <motion.div
                animate={chiming ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Wind className="w-4 h-4" style={{ color: t.fgSecondary }} />
              </motion.div>
              <AnimatePresence>
                {chiming &&
                  [0, 1].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 1, opacity: 0.4 }}
                      animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.12 }}
                      className="absolute inset-0 rounded-full border pointer-events-none"
                      style={{ borderColor: t.fg }}
                    />
                  ))}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ backgroundColor: t.hover }}
              aria-label="切换明暗主题"
            >
              <ToggleIcon className="w-4 h-4" style={{ color: t.fgSecondary }} />
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: t.fgMuted }}>
              © {YEAR} kerntau
            </p>
            <p className="text-[10px] tracking-wide" style={{ color: t.fgMuted }}>
              本站由 Cloudflare 强力驱动 · 运行 <Uptime />
            </p>
          </motion.div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
