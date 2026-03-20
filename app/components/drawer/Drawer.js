"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const VELOCITY_THRESHOLD = 0.4; // px/ms downward
const DISTANCE_THRESHOLD = 0.4; // fraction of drawer height
const DAMPING = 0.015;

export default function Drawer({ open, onClose, title, children }) {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState("closed"); // "closed" | "open" | "closing"
  const [mounted, setMounted] = useState(false);
  const [dragY, setDragY] = useState(0);

  const drawerRef = useRef(null);
  const contentRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setState("closed");
      // Double RAF: ensure DOM paints "closed" state before transitioning to "open"
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setState("open");
        });
      });
    } else if (visible) {
      setState("closing");
      const t = setTimeout(() => {
        setState("closed");
        setVisible(false);
        setDragY(0);
      }, 340);
      return () => clearTimeout(t);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (state !== "open" || !drawerRef.current) return;
    const el = drawerRef.current;
    const focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [state]);

  const handlePointerDown = useCallback((e) => {
    if (isDragging.current) return;
    const isHandle = e.target.closest("[data-drawer-handle]");
    const scrollTop = contentRef.current?.scrollTop ?? 0;
    if (!isHandle && scrollTop > 0) return;
    dragStart.current = { y: e.clientY, time: Date.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current || !dragStart.current) return;
    const rawDy = e.clientY - dragStart.current.y;
    if (rawDy < 0) {
      setDragY(rawDy / (1 + Math.abs(rawDy) * DAMPING));
    } else {
      setDragY(rawDy);
    }
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging.current || !dragStart.current) return;
    const rawDy = e.clientY - dragStart.current.y;
    const dt = Date.now() - dragStart.current.time;
    const velocity = rawDy / dt;
    const drawerHeight = drawerRef.current?.offsetHeight ?? 400;
    if (rawDy > drawerHeight * DISTANCE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      onClose();
    } else {
      setDragY(0);
    }
    isDragging.current = false;
    dragStart.current = null;
  }, [onClose]);

  if (!mounted || !visible) return null;

  const drawerHeight = drawerRef.current?.offsetHeight ?? 400;
  const progress = Math.max(0, dragY) / drawerHeight;
  const backdropOpacity = state === "closing" ? 0 : Math.max(0, 1 - progress);

  const drawerTransform = dragY !== 0 ? `translateY(${dragY}px)` : undefined;
  const drawerTransition = isDragging.current ? "none" : undefined;

  return createPortal(
    <div className="drawer-root">
      <div
        className="drawer-backdrop"
        data-state={state}
        style={{ opacity: backdropOpacity }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="drawer"
        data-state={state}
        style={{ transform: drawerTransform, transition: drawerTransition }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="drawer-handle-area" data-drawer-handle="">
          <div className="drawer-handle" aria-hidden="true" />
        </div>

        <div className="drawer-header">
          <h2 className="drawer-title">{title}</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div ref={contentRef} className="drawer-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
