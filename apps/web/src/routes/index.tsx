import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { skills } from "../content/generated";
import { searchSkills } from "../contexts/catalog/features/browse-skills/searchSkills";

export const Route = createFileRoute("/")({ component: Catalog });

function Catalog() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => searchSkills(skills, query), [query]);
  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">OPEN SOURCE · REPOSITORY PRACTICE</p>
        <h1>
          Make the next change
          <br />
          <em>easier to reason about.</em>
        </h1>
        <p className="hero-copy">
          A small collection of portable skills for setting up, evolving, and maintaining modern
          repositories.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#catalog">
            Explore the catalog <span>↓</span>
          </a>
          <Link className="text-link" to="/standards">
            Read the standards →
          </Link>
        </div>
      </section>
      <section id="catalog" className="catalog-section">
        <div className="section-intro">
          <div>
            <p className="eyebrow">THE TOOLKIT</p>
            <h2>{skills.length} skills, one clear path.</h2>
          </div>
          <p>
            Each skill works on its own after installation. Together they guide a repository from
            first inspection to a healthy maintenance loop.
          </p>
        </div>
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills…"
            aria-label="Search skills"
          />
        </label>
        <div className="skill-grid">
          {filtered.map((skill, index) => (
            <Link
              className="skill-card"
              to="/skills/$slug"
              params={{ slug: skill.slug }}
              key={skill.slug}
            >
              <span className="card-number">0{index + 1}</span>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <span className="card-arrow">↗</span>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty">
            <strong>No skills found.</strong>
            <span>Try a broader search, such as “standards” or “dependencies”.</span>
          </div>
        )}
      </section>
      <section className="callout">
        <div>
          <p className="eyebrow">START HERE</p>
          <h2>Standards before scaffolding.</h2>
        </div>
        <p>
          Inspect what exists, make decisions explicit, then apply only what the project needs. The
          setup workflow keeps successful state and unfinished work distinct.
        </p>
        <Link className="button button-light" to="/skills/$slug" params={{ slug: "setup-repo" }}>
          Open setup-repo →
        </Link>
      </section>
    </div>
  );
}
