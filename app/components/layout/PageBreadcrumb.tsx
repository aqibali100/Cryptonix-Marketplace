import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export default function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex min-w-0 items-center text-[12px] text-[#69748a]"
    >
      <ol className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/[.07] bg-white/[.025] px-3 py-2 shadow-[inset_0_1px_rgba(255,255,255,.025)] backdrop-blur-xl">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li className="flex min-w-0 items-center gap-1.5" key={`${item.label}-${index}`}>
              {index > 0 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-3 w-3 shrink-0 text-[#485267]"
                >
                  <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {item.href && !current ? (
                <Link href={item.href} className="truncate px-1 transition hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className={`truncate px-1 ${current ? "font-medium text-[#c0c7d4]" : ""}`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
