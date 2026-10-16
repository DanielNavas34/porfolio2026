import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rel = process.argv[2];
if (!rel) {
  console.error("Usage: node embed-snippet.mjs assets/code/03-php-login.php");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, rel);
const target = path.join(root, "js/code-snippets.js");
const key = rel.replace(/\\/g, "/");
const code = fs.readFileSync(source, "utf8");
let snippets = fs.readFileSync(target, "utf8");
const marker = `window.CODE_SNIPPETS[${JSON.stringify(key)}]`;
const idx = snippets.indexOf(marker);
if (idx !== -1) {
  const end = snippets.indexOf(";\n", idx);
  snippets = snippets.slice(0, idx) + snippets.slice(end + 2);
}
const injection = `\nwindow.CODE_SNIPPETS[${JSON.stringify(key)}] = ${JSON.stringify(code)};\n`;
fs.writeFileSync(target, snippets.trimEnd() + injection, "utf8");
console.log("OK embedded", key);
