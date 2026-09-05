import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Markdown } from "../components/Markdown";
import { skills } from "../content/generated";
import { InstallCommand } from "../contexts/catalog/features/skill-details/InstallCommand";

export const Route = createFileRoute("/skills/$slug")({
  loader: ({ params }) => {
    const skill = skills.find((item) => item.slug === params.slug);
    if (!skill) throw notFound();
    return skill;
  },
  component: SkillDetails,
});

function SkillDetails() {
  const skill = Route.useLoaderData();
  return (
    <div className="detail-page page-shell">
      <Link className="back-link" to="/">
        ← Back to catalog
      </Link>
      <div className="detail-heading">
        <p className="eyebrow">SKILL · v{skill.version}</p>
        <h1>{skill.title}</h1>
        <p>{skill.description}</p>
        <InstallCommand slug={skill.slug} />
      </div>
      <div className="detail-layout">
        <aside>
          <div className="aside-label">SOURCE</div>
          <code>{skill.source}</code>
          <a
            className="button button-dark"
            href={`https://github.com/ybtam/skills/blob/main/${skill.source}`}
          >
            View on GitHub ↗
          </a>
        </aside>
        <article className="prose">
          <Markdown>{skill.body}</Markdown>
        </article>
      </div>
    </div>
  );
}
