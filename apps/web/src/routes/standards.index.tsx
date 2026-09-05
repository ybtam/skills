import { createFileRoute, Link } from "@tanstack/react-router";

import { standards, upstreamReferences } from "../content/generated";
import { StandardCard } from "../contexts/standards/features/read-standard/StandardCard";
import { withBase } from "../lib/site-path";

export const Route = createFileRoute("/standards/")({ component: Standards });
function Standards() {
  return (
    <div className="page-shell standards-page">
      <Link className="back-link" to="/">
        ← Back to catalog
      </Link>
      <div className="detail-heading">
        <p className="eyebrow">THE BASELINE</p>
        <h1>Standards that stay close to the work.</h1>
        <p>
          These documents are the maintained source of truth for the skills. They make decisions
          visible without turning a small repository into a framework.
        </p>
      </div>
      <div className="standards-grid">
        {standards.map((standard) => (
          <StandardCard
            key={standard.slug}
            title={standard.title}
            source={standard.source}
            href={withBase(`/standards/${standard.slug}`)}
          >
            {standard.body.replace(/^#.*\n/, "").slice(0, 260)}…
          </StandardCard>
        ))}
      </div>
      <section className="references">
        <p className="eyebrow">UPSTREAM REFERENCES</p>
        {upstreamReferences.map((reference) => (
          <a href={reference.url} key={reference.url}>
            {reference.name} ↗
          </a>
        ))}
      </section>
    </div>
  );
}
