import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "assets/code/02-express-api.js");
const target = path.join(root, "js/code-snippets.js");
const key = "assets/code/02-express-api.js";
const code = fs.readFileSync(source, "utf8");
let snippets = fs.readFileSync(target, "utf8");
if (snippets.includes(`"${key}"`)) {
  snippets = snippets.replace(
    new RegExp(`window\\.CODE_SNIPPETS\\["${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\] = [\\s\\S]*?;\\n?`),
    ""
  );
}
const injection = `\nwindow.CODE_SNIPPETS[${JSON.stringify(key)}] = ${JSON.stringify(code)};\n`;
if (!snippets.trimEnd().endsWith("};")) {
  throw new Error("code-snippets.js format unexpected");
}
snippets = snippets.trimEnd().slice(0, -2) + injection + "};\n";
fs.writeFileSync(target, snippets, "utf8");
console.log("OK embedded", key);
