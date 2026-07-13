const fs = require('fs');
const path = require('path');
const theme = require('../theme');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const resume = JSON.parse(fs.readFileSync(path.join(root, 'resume.json'), 'utf-8'));

// the theme renders exactly these sections; anything else would silently vanish
const RENDERED = new Set([
  '$schema', 'meta', 'basics', 'work', 'education', 'skills', 'projects',
  'references', 'certificates', 'languages', 'interests',
]);
for (const key of Object.keys(resume)) {
  const v = resume[key];
  if (!RENDERED.has(key) && (!Array.isArray(v) || v.length > 0)) {
    console.warn(`WARNING: resume.json section "${key}" is not rendered by the theme`);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), theme.render(resume));
fs.cpSync(path.join(root, 'static'), dist, { recursive: true });

const lastmod = (resume.meta && resume.meta.lastModified) || new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://santiago-mooser.com/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`);

console.log(`Built dist/ (${fs.readdirSync(dist).join(', ')})`);
console.log('NOTE: run "npm run pdf" after — build wipes dist/, including the PDFs.');
