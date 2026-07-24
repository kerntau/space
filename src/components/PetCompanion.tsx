import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";

const SPRITESHEET = "/pets/yuexinmiao/spritesheet.webp";
const COLUMNS = 8;
const ROWS = 9;
const WAITING_DELAY = 14000;

type PetAction =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "failed"
  | "waiting"
  | "working"
  | "review";

interface ActionDefinition {
  row: number;
  durations: number[];
  loop: boolean;
  label: string;
}

interface DragSession {
  pointerId: number;
  startClientX: number;
  startTravelX: number;
  lastClientX: number;
  moved: boolean;
}

const ACTIONS: Record<PetAction, ActionDefinition> = {
  idle: { row: 0, durations: [520, 120, 120, 180, 140, 720], loop: true, label: "正在陪伴" },
  "running-right": { row: 1, durations: [105, 105, 115, 105, 105, 115, 120, 145], loop: true, label: "向右移动" },
  "running-left": { row: 2, durations: [105, 105, 115, 105, 105, 115, 120, 145], loop: true, label: "向左移动" },
  waving: { row: 3, durations: [130, 140, 170, 430], loop: false, label: "向你挥手" },
  jumping: { row: 4, durations: [110, 130, 150, 190, 320], loop: false, label: "开心地跳起来" },
  failed: { row: 5, durations: [180, 190, 220, 360, 320, 360, 260, 220], loop: false, label: "有一点难过" },
  waiting: { row: 6, durations: [220, 230, 260, 240, 260, 620], loop: true, label: "安静等待" },
  working: { row: 7, durations: [155, 165, 165, 175, 185, 360], loop: true, label: "认真处理中" },
  review: { row: 8, durations: [150, 160, 170, 180, 190, 380], loop: false, label: "认真观察变化" },
};

export interface PetReaction {
  id: number;
  type: "chime" | "copied" | "error" | "theme";
}

// Random dialogue banks for lively interaction
const DIALOGUES = {
  musicOn: ["🎵 音乐开启喵~", "🎶 随音律摇摆吧~", "✨ 奏响浪漫旋律！"],
  musicOff: ["音乐已暂停 💤", "喵~ 稍微休息一下", "进入沉静模式喵"],
  drop: ["落地成功喵！", "站稳啦~ 喵！", "芜湖！降落完成！"],
  hover: ["点击我可以控制音乐哦喵~", "今天也是元气满满的一天！", "需要月薪喵做些什么吗？"],
};

function getRandomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function FloatingMusicNotes({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion() === true;
  if (!active || reduceMotion) return null;

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1.5 z-30">
      <motion.span
        initial={{ opacity: 0, y: 0, scale: 0.6, rotate: -15 }}
        animate={{
          opacity: [0, 1, 0.85, 0],
          y: [-2, -24, -42],
          x: [-8, -16, -10],
          rotate: [-15, 12, -22],
          scale: [0.6, 1.15, 0.9],
        }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.3, ease: "easeOut" }}
        className="text-[#38BDF8] text-xs md:text-sm filter drop-shadow-[0_0_8px_rgba(56,189,248,0.85)] select-none"
      >
        🎵
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 0, scale: 0.6, rotate: 10 }}
        animate={{
          opacity: [0, 1, 0.85, 0],
          y: [-2, -28, -48],
          x: [6, 14, 8],
          rotate: [10, -18, 18],
          scale: [0.6, 1.25, 0.85],
        }}
        transition={{ duration: 2.5, delay: 0.7, repeat: Infinity, repeatDelay: 0.2, ease: "easeOut" }}
        className="text-[#7DD3FC] text-sm md:text-base filter drop-shadow-[0_0_8px_rgba(125,211,252,0.85)] select-none"
      >
        🎶
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.95, 0],
          y: [-4, -20, -36],
          x: [0, -6, 6],
          scale: [0.5, 1.1, 0.6],
        }}
        transition={{ duration: 1.8, delay: 1.3, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
        className="text-white text-[10px] md:text-xs filter drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] select-none"
      >
        ✨
      </motion.span>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function actionDuration(action: PetAction) {
  return ACTIONS[action].durations.reduce((total, duration) => total + duration, 0);
}

function petWidth() {
  if (window.innerWidth <= 480) return 56;
  if (window.innerWidth <= 640) return 64;
  return Math.min(94, Math.max(68, window.innerWidth * 0.078));
}

function petBounds() {
  // Mobile responsive padding to prevent edge clipping
  const gutter = window.innerWidth < 640 ? 12 : 24;
  return {
    min: gutter,
    max: Math.max(gutter, window.innerWidth - petWidth() - gutter),
  };
}

function restPosition(section: string) {
  const { min, max } = petBounds();
  if (window.innerWidth < 720) return max;

  const offsets: Record<string, number> = {
    intro: 0,
    about: 136,
    projects: 178,
    log: 0,
  };
  return clamp(max - (offsets[section] ?? 0), min, max);
}

function clearTimer(timer: MutableRefObject<number | null>) {
  if (timer.current === null) return;
  window.clearTimeout(timer.current);
  timer.current = null;
}

export default function PetCompanion({
  activeSection,
  reaction,
  isPlayingBGM = false,
  onToggleBGM,
}: {
  activeSection: string;
  reaction: PetReaction | null;
  isPlayingBGM?: boolean;
  onToggleBGM?: () => void;
}) {
  const reduceMotion = useReducedMotion() === true;
  const initialTravelX = restPosition("intro");
  const [action, setAction] = useState<PetAction>("idle");
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(reduceMotion);
  const [travelX, setTravelX] = useState(initialTravelX);
  const [dragging, setDragging] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageMoving, setPageMoving] = useState(false);
  const [compact, setCompact] = useState(() => window.innerWidth < 720);
  const petRef = useRef<HTMLButtonElement>(null);
  const actionRef = useRef<PetAction>("idle");
  const activeSectionRef = useRef(activeSection);
  const travelRef = useRef(initialTravelX);
  const manuallyPositioned = useRef(false);
  const dragSession = useRef<DragSession | null>(null);
  const suppressClick = useRef(false);
  const actionTimer = useRef<number | null>(null);
  const waitingTimer = useRef<number | null>(null);
  const movementTimer = useRef<number | null>(null);
  const scrollTimer = useRef<number | null>(null);
  const suppressClickTimer = useRef<number | null>(null);
  activeSectionRef.current = activeSection;

  const setCurrentAction = useCallback((next: PetAction) => {
    actionRef.current = next;
    setFrame(0);
    setAction(next);
  }, []);

  const scheduleWaiting = useCallback(() => {
    clearTimer(waitingTimer);
    if (reduceMotion) return;
    waitingTimer.current = window.setTimeout(() => {
      if (actionRef.current === "idle" && !dragSession.current) {
        setCurrentAction("waiting");
      }
      waitingTimer.current = null;
    }, WAITING_DELAY);
  }, [reduceMotion, setCurrentAction]);

  const playAction = useCallback((next: PetAction, settleDelay = 320) => {
    if (reduceMotion) return;
    clearTimer(actionTimer);
    clearTimer(waitingTimer);
    setCurrentAction(next);

    const duration = ACTIONS[next].loop
      ? Math.max(actionDuration(next), 1450)
      : actionDuration(next) + settleDelay;
    actionTimer.current = window.setTimeout(() => {
      setCurrentAction("idle");
      actionTimer.current = null;
      scheduleWaiting();
    }, duration);
  }, [reduceMotion, scheduleWaiting, setCurrentAction]);

  const freezeTravel = useCallback(() => {
    const left = petRef.current?.getBoundingClientRect().left;
    if (typeof left !== "number") return travelRef.current;
    const { min, max } = petBounds();
    const next = clamp(left, min, max);
    travelRef.current = next;
    setTravelX(next);
    return next;
  }, []);

  const stopMovement = useCallback(() => {
    clearTimer(movementTimer);
    freezeTravel();
  }, [freezeTravel]);

  const moveTo = useCallback((requestedX: number) => {
    const { min, max } = petBounds();
    const next = clamp(requestedX, min, max);
    const current = freezeTravel();
    const distance = Math.abs(next - current);

    clearTimer(actionTimer);
    clearTimer(movementTimer);
    clearTimer(waitingTimer);
    travelRef.current = next;
    setTravelX(next);

    if (reduceMotion || distance < 6) {
      setCurrentAction("idle");
      scheduleWaiting();
      return;
    }

    setCurrentAction(next > current ? "running-right" : "running-left");
    const duration = clamp(distance / (compact ? 250 : 300), 0.52, 1.18) * 1000;
    movementTimer.current = window.setTimeout(() => {
      setCurrentAction("idle");
      movementTimer.current = null;
      scheduleWaiting();
    }, duration);
  }, [compact, freezeTravel, reduceMotion, scheduleWaiting, setCurrentAction]);

  useEffect(() => {
    if (reduceMotion) {
      setFrame(0);
      return;
    }

    const definition = ACTIONS[action];
    let currentFrame = 0;
    let elapsed = 0;
    let previous = performance.now();
    let frameId = 0;

    const tick = (time: number) => {
      elapsed += Math.min(time - previous, 80);
      previous = time;
      let duration = definition.durations[currentFrame];

      while (elapsed >= duration) {
        elapsed -= duration;
        if (currentFrame >= definition.durations.length - 1) {
          if (!definition.loop) return;
          currentFrame = 0;
        } else {
          currentFrame += 1;
        }
        setFrame(currentFrame);
        duration = definition.durations[currentFrame];
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [action, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      setCurrentAction("idle");
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
      playAction("waving", 520);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [playAction, reduceMotion, setCurrentAction]);

  useLayoutEffect(() => {
    const updateBounds = () => {
      const isCompact = window.innerWidth < 720;
      setCompact(isCompact);
      const { min, max } = petBounds();
      const next = manuallyPositioned.current
        ? clamp(travelRef.current, min, max)
        : restPosition(activeSectionRef.current);
      travelRef.current = next;
      setTravelX(next);
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  useEffect(() => {
    if (!visible || manuallyPositioned.current) return;
    moveTo(restPosition(activeSection));
  }, [activeSection, moveTo, visible]);

  useEffect(() => {
    if (!reaction || reduceMotion) return;
    stopMovement();
    const nextAction: Record<PetReaction["type"], PetAction> = {
      chime: "review",
      copied: "jumping",
      error: "failed",
      theme: "working",
    };
    playAction(nextAction[reaction.type], reaction.type === "error" ? 520 : 360);
  }, [playAction, reaction, reduceMotion, stopMovement]);

  useEffect(() => {
    const wake = () => {
      if (actionRef.current === "waiting") setCurrentAction("idle");
      scheduleWaiting();
    };
    const handleScroll = () => {
      setPageMoving(true);
      if (actionRef.current === "waiting") setCurrentAction("idle");
      clearTimer(scrollTimer);
      scrollTimer.current = window.setTimeout(() => {
        setPageMoving(false);
        scheduleWaiting();
        scrollTimer.current = null;
      }, 220);
    };
    const handleVisibility = () => {
      if (!document.hidden) {
        setCurrentAction("idle");
        setPageMoving(false);
        scheduleWaiting();
      }
    };

    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("keydown", wake);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    scheduleWaiting();
    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimer(scrollTimer);
      clearTimer(waitingTimer);
    };
  }, [scheduleWaiting, setCurrentAction]);

  useEffect(() => () => {
    clearTimer(actionTimer);
    clearTimer(movementTimer);
    clearTimer(waitingTimer);
    clearTimer(scrollTimer);
    clearTimer(suppressClickTimer);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const current = freezeTravel();
    clearTimer(actionTimer);
    clearTimer(movementTimer);
    clearTimer(waitingTimer);
    clearTimer(suppressClickTimer);
    suppressClick.current = false;
    dragSession.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startTravelX: current,
      lastClientX: event.clientX,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPressed(true);
  };

  const updateDrag = useCallback((pointerId: number, clientX: number) => {
    const session = dragSession.current;
    if (!session || session.pointerId !== pointerId) return;
    const delta = clientX - session.startClientX;
    if (!session.moved && Math.abs(delta) < 5) return;

    session.moved = true;
    suppressClick.current = true;
    manuallyPositioned.current = true;
    setPressed(false);
    setDragging(true);
    const { min, max } = petBounds();
    const next = clamp(session.startTravelX + delta, min, max);
    const direction = clientX >= session.lastClientX ? "running-right" : "running-left";
    if (actionRef.current !== direction) setCurrentAction(direction);
    session.lastClientX = clientX;
    travelRef.current = next;
    setTravelX(next);
  }, [setCurrentAction]);

  const completeDrag = useCallback((pointerId: number) => {
    const session = dragSession.current;
    if (!session || session.pointerId !== pointerId) return;
    if (petRef.current?.hasPointerCapture(pointerId)) {
      petRef.current.releasePointerCapture(pointerId);
    }
    dragSession.current = null;
    setPressed(false);
    setDragging(false);
    if (session.moved) {
      suppressClick.current = true;
      clearTimer(suppressClickTimer);
      suppressClickTimer.current = window.setTimeout(() => {
        suppressClick.current = false;
        suppressClickTimer.current = null;
      }, 0);
      setCurrentAction("jumping");
      showBubble(getRandomItem(DIALOGUES.drop));
      scheduleWaiting();
    }
  }, [scheduleWaiting, setCurrentAction]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    updateDrag(event.pointerId, event.clientX);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    completeDrag(event.pointerId);
  };

  useEffect(() => {
    const handlePointerMoveFallback = (event: globalThis.PointerEvent) => {
      updateDrag(event.pointerId, event.clientX);
    };
    const handlePointerEndFallback = (event: globalThis.PointerEvent) => {
      completeDrag(event.pointerId);
    };
    window.addEventListener("pointermove", handlePointerMoveFallback, true);
    window.addEventListener("pointerup", handlePointerEndFallback, true);
    window.addEventListener("pointercancel", handlePointerEndFallback, true);
    return () => {
      window.removeEventListener("pointermove", handlePointerMoveFallback, true);
      window.removeEventListener("pointerup", handlePointerEndFallback, true);
      window.removeEventListener("pointercancel", handlePointerEndFallback, true);
    };
  }, [completeDrag, updateDrag]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Escape") return;
    event.preventDefault();
    stopMovement();

    if (event.key === "Escape") {
      manuallyPositioned.current = false;
      moveTo(restPosition(activeSectionRef.current));
      return;
    }

    manuallyPositioned.current = true;
    const direction = event.key === "ArrowRight" ? 1 : -1;
    moveTo(travelRef.current + direction * (compact ? 64 : 88));
  };

  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const bubbleTimer = useRef<number | null>(null);

  const showBubble = (text: string) => {
    setBubbleText(text);
    if (bubbleTimer.current !== null) window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubbleText(null), 2500);
  };

  const definition = ACTIONS[action];
  const visibleFrame = Math.min(frame, definition.durations.length - 1);
  const spriteX = (visibleFrame / (COLUMNS - 1)) * 100;
  const spriteY = (definition.row / (ROWS - 1)) * 100;
  const running = action === "running-left" || action === "running-right";
  const active = action !== "idle" && action !== "waiting";
  const restingOpacity = compact && activeSection !== "intro" ? 0.72 : 1;

  return (
    <div className="pet-layer">
      <motion.button
        ref={petRef}
        type="button"
        className={`pet-companion relative${dragging ? " is-dragging" : ""}${pageMoving && compact ? " is-page-moving" : ""}`}
        aria-label="月薪喵，点击控制音乐与互动，可左右拖动"
        aria-roledescription="可互动宠物"
        data-pet-action={action}
        data-pet-frame={visibleFrame}
        initial={false}
        animate={{
          opacity: visible ? (pageMoving && compact ? 0.22 : active || dragging ? 1 : restingOpacity) : 0,
          x: visible ? travelX : window.innerWidth + 40,
          y: action === "jumping" && !reduceMotion ? [0, -18, -28, -10, 0] : isPlayingBGM && !reduceMotion ? [0, -6, -2, -6, 0] : running && !reduceMotion ? [0, -1.5, 0] : [0, -3, 0],
          rotate: running && !reduceMotion ? (action === "running-right" ? [0, 1.2, -0.8, 0] : [0, -1.2, 0.8, 0]) : 0,
          scale: dragging ? 1.04 : pressed ? 0.94 : hovered || focused ? 1.06 : 1,
        }}
        transition={{
          opacity: { duration: reduceMotion ? 0 : 0.2 },
          x: dragging || reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 116, damping: 21, mass: 0.72 },
          y: { duration: action === "jumping" ? 0.78 : isPlayingBGM ? 0.8 : 2.4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.38, repeat: running ? Infinity : 0, ease: "easeInOut" },
          scale: { duration: reduceMotion ? 0 : 0.16 },
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerEnter={(event) => {
          setHovered(true);
          if (event.pointerType !== "touch" && (actionRef.current === "idle" || actionRef.current === "waiting")) {
            playAction("waving", 280);
            if (!bubbleText) showBubble(getRandomItem(DIALOGUES.hover));
          }
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) => {
          setFocused(true);
          if (event.currentTarget.matches(":focus-visible") && (actionRef.current === "idle" || actionRef.current === "waiting")) {
            playAction("waving", 280);
          }
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          stopMovement();
          playAction("jumping", 360);

          if (onToggleBGM) {
            onToggleBGM();
            showBubble(!isPlayingBGM ? getRandomItem(DIALOGUES.musicOn) : getRandomItem(DIALOGUES.musicOff));
          } else {
            showBubble("喵！很高兴见到你~");
          }
        }}
        style={{
          backgroundImage: `url(${SPRITESHEET})`,
          backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
          backgroundPosition: `${spriteX}% ${spriteY}%`,
        }}
      >
        <FloatingMusicNotes active={isPlayingBGM} />

        {/* Speech Bubble Emote */}
        <AnimatePresence>
          {bubbleText && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl bg-white text-slate-900 font-mono text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-slate-100 whitespace-nowrap pointer-events-none z-50 flex items-center gap-1.5 select-none"
            >
              <span>{bubbleText}</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-slate-100" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <span className="pet-status" role="status" aria-live="polite">
        月薪喵：{definition.label}
      </span>
    </div>
  );
}
