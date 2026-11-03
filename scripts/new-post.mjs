// Starts a new post from blog/_template.md with today's date, as a draft.
// Usage: npm run new my-post-name

import { readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new my-post-name   (lowercase letters, digits and dashes)');
  process.exit(1);
}

const file = join(ROOT, 'blog', slug + '.md');
if (await access(file).then(() => true, () => false)) {
  console.error(`blog/${slug}.md already exists`);
  process.exit(1);
}

const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
const title = slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

const template = await readFile(join(ROOT, 'blog/_template.md'), 'utf8');
await writeFile(file, template
  .replace(/^title: .*$/m, `title: ${title}`)
  .replace(/^date: .*$/m, `date: ${today}`));

console.log(`Created blog/${slug}.md as a draft. Delete the "draft: true" line to publish it.`);
