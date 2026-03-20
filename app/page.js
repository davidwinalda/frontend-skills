import Link from "next/link";
import ToastDemo from "./components/ToastDemo";
import DrawerDemo from "./components/DrawerDemo";
import DropdownDemo from "./components/DropdownDemo";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-10 px-8 py-24">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Home
          </h1>
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            UI components and interactions built with the <span className="font-medium text-zinc-700 dark:text-zinc-300">emil-design-eng</span> skill — exploring motion, micro-interactions, and thoughtful UI polish.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Toast
          </p>
          <ToastDemo />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Drawer
          </p>
          <DrawerDemo />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Dropdown
          </p>
          <DropdownDemo />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Navigation
          </p>
          <Link
            href="/about"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            About →
          </Link>
        </div>
      </main>
    </div>
  );
}
