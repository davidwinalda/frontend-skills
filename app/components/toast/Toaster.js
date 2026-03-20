"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { subscribe } from "./index";

const MAX_TOASTS = 3;
const COLLAPSED_Y_STEP = 16; // px each older toast moves up behind front
const COLLAPSED_SCALE_STEP = 0.06; // scale reduction per level
const EXPANDED_GAP = 10; // px gap between expanded toasts
const SWIPE_THRESHOLD = 80; // px drag to dismiss
const SWIPE_VELOCITY = 0.11; // px/ms velocity to dismiss

export default function Toaster() {
  const [toasts, setToasts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [, forceUpdate] = useState(0);
  const heights = useRef({});
  const timers = useRef({}); // { id: { timeout, startTime, remaining } }

  const clearTimer = useCallback((id) => {
    clearTimeout(timers.current[id]?.timeout);
  }, []);

  const removeToast = useCallback(
    (id) => {
      clearTimer(id);
      delete timers.current[id];
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        delete heights.current[id];
      }, 400);
    },
    [clearTimer]
  );

  const startTimer = useCallback(
    (id, duration) => {
      clearTimer(id);
      if (duration === Infinity) return;
      const startTime = Date.now();
      timers.current[id] = {
        startTime,
        remaining: duration,
        timeout: setTimeout(() => removeToast(id), duration),
      };
    },
    [clearTimer, removeToast]
  );

  const pauseTimers = useCallback(() => {
    Object.keys(timers.current).forEach((id) => {
      const d = timers.current[id];
      if (!d) return;
      clearTimeout(d.timeout);
      d.remaining = d.remaining - (Date.now() - d.startTime);
    });
  }, []);

  const resumeTimers = useCallback(() => {
    Object.keys(timers.current).forEach((id) => {
      const d = timers.current[id];
      if (!d || d.remaining <= 0) return;
      d.startTime = Date.now();
      d.timeout = setTimeout(() => removeToast(id), d.remaining);
    });
  }, [removeToast]);

  useEffect(() => {
    return subscribe((event) => {
      if (event.type === "ADD") {
        setToasts((prev) => [event.toast, ...prev].slice(0, MAX_TOASTS + 1));
        startTimer(event.toast.id, event.toast.duration);
      } else if (event.type === "DISMISS") {
        removeToast(event.id);
      }
    });
  }, [startTimer, removeToast]);

  // Pause timers when tab is hidden
  useEffect(() => {
    const handle = () => {
      if (document.hidden) pauseTimers();
      else resumeTimers();
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [pauseTimers, resumeTimers]);

  const handleMouseEnter = () => {
    setExpanded(true);
    pauseTimers();
  };

  const handleMouseLeave = () => {
    setExpanded(false);
    resumeTimers();
  };

  const onHeight = useCallback((id, h) => {
    if (heights.current[id] !== h) {
      heights.current[id] = h;
      forceUpdate((n) => n + 1);
    }
  }, []);

  const getExpandedY = (index, visibleToasts) => {
    let y = 0;
    for (let i = 0; i < index; i++) {
      y += (heights.current[visibleToasts[i].id] ?? 56) + EXPANDED_GAP;
    }
    return y;
  };

  const visibleToasts = toasts.slice(0, MAX_TOASTS);
  if (visibleToasts.length === 0) return null;

  return (
    <div
      className="toaster"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {visibleToasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          total={visibleToasts.length}
          expanded={expanded}
          expandedY={getExpandedY(index, visibleToasts)}
          dismiss={removeToast}
          onHeight={onHeight}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, index, expanded, expandedY, dismiss, onHeight }) {
  const innerRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const isDragging = useRef(false);
  const pointerStart = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      onHeight(toast.id, el.offsetHeight);
    });
    ro.observe(el);
    onHeight(toast.id, el.offsetHeight);
    return () => ro.disconnect();
  }, [toast.id, onHeight]);

  const handlePointerDown = (e) => {
    if (isDragging.current) return;
    pointerStart.current = { x: e.clientX, time: Date.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    setDragX(Math.max(0, dx));
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current || !pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dt = Date.now() - pointerStart.current.time;
    const velocity = Math.abs(dx) / dt;
    if (dx > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY) {
      dismiss(toast.id);
    } else {
      setDragX(0);
    }
    isDragging.current = false;
    pointerStart.current = null;
  };

  const collapsedY = index * COLLAPSED_Y_STEP;
  const collapsedScale = 1 - index * COLLAPSED_SCALE_STEP;

  // Wrapper handles stacking position + drag + removal exit
  const wrapperTransform = toast.removing
    ? `translateX(110%)`
    : expanded
    ? `translateX(${dragX}px) translateY(-${expandedY}px)`
    : `translateX(${dragX}px) translateY(-${collapsedY}px) scale(${collapsedScale})`;

  const wrapperTransition = isDragging.current
    ? "none"
    : toast.removing
    ? "transform 350ms cubic-bezier(0.23, 1, 0.32, 1), opacity 350ms ease"
    : "transform 400ms cubic-bezier(0.23, 1, 0.32, 1)";

  return (
    <div
      className="toast-wrapper"
      style={{
        zIndex: MAX_TOASTS - index,
        transform: wrapperTransform,
        opacity: toast.removing ? 0 : undefined,
        transition: wrapperTransition,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div ref={innerRef} className="toast" data-type={toast.type}>
        {toast.type !== "default" && (
          <span className="toast-icon" data-type={toast.type}>
            {toast.type === "success" ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M2.5 7.5l3.5 3.5 6.5-7"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3 3l9 9M12 3l-9 9"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        )}
        <span className="toast-message">{toast.message}</span>
        <button
          className="toast-close"
          onClick={() => dismiss(toast.id)}
          aria-label="Dismiss notification"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M2 2l9 9M11 2l-9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
