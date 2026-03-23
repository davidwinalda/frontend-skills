"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Inbox,
  HelpCircle,
  Layers,
  UserPlus,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Customers", badge: 12 },
  { icon: BarChart2, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: Inbox, label: "Inbox", badge: 3 },
];

const NAV_BOTTOM = [
  { icon: HelpCircle, label: "Help" },
  { icon: Settings, label: "Settings" },
];

// ─── User menu items ──────────────────────────────────────────────────────────

const USER_MENU_ITEMS = [
  { icon: User, label: "Profile" },
  { icon: CreditCard, label: "Billing" },
  { icon: Settings, label: "Settings" },
];

// ─── Stats ───────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Revenue",
    value: "$124,800",
    change: "+18.2%",
    up: true,
    goodUp: true,
    icon: DollarSign,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    label: "Total Users",
    value: "48,295",
    change: "+12.5%",
    up: true,
    goodUp: true,
    icon: Users,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    label: "Signups",
    value: "3,842",
    change: "+24.1%",
    up: true,
    goodUp: true,
    icon: UserPlus,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    label: "Churn Rate",
    value: "2.4%",
    change: "−0.8%",
    up: false,
    goodUp: false,
    icon: TrendingDown,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
  },
];

// ─── Recent activity ─────────────────────────────────────────────────────────

const ACTIVITY = [
  {
    name: "Sarah Johnson",
    action: "Completed order #4521",
    time: "2m ago",
    initials: "SJ",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Mark Davis",
    action: "Submitted support ticket",
    time: "14m ago",
    initials: "MD",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Emily Chen",
    action: "Upgraded to Pro plan",
    time: "1h ago",
    initials: "EC",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Alex Torres",
    action: "Cancelled subscription",
    time: "2h ago",
    initials: "AT",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Jordan Lee",
    action: "New signup via referral",
    time: "3h ago",
    initials: "JL",
    color: "bg-amber-100 text-amber-700",
  },
];

// ─── Transactions ────────────────────────────────────────────────────────────

const TRANSACTIONS = [
  { id: "TXN-4521", customer: "Sarah Johnson",  initials: "SJ", avatarColor: "bg-violet-100 text-violet-700",  amount: 249.00,   status: "paid",     date: "2026-03-22" },
  { id: "TXN-4520", customer: "Mark Davis",     initials: "MD", avatarColor: "bg-blue-100 text-blue-700",      amount: 89.00,    status: "pending",  date: "2026-03-22" },
  { id: "TXN-4519", customer: "Emily Chen",     initials: "EC", avatarColor: "bg-emerald-100 text-emerald-700",amount: 599.00,   status: "paid",     date: "2026-03-21" },
  { id: "TXN-4518", customer: "Alex Torres",    initials: "AT", avatarColor: "bg-rose-100 text-rose-700",      amount: 149.00,   status: "refunded", date: "2026-03-21" },
  { id: "TXN-4517", customer: "Jordan Lee",     initials: "JL", avatarColor: "bg-amber-100 text-amber-700",    amount: 399.00,   status: "paid",     date: "2026-03-20" },
  { id: "TXN-4516", customer: "Priya Patel",    initials: "PP", avatarColor: "bg-pink-100 text-pink-700",      amount: 79.00,    status: "failed",   date: "2026-03-20" },
  { id: "TXN-4515", customer: "James Wilson",   initials: "JW", avatarColor: "bg-indigo-100 text-indigo-700",  amount: 1299.00,  status: "paid",     date: "2026-03-19" },
  { id: "TXN-4514", customer: "Lena Müller",    initials: "LM", avatarColor: "bg-teal-100 text-teal-700",      amount: 199.00,   status: "pending",  date: "2026-03-19" },
  { id: "TXN-4513", customer: "Carlos Reyes",   initials: "CR", avatarColor: "bg-orange-100 text-orange-700",  amount: 449.00,   status: "paid",     date: "2026-03-18" },
  { id: "TXN-4512", customer: "Aisha Brown",    initials: "AB", avatarColor: "bg-lime-100 text-lime-700",      amount: 329.00,   status: "paid",     date: "2026-03-18" },
];

const STATUS_STYLES = {
  paid:     { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  pending:  { badge: "bg-amber-50 text-amber-700",     dot: "bg-amber-400"   },
  failed:   { badge: "bg-rose-50 text-rose-600",       dot: "bg-rose-500"    },
  refunded: { badge: "bg-zinc-100 text-zinc-500",      dot: "bg-zinc-400"    },
};

function fmtAmount(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(s) {
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ─── Revenue area chart ───────────────────────────────────────────────────────

const REVENUE_DATA = [
  { month: "Jan", value: 68000 },
  { month: "Feb", value: 72000 },
  { month: "Mar", value: 78000 },
  { month: "Apr", value: 74000 },
  { month: "May", value: 82000 },
  { month: "Jun", value: 91000 },
  { month: "Jul", value: 88000 },
  { month: "Aug", value: 95000 },
  { month: "Sep", value: 104000 },
  { month: "Oct", value: 98000 },
  { month: "Nov", value: 112000 },
  { month: "Dec", value: 124800 },
];

const VW = 520;
const VH = 140;
const CT = 6;
const CB = 130;

function buildAreaPaths(data) {
  const vals = data.map((d) => d.value);
  const minV = Math.min(...vals) * 0.88;
  const maxV = Math.max(...vals) * 1.05;
  const n = data.length;
  const tension = 0.35;

  const pts = data.map((d, i) => ({
    x: parseFloat(((i / (n - 1)) * VW).toFixed(2)),
    y: parseFloat(
      (CT + (1 - (d.value - minV) / (maxV - minV)) * (CB - CT)).toFixed(2)
    ),
  }));

  let line = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const t = tension;
    const cp1x = (p1.x + (p2.x - p0.x) * t).toFixed(2);
    const cp1y = (p1.y + (p2.y - p0.y) * t).toFixed(2);
    const cp2x = (p2.x - (p3.x - p1.x) * t).toFixed(2);
    const cp2y = (p2.y - (p3.y - p1.y) * t).toFixed(2);
    line += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  const area = `${line} L ${VW},${VH} L 0,${VH} Z`;
  return { line, area, pts };
}

const { line: revenueLinePath, area: revenueAreaPath, pts: revenuePts } =
  buildAreaPaths(REVENUE_DATA);

// ─── Traffic sources donut ────────────────────────────────────────────────────

const TRAFFIC_SOURCES = [
  { label: "Organic Search", value: 42, color: "#18181b" },
  { label: "Direct", value: 28, color: "#6366f1" },
  { label: "Social Media", value: 18, color: "#8b5cf6" },
  { label: "Referral", value: 8, color: "#a78bfa" },
  { label: "Email", value: 4, color: "#c4b5fd" },
];

const DONUT_R = 54;
const DONUT_C = 2 * Math.PI * DONUT_R;

const donutSegments = (() => {
  let accumulated = 0;
  return TRAFFIC_SOURCES.map((s) => {
    const startAngle = (accumulated / 100) * 360 - 90;
    const dashLen = Math.max(0, (s.value / 100) * DONUT_C - 2);
    accumulated += s.value;
    return { ...s, dashLen, gap: DONUT_C - dashLen, startAngle };
  });
})();

// ─── Shared styles ────────────────────────────────────────────────────────────

const menuPopupClass = cn(
  "z-50 min-w-[176px] rounded-xl p-1.5",
  "bg-white outline-none",
  "shadow-lg shadow-black/8 ring-1 ring-black/8",
  "transition-[opacity,transform] duration-150 ease-out",
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.97]",
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.97]",
);

const menuItemClass = cn(
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2",
  "text-sm text-zinc-600 cursor-default select-none outline-none",
  "transition-colors duration-100",
  "data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-800",
);

// ─── Component ───────────────────────────────────────────────────────────────

export default function JakubkrehlelAndIbelickPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [txSearch, setTxSearch] = useState("");
  const [txSort, setTxSort] = useState({ key: "date", dir: "desc" });

  function handleTxSort(key) {
    setTxSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  const txRows = useMemo(() => {
    const query = txSearch.toLowerCase();
    return TRANSACTIONS
      .filter((tx) => tx.customer.toLowerCase().includes(query))
      .sort((a, b) => {
        const d = txSort.dir === "asc" ? 1 : -1;
        if (txSort.key === "amount") return d * (a.amount - b.amount);
        const av = a[txSort.key] ?? "";
        const bv = b[txSort.key] ?? "";
        return d * av.localeCompare(bv);
      });
  }, [txSearch, txSort]);

  const collapseStyle = {
    opacity: collapsed ? 0 : 1,
    transform: collapsed ? "translateX(-6px)" : "translateX(0px)",
    transition: "opacity 220ms ease-out, transform 220ms ease-out",
    pointerEvents: collapsed ? "none" : "auto",
  };

  return (
    <div className="relative flex h-dvh bg-zinc-50 antialiased overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className="relative flex flex-col bg-white shrink-0 overflow-hidden"
        style={{
          width: collapsed ? 64 : 240,
          transition: "width 300ms ease-out",
          boxShadow: "1px 0 0 0 rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 flex items-center justify-center shrink-0 rounded-lg bg-zinc-900 text-white">
              <Layers size={15} strokeWidth={2} />
            </div>
            <span
              className="font-semibold text-sm text-zinc-900 whitespace-nowrap"
              style={collapseStyle}
            >
              Wavelength
            </span>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col flex-1 gap-0.5 px-2 py-1 overflow-hidden">
          {NAV_ITEMS.map(({ icon: Icon, label, active, badge }) => (
            <button
              key={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center h-9 rounded-lg transition-[background-color,transform] duration-150 ease-out active:scale-[0.96]",
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              )}
              style={{ paddingLeft: 10, paddingRight: 10, gap: 10 }}
              aria-label={label}
            >
              <Icon size={16} className="shrink-0" strokeWidth={active ? 2.5 : 2} />
              <span
                className="text-sm font-medium whitespace-nowrap flex-1 text-left"
                style={collapseStyle}
              >
                {label}
              </span>
              {badge != null && (
                <span
                  className={cn(
                    "text-xs font-semibold rounded-full px-1.5 py-0.5 shrink-0",
                    active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                  )}
                  style={{
                    opacity: collapsed ? 0 : 1,
                    transition: "opacity 180ms ease",
                    fontVariantNumeric: "tabular-nums",
                    pointerEvents: "none",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom nav */}
        <div
          className="flex flex-col gap-0.5 px-2 py-2"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          {NAV_BOTTOM.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center h-9 rounded-lg text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-[background-color,transform] duration-150 active:scale-[0.96]"
              style={{ paddingLeft: 10, paddingRight: 10, gap: 10 }}
              aria-label={label}
            >
              <Icon size={16} className="shrink-0" strokeWidth={2} />
              <span className="text-sm font-medium whitespace-nowrap" style={collapseStyle}>
                {label}
              </span>
            </button>
          ))}

          {/* Sidebar user menu */}
          <Menu.Root>
            <Menu.Trigger
              className={cn(
                "w-full flex items-center h-10 rounded-lg text-left",
                "hover:bg-zinc-50 transition-[background-color,transform] duration-150 ease-out active:scale-[0.96]",
                "outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
              )}
              style={{ paddingLeft: 8, paddingRight: 8, gap: 10, marginTop: 2, minHeight: 40 }}
              aria-label="User menu"
            >
              <div
                className="size-7 shrink-0 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold"
                style={{ outline: "1.5px solid rgba(0,0,0,0.08)", outlineOffset: 1 }}
              >
                DW
              </div>
              <div className="flex flex-col min-w-0 text-left" style={collapseStyle}>
                <span className="text-xs font-medium text-zinc-900 truncate leading-snug">
                  David W.
                </span>
                <span className="text-xs text-zinc-400 truncate leading-snug">
                  Pro Plan
                </span>
              </div>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner side="top" align="start" sideOffset={6}>
                <Menu.Popup
                  className={menuPopupClass}
                  style={{ transformOrigin: "var(--transform-origin)" }}
                >
                  <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                    <p className="text-xs font-medium text-zinc-900">David W.</p>
                    <p className="text-xs text-zinc-400">david@wavelength.app</p>
                  </div>
                  {USER_MENU_ITEMS.map(({ icon: Icon, label }) => (
                    <Menu.Item key={label} className={menuItemClass}>
                      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
                      {label}
                    </Menu.Item>
                  ))}
                  <Menu.Separator className="my-1.5 h-px bg-zinc-100 mx-1.5" />
                  <Menu.Item className={cn(menuItemClass, "text-rose-600 data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700")}>
                    <LogOut size={14} strokeWidth={1.75} aria-hidden="true" />
                    Sign out
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </aside>

      {/* Collapse toggle — outside aside so overflow:hidden doesn't clip it */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="group absolute z-20 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-[color] duration-150"
        style={{
          width: 40,
          height: 40,
          left: 44,
          top: 8,
          transform: collapsed ? "translateX(0)" : "translateX(176px)",
          transition: "transform 300ms ease-out, color 150ms ease",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <span
          className="flex items-center justify-center rounded-full bg-white group-active:scale-[0.96] transition-[transform] duration-150 ease-out"
          style={{
            width: 24,
            height: 24,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <ChevronLeft
            size={12}
            strokeWidth={2.5}
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 300ms ease-out",
            }}
          />
        </span>
      </button>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center shrink-0 h-14 px-6 gap-3 bg-white"
          style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.06)" }}
        >
          <div className="flex-1 min-w-0">
            <h1
              className="text-sm font-semibold text-zinc-900"
              style={{ textWrap: "balance" }}
            >
              Dashboard
            </h1>
          </div>

          {/* Search */}
          <div className="relative flex items-center">
            <Search
              size={14}
              className="absolute left-3 text-zinc-400 pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="search"
              id="header-search"
              aria-label="Search"
              placeholder="Search..."
              className="h-9 w-52 rounded-lg bg-zinc-50 pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-[background-color,box-shadow] duration-150"
              style={{
                boxShadow: "0 0 0 1px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.03)",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow =
                  "0 0 0 1px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.05), 0 0 0 3px rgba(0,0,0,0.06)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow =
                  "0 0 0 1px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.03)";
              }}
            />
          </div>

          {/* Notification bell */}
          <Popover.Root>
            <Popover.Trigger
              className={cn(
                "relative size-9 flex items-center justify-center rounded-lg",
                "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50",
                "transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
                "outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
              )}
              aria-label="Notifications"
            >
              <Bell size={16} strokeWidth={2} />
              <span
                className="absolute top-1.5 right-1.5 size-[7px] rounded-full bg-blue-500"
                style={{ outline: "2px solid white" }}
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner side="bottom" align="end" sideOffset={8}>
                <Popover.Popup
                  className={cn(
                    "z-50 w-80 rounded-xl outline-none",
                    "bg-white shadow-lg shadow-black/8 ring-1 ring-black/8",
                    "transition-[opacity,transform] duration-150 ease-out",
                    "data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.97]",
                    "data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.97]",
                  )}
                  style={{ transformOrigin: "var(--transform-origin)" }}
                >
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-100">
                    <Popover.Title className="text-sm font-semibold text-zinc-900">
                      Notifications
                    </Popover.Title>
                    <span className="text-xs font-medium text-blue-600 cursor-pointer">
                      Mark all read
                    </span>
                  </div>
                  <div className="flex flex-col divide-y divide-zinc-50 py-1">
                    {ACTIVITY.map(({ name, action, time, initials, color }, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors duration-100 cursor-default">
                        <div
                          className={cn("size-7 flex items-center justify-center rounded-full text-xs font-semibold shrink-0 mt-0.5", color)}
                          style={{ outline: "1.5px solid rgba(0,0,0,0.06)", outlineOffset: 1 }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-800 leading-snug">{name}</p>
                          <p className="text-xs text-zinc-500 leading-snug mt-0.5">{action}</p>
                        </div>
                        <span className="text-xs text-zinc-400 shrink-0 mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>

          {/* Header user menu */}
          <Menu.Root>
            <Menu.Trigger
              className={cn(
                "size-8 flex items-center justify-center rounded-full bg-violet-500",
                "text-white text-xs font-semibold shrink-0",
                "hover:opacity-90 transition-[opacity,transform] duration-150 active:scale-[0.96]",
                "outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1",
              )}
              style={{ outline: "1.5px solid rgba(0,0,0,0.08)", outlineOffset: 1 }}
              aria-label="User menu"
            >
              DW
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner side="bottom" align="end" sideOffset={8}>
                <Menu.Popup
                  className={menuPopupClass}
                  style={{ transformOrigin: "var(--transform-origin)" }}
                >
                  <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                    <p className="text-xs font-medium text-zinc-900">David W.</p>
                    <p className="text-xs text-zinc-400">david@wavelength.app</p>
                  </div>
                  {USER_MENU_ITEMS.map(({ icon: Icon, label }) => (
                    <Menu.Item key={label} className={menuItemClass}>
                      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
                      {label}
                    </Menu.Item>
                  ))}
                  <Menu.Separator className="my-1.5 h-px bg-zinc-100 mx-1.5" />
                  <Menu.Item className={cn(menuItemClass, "text-rose-600 data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700")}>
                    <LogOut size={14} strokeWidth={1.75} aria-hidden="true" />
                    Sign out
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Heading */}
          <div className="mb-6 stagger-card" style={{ animationDelay: "0ms" }}>
            <p className="text-xs font-medium text-zinc-400 uppercase mb-1">
              Overview
            </p>
            <h2
              className="text-xl font-semibold text-zinc-900"
              style={{ textWrap: "balance" }}
            >
              Good morning, David
            </h2>
            <p
              className="text-sm text-zinc-500 mt-1 leading-relaxed"
              style={{ textWrap: "pretty" }}
            >
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 gap-3 mb-5 lg:grid-cols-4">
            {STATS.map(
              ({ label, value, change, up, goodUp, icon: Icon, iconColor, iconBg }, i) => {
                const isGood = up === goodUp;
                const changeColor = isGood ? "text-emerald-600" : "text-rose-500";
                const changeBg = isGood ? "bg-emerald-50" : "bg-rose-50";
                return (
                  <div
                    key={label}
                    className="bg-white rounded-xl p-5 stagger-card dashboard-card"
                    style={{ animationDelay: `${80 + i * 65}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-zinc-500">{label}</span>
                      <div
                        className={cn("flex items-center justify-center rounded-lg", iconBg, iconColor)}
                        style={{ width: 30, height: 30 }}
                      >
                        <Icon size={14} strokeWidth={2} />
                      </div>
                    </div>

                    <p
                      className="text-3xl font-bold text-zinc-900 tracking-tight leading-none mb-2.5"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {value}
                    </p>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
                          changeColor,
                          changeBg,
                        )}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {up ? (
                          <TrendingUp size={11} strokeWidth={2.5} />
                        ) : (
                          <TrendingDown size={11} strokeWidth={2.5} />
                        )}
                        {change}
                      </span>
                      <span className="text-xs text-zinc-400">vs last mo.</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {/* Revenue area chart */}
            <div
              className="lg:col-span-3 bg-white rounded-xl p-5 stagger-card dashboard-card"
              style={{ animationDelay: "380ms" }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900" style={{ textWrap: "balance" }}>
                    Revenue
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Jan – Dec 2025</p>
                </div>
                <div className="text-right">
                  <p
                    className="text-lg font-bold text-zinc-900 tracking-tight leading-none"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    $124,800
                  </p>
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp size={11} strokeWidth={2.5} />
                    +18.2%
                  </span>
                </div>
              </div>

              <div className="w-full relative" style={{ height: VH }}>
                <svg
                  viewBox={`0 0 ${VW} ${VH}`}
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                  style={{ display: "block" }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                      <stop offset="85%" stopColor="#10b981" stopOpacity="0.03" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((frac) => (
                    <line
                      key={frac}
                      x1={0} y1={CT + frac * (CB - CT)}
                      x2={VW} y2={CT + frac * (CB - CT)}
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth="1"
                    />
                  ))}
                  <path d={revenueAreaPath} fill="url(#revenueGrad)" />
                  <path
                    d={revenueLinePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={revenuePts[revenuePts.length - 1].x}
                    cy={revenuePts[revenuePts.length - 1].y}
                    r="4"
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="flex items-center mt-1.5">
                {REVENUE_DATA.map((d) => (
                  <span
                    key={d.month}
                    className="flex-1 text-center text-zinc-400"
                    style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}
                  >
                    {d.month}
                  </span>
                ))}
              </div>
            </div>

            {/* Traffic sources donut */}
            <div
              className="lg:col-span-2 bg-white rounded-xl p-5 stagger-card dashboard-card"
              style={{ animationDelay: "450ms" }}
            >
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-zinc-900" style={{ textWrap: "balance" }}>
                  Traffic Sources
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">This month</p>
              </div>

              <div className="flex items-center gap-5">
                <div className="shrink-0">
                  <svg viewBox="0 0 160 160" width="120" height="120" style={{ display: "block" }}>
                    <circle cx="80" cy="80" r={DONUT_R} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="20" />
                    {donutSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="80" cy="80"
                        r={DONUT_R}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="20"
                        strokeDasharray={`${seg.dashLen} ${DONUT_C - seg.dashLen}`}
                        strokeLinecap="butt"
                        transform={`rotate(${seg.startAngle}, 80, 80)`}
                      />
                    ))}
                    <text x="80" y="75" textAnchor="middle" fontSize="17" fontWeight="700" fill="#18181b" fontFamily="system-ui, sans-serif" style={{ fontVariantNumeric: "tabular-nums" }}>
                      48.3k
                    </text>
                    <text x="80" y="91" textAnchor="middle" fontSize="10" fill="rgba(0,0,0,0.38)" fontFamily="system-ui, sans-serif">
                      visitors
                    </text>
                  </svg>
                </div>

                <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                  {TRAFFIC_SOURCES.map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span
                        className="shrink-0 rounded-sm"
                        style={{ width: 8, height: 8, backgroundColor: color, outline: "1px solid rgba(0,0,0,0.08)" }}
                      />
                      <span className="text-xs text-zinc-600 truncate flex-1 min-w-0">{label}</span>
                      <span className="text-xs font-semibold text-zinc-800 shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div
            className="mt-4 bg-white rounded-xl p-5 stagger-card dashboard-card"
            style={{ animationDelay: "520ms" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900" style={{ textWrap: "balance" }}>
                  Recent Activity
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Latest events</p>
              </div>
              <button className="flex items-center gap-1 min-h-[40px] px-1 text-xs text-zinc-400 hover:text-zinc-700 transition-[color,transform] duration-150 ease-out active:scale-[0.96]">
                View all
                <ArrowUpRight size={12} strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-zinc-50">
              {ACTIVITY.map(({ name, action, time, initials, color }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 stagger-card"
                  style={{ animationDelay: `${580 + i * 50}ms` }}
                >
                  <div
                    className={cn("flex items-center justify-center rounded-full text-xs font-semibold shrink-0", color)}
                    style={{ width: 34, height: 34, outline: "1.5px solid rgba(0,0,0,0.06)", outlineOffset: 1 }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 truncate leading-snug">{name}</p>
                    <p className="text-xs text-zinc-500 truncate leading-snug mt-0.5">{action}</p>
                  </div>
                  <span
                    className="text-xs text-zinc-400 shrink-0"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Transactions table ── */}
          <div
            className="mt-4 bg-white rounded-xl stagger-card dashboard-card overflow-hidden"
            style={{ animationDelay: "660ms" }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div>
                <h3 className="text-sm font-semibold text-zinc-900" style={{ textWrap: "balance" }}>
                  Recent Transactions
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {txRows.length} of {TRANSACTIONS.length} transactions
                </p>
              </div>

              {/* Transaction search */}
              <div className="relative flex items-center">
                <Search size={13} className="absolute left-3 text-zinc-400 pointer-events-none" strokeWidth={2} />
                <input
                  type="search"
                  aria-label="Search transactions by customer name"
                  placeholder="Search customer…"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="h-8 w-48 rounded-lg bg-zinc-50 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-[background-color,box-shadow] duration-150"
                  style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.03)" }}
                  onFocus={(e) => {
                    e.target.style.boxShadow =
                      "0 0 0 1px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.05), 0 0 0 3px rgba(0,0,0,0.06)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow =
                      "0 0 0 1px rgba(0,0,0,0.09), 0 1px 2px rgba(0,0,0,0.03)";
                  }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {[
                      { key: "customer", label: "Customer", cls: "pl-3 w-1/4" },
                      { key: "amount",   label: "Amount",   cls: "w-1/4" },
                      { key: "status",   label: "Status",   cls: "w-1/4" },
                      { key: "date",     label: "Date",     cls: "pr-3 w-1/4" },
                    ].map(({ key, label, cls }) => {
                      const active = txSort.key === key;
                      const iconKey = active ? `${key}-${txSort.dir}` : `${key}-neutral`;
                      const ariaSort = active
                        ? txSort.dir === "asc" ? "ascending" : "descending"
                        : "none";
                      return (
                        <th
                          key={key}
                          className={cn("text-xs font-medium text-zinc-400", cls)}
                          aria-sort={ariaSort}
                        >
                          <button
                            onClick={() => handleTxSort(key)}
                            className={cn(
                              "inline-flex items-center gap-1 h-10 rounded px-2",
                              "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]",
                              active
                                ? "text-zinc-700"
                                : "hover:text-zinc-600 hover:bg-zinc-50"
                            )}
                          >
                            {label}
                            <span key={iconKey} className="sort-icon">
                              {active ? (
                                txSort.dir === "asc" ? (
                                  <ChevronUp size={12} strokeWidth={2.5} />
                                ) : (
                                  <ChevronDown size={12} strokeWidth={2.5} />
                                )
                              ) : (
                                <ChevronsUpDown size={12} strokeWidth={2} className="text-zinc-300" />
                              )}
                            </span>
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {txRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-sm text-zinc-400">
                        No transactions match &ldquo;{txSearch}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    txRows.map((tx, i) => {
                      const s = STATUS_STYLES[tx.status];
                      return (
                        <tr
                          key={tx.id}
                          className="group transition-[background-color] duration-100 hover:bg-zinc-50/70"
                          style={
                            i < txRows.length - 1
                              ? { borderBottom: "1px solid rgba(0,0,0,0.05)" }
                              : undefined
                          }
                        >
                          <td className="pl-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn("flex items-center justify-center rounded-full text-xs font-semibold shrink-0", tx.avatarColor)}
                                style={{ width: 30, height: 30, outline: "1.5px solid rgba(0,0,0,0.06)", outlineOffset: 1 }}
                              >
                                {tx.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-800 truncate leading-snug">
                                  {tx.customer}
                                </p>
                                <p className="text-xs text-zinc-400 leading-snug" style={{ fontVariantNumeric: "tabular-nums" }}>
                                  {tx.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 text-sm font-semibold text-zinc-800" style={{ fontVariantNumeric: "tabular-nums" }}>
                            {fmtAmount(tx.amount)}
                          </td>

                          <td className="py-3.5">
                            <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", s.badge)}>
                              <span className={cn("size-1.5 rounded-full shrink-0", s.dot)} />
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </td>

                          <td className="pr-5 py-3.5 text-sm text-zinc-500" style={{ fontVariantNumeric: "tabular-nums" }}>
                            {fmtDate(tx.date)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-[color] duration-150"
            >
              ← Back to home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
