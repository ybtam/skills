import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";

import appStyles from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "YBTAM Skills — portable engineering workflows" },
      { name: "description", content: "Seven portable skills and the standards behind them." },
    ],
    links: [
      { rel: "stylesheet", href: appStyles },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="site-header">
          <Link to="/" className="brand">
            <span className="brand-mark">Y</span>
            <span>ybtam / skills</span>
          </Link>
          <nav aria-label="Main navigation">
            <Link to="/">Catalog</Link>
            <Link to="/standards">Standards</Link>
            <a href="https://github.com/ybtam/skills">GitHub ↗</a>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <span>Portable workflows for thoughtful teams.</span>
          <span>Source-backed · Built with Bun</span>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}
