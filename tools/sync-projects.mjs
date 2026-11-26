/** Update the static featured markup from the shared catalogue. No build server required. */
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {ARCHIVE_PROJECTS} from '../data/projects.mjs';

const path = fileURLToPath(new URL('../index.html', import.meta.url));
const source = readFileSync(path, 'utf8');
const escape = value => String(value).replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const catalogue = new Map(ARCHIVE_PROJECTS.map(project => [project.id, project]));
const result = source.replace(
  /<article class="project-card" data-project="([^"]+)"[^>]*>[\s\S]*?<\/article>/g,
  (card, id) => {
    const project = catalogue.get(id);
    if (!project) throw new Error('Unknown featured project: ' + id);
    const href = 'projects.html?view=grid#project/' + encodeURIComponent(id);
    const artwork = escape('assets/' + (project.featuredArtwork || project.thumbnail || project.cover));
    const cover = escape('assets/' + (project.thumbnail || project.cover));
    const title = project.featuredTitle.split('\n').map(escape).join('<br>');
    return card.replace(/(<h3 class="card-title">)[\s\S]*?(<\/h3>)/,
      (_, start, end) => start + title + end)
      .replace(/background-image:url\('[^']*'\)/, "background-image:url('" + cover + "')")
      .replace(/(<div class="card-image">[\s\S]*?<img src=")[^"]*"/,
        (_, start) => start + artwork + '"')
      .replace(/(<span class="card-category">)[\s\S]*?(<\/span>)/,
      (_, start, end) => start + escape(project.categoryLabel) + end)
      .replace(/(<span class="card-date">)[\s\S]*?(<\/span>)/,
        (_, start, end) => start + escape(project.year) + end)
      .replace(/href="projects.html[^"]*"/g, 'href="' + href + '"');
  },
);

if (process.argv.includes('--check')) {
  if (result !== source) throw new Error('Featured metadata is stale. Run node tools/sync-projects.mjs');
} else if (result !== source) {
  writeFileSync(path, result);
}
