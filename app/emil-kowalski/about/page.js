import Link from "next/link";
import ToastDemo from "@/app/components/ToastDemo";

export default function About() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-10 px-8 py-24">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            About
          </h1>
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Navigate between pages to see the transition animation in action — an implementation of the <span className="font-medium text-zinc-700 dark:text-zinc-300">emil-design-eng</span> skill.
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
            Navigation
          </p>
          <Link
            href="/emil-kowalski"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            ← Home
          </Link>
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
