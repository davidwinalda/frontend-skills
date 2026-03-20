import Link from "next/link";

const SKILLS = [
  {
    href: "/emil-kowalski",
    label: "Emil Kowalski Skill",
    description:
      "Motion, micro-interactions, and UI polish — toast, drawer, dropdown, and page transitions.",
  },
  {
    href: "/shadcn",
    label: "shadcn/ui Skill",
    description:
      "Component showcase with login form, dialog, kanban board, analytics dashboard, artist page, and restaurant menu.",
  },
];

export default function RootPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-10 px-8 py-24">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Home
          </h1>
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            An experimental site for implementing and exploring{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              skills in Claude Code
            </span>
            , testing how skills shape UI behaviour, interactions, and component
            output.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Skills
          </p>
          <div className="flex flex-col gap-2">
            {SKILLS.map((skill) => (
              <Link
                key={skill.href}
                href={skill.href}
                className="group flex flex-col gap-1 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <span className="text-sm font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                  {skill.label} →
                </span>
                <span className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {skill.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
