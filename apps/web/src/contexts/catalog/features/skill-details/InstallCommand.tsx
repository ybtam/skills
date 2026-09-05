import { useState } from "react";

export function InstallCommand({ slug }: { slug: string }) {
  const command = `npx skills@latest add ybtam/skills --skill ${slug}`;
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus("Copied");
    } catch {
      setStatus("Select and copy the command above.");
    }
  }
  return (
    <div>
      <div className="install-command">
        <code>{command}</code>
        <button type="button" onClick={copy}>
          Copy
        </button>
      </div>
      <span role="status" className="copy-status">
        {status}
      </span>
    </div>
  );
}
