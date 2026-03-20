'use client';
import Dropdown from './dropdown/Dropdown';

const items = [
  {
    label: 'Edit',
    shortcut: '⌘E',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" />
      </svg>
    ),
  },
  {
    label: 'Duplicate',
    shortcut: '⌘D',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="7" height="7" rx="1.5" />
        <path d="M9 5V3.5C9 2.67 8.33 2 7.5 2H3.5C2.67 2 2 2.67 2 3.5V7.5C2 8.33 2.67 9 3.5 9H5" />
      </svg>
    ),
  },
  { separator: true },
  {
    label: 'Share',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 1V9M4 4L7 1L10 4" />
        <path d="M2.5 8V11.5C2.5 11.78 2.72 12 3 12H11C11.28 12 11.5 11.78 11.5 11.5V8" />
      </svg>
    ),
  },
  {
    label: 'Move to',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 10.5V5.5C1.5 4.95 1.95 4.5 2.5 4.5H5.5L7 3H11.5C12.05 3 12.5 3.45 12.5 4V10.5C12.5 11.05 12.05 11.5 11.5 11.5H2.5C1.95 11.5 1.5 11.05 1.5 10.5Z" />
      </svg>
    ),
  },
  { separator: true },
  {
    label: 'Delete',
    shortcut: '⌫',
    destructive: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4H12M5 4V2.5C5 2.22 5.22 2 5.5 2H8.5C8.78 2 9 2.22 9 2.5V4M10.5 4L10 11.5C10 11.78 9.78 12 9.5 12H4.5C4.22 12 4 11.78 4 11.5L3.5 4" />
      </svg>
    ),
  },
];

export default function DropdownDemo() {
  return <Dropdown trigger="Options" items={items} />;
}
