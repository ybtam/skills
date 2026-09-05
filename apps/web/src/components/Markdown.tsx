import ReactMarkdown, { defaultUrlTransform } from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{ h1: ({ children }) => <h2>{children}</h2> }}
      urlTransform={(url) => {
        const match = /^(?:references\/)?([a-z-]+)\.md(#.*)?$/.exec(url);
        return match ? `/standards/${match[1]}${match[2] ?? ""}` : defaultUrlTransform(url);
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
