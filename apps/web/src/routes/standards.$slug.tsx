import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Markdown } from "../components/Markdown";
import { standards } from "../content/generated";

export const Route = createFileRoute("/standards/$slug")({
  loader: ({ params }) => {
    const standard = standards.find((item) => item.slug === params.slug);
    if (!standard) throw notFound();
    return standard;
  },
  component: StandardDetails,
});
function StandardDetails() {
  const standard = Route.useLoaderData();
  return (
    <div className="detail-page page-shell">
      <Link className="back-link" to="/standards">
        ← Back to standards
      </Link>
      <div className="detail-heading">
        <p className="eyebrow">STANDARD · {standard.source}</p>
        <h1>{standard.title}</h1>
      </div>
      <article className="prose standard-prose">
        <Markdown source={standard.source}>{standard.body}</Markdown>
      </article>
    </div>
  );
}
