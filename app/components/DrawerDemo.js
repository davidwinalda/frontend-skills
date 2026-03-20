"use client";

import { useState } from "react";
import Drawer from "./drawer/Drawer";

const items = [
  { label: "Profile", description: "Manage your account details" },
  { label: "Appearance", description: "Theme, font size, and display" },
  { label: "Notifications", description: "Alerts, emails, and reminders" },
  { label: "Privacy", description: "Data sharing and visibility" },
  { label: "Keyboard shortcuts", description: "Bindings and custom shortcuts" },
];

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="toast-demo-btn" onClick={() => setOpen(true)}>
        Open drawer
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title="Settings">
        <ul className="drawer-list">
          {items.map((item) => (
            <li key={item.label} className="drawer-list-item">
              <span className="drawer-list-label">{item.label}</span>
              <span className="drawer-list-desc">{item.description}</span>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
}
