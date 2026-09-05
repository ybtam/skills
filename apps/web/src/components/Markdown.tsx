import ReactMarkdown, { defaultUrlTransform } from "react-markdown";

import { standards } from "../content/generated";
import { withBase } from "../lib/site-path";

export function Markdown({ children, source }: { children: string; source: string }) {
  return (
    <ReactMarkdown
      components={{ h1: ({ children }) => <h2>{children}</h2> }}
      urlTransform={(url) => {
        const match = /^(?:references\/)?([a-z-]+)\.md(#.*)?$/.exec(url);
        if (!match) return defaultUrlTransform(url);
        return standards.some(({ slug }) => slug === match[1])
          ? withBase(`/standards/${match[1]}${match[2] ?? ""}`)
          : new URL(url, `https://github.com/ybtam/skills/blob/main/${source}`).href;
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
