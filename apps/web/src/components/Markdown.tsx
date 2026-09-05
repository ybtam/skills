import ReactMarkdown, { defaultUrlTransform } from "react-markdown";

import { withBase } from "../lib/site-path";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{ h1: ({ children }) => <h2>{children}</h2> }}
      urlTransform={(url) => {
        const match = /^(?:references\/)?([a-z-]+)\.md(#.*)?$/.exec(url);
        return match
          ? withBase(`/standards/${match[1]}${match[2] ?? ""}`)
          : defaultUrlTransform(url);
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
