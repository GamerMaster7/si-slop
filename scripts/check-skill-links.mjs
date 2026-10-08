#!/usr/bin/env node
// Guard for the "links break after install" class of bug.
//
// `npx skills add nutlope/hallmark` ships only the `skills/` folder (it is the
// only path in package.json `files`, and `npm pack` proves it), so a relative
// link that climbs out of `skills/` resolves to nothing for every user.
//
// Run: node scripts/check-skill-links.mjs   (or `npm run check:links`)
// Exit 0 when every link inside the skill resolves; exit 1 listing the ones that do not.

import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SKILLS = path.join(ROOT, "skills");
const LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;

const rel = (file) => path.relative(ROOT, file).split(path.sep).join("/");

async function* markdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* markdownFiles(full);
    else if (entry.name.endsWith(".md")) yield full;
  }
}

const problems = [];
let scanned = 0;

for await (const file of markdownFiles(SKILLS)) {
  scanned += 1;
  const lines = (await readFile(file, "utf8")).split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    for (const match of line.matchAll(LINK)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const bare = target.split(/[#?]/)[0];
      const resolved = path.resolve(path.dirname(file), bare);
      const repoPath = rel(resolved);
      if (!repoPath.startsWith("skills/")) {
        problems.push({
          where: `${rel(file)}:${index + 1}`,
          target,
          why: `escapes skills/ (resolves to ${repoPath}) — unreachable after install`,
        });
      } else if (!existsSync(resolved)) {
        problems.push({ where: `${rel(file)}:${index + 1}`, target, why: "target does not exist" });
      }
    }
  }
}

if (problems.length === 0) {
  console.log(`skill links OK — ${scanned} markdown file(s) checked, all links resolve from inside skills/`);
  process.exit(0);
}

console.error(`skill link check FAILED — ${problems.length} problem(s) in ${scanned} file(s):`);
for (const { where, target, why } of problems) {
  console.error(`  ${where}  ${target}\n      ${why}`);
}
console.error(
  "\nLinks inside skills/ must either stay inside skills/ or use an absolute URL\n" +
    "(https://github.com/Nutlope/hallmark/...), because only skills/ is published.",
);
process.exit(1);
