import type { ReactNode } from "react";

export function StandardCard({
  title,
  source,
  children,
  href,
}: {
  title: string;
  source: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <article className="standard-card">
      <div>
        <p className="eyebrow">{source}</p>
        <h2>{title}</h2>
      </div>
      <p>{children}</p>
      <a href={href}>Read document ↗</a>
    </article>
  );
}
