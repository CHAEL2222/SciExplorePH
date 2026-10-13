import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

// This public URL is bundled into the app. Provider secrets belong on the server.
const rawUrl = process.env.SCIEXPLORE_CHAT_URL?.trim() || "";
if (rawUrl) {
  const url = new URL(rawUrl);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error(
      "SCIEXPLORE_CHAT_URL must be an HTTPS origin, such as https://study.example.com",
    );
  }
}
const configPath = new URL("../src/assets/app-config.json", import.meta.url);
const original = await readFile(configPath);
try {
  await writeFile(
    configPath,
    JSON.stringify({ chatApiBaseUrl: rawUrl.replace(/\/$/, "") }) + "\n",
  );
  for (const args of [
    ["run", "build"],
    ["exec", "--", "cap", "sync"],
  ]) {
    const result = spawnSync(
      process.platform === "win32" ? "npm.cmd" : "npm",
      args,
      { stdio: "inherit" },
    );
    if (result.status !== 0)
      throw new Error(`Mobile preparation failed: npm ${args.join(" ")}`);
  }
} finally {
  await writeFile(configPath, original);
}
