import ReactMarkdown, { defaultUrlTransform } from "react-markdown";

import { standards } from "../content/generated";
import { withBase } from "../lib/site-path";

export function Markdown({ children, source }: { children: string; source: string }) {
  const normalizedSource = source.replaceAll("\\", "/");
  const sourceUrl = new URL(normalizedSource, "https://github.com/ybtam/skills/blob/main/");
  const assetsUrl = new URL("assets/", sourceUrl);

  return (
    <ReactMarkdown
      components={{ h1: ({ children }) => <h2>{children}</h2> }}
      urlTransform={(url) => {
        const match = /^(?:references\/)?([a-z-]+)\.md(#.*)?$/.exec(url);
        const assetUrl =
          normalizedSource.startsWith("skills/") && url.startsWith("assets/")
            ? new URL(url, sourceUrl)
            : undefined;
        if (
          assetUrl?.origin === sourceUrl.origin &&
          assetUrl.pathname.startsWith(assetsUrl.pathname)
        )
          return assetUrl.href;
        if (!match) return defaultUrlTransform(url);
        return standards.some(({ slug }) => slug === match[1])
          ? withBase(`/standards/${match[1]}${match[2] ?? ""}`)
          : new URL(url, sourceUrl).href;
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
