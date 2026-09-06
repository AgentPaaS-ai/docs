/**
 * Local Docusaurus plugin: emit raw Markdown for every docs page.
 *
 * For each source file under docs/, copy the .md (or .mdx) into the build
 * output at the same route path with a .md extension, so an HTTP agent can
 * fetch clean Markdown:
 *
 *   docs/security/threat-model.md  ->  <outDir>/security/threat-model.md
 *
 * The SPA HTML routes are untouched; this only ADDS sibling .md files.
 */
const fs = require('fs');
const path = require('path');

function walk(dir, base, out) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, path.join(base, entry.name), out);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      const rel = path.join(base, entry.name).replace(/\.mdx$/, '.md');
      out.push({src: full, rel});
    }
  }
}

module.exports = function rawMarkdownPlugin(context, options) {
  return {
    name: 'agentpaas-raw-markdown',
    async postBuild({outDir}) {
      const docsDir = path.join(context.siteDir, 'docs');
      const files = [];
      walk(docsDir, '', files);
      let written = 0;
      for (const {src, rel} of files) {
        const dest = path.join(outDir, rel);
        fs.mkdirSync(path.dirname(dest), {recursive: true});
        fs.copyFileSync(src, dest);
        written++;
      }
      console.log(`[raw-markdown] emitted ${written} .md files`);
    },
  };
};
