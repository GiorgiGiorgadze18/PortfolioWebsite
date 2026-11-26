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
    const href = 'projects.html?view=grid#project/' + encodeURIComponent(project.slug);
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

// Keep complete project descriptions in server-delivered semantic HTML.
const projectsPath = fileURLToPath(new URL('../projects.html', import.meta.url));
const projectsSource = readFileSync(projectsPath, 'utf8');
const summaries = ARCHIVE_PROJECTS.map(project => `<details class="project-summary" id="project-${escape(project.slug)}"><summary>${escape(project.name)}</summary><p>${escape(project.categoryLabel)} · ${escape(project.year)}</p><p>${escape(project.description)}</p><a href="?view=grid#project/${encodeURIComponent(project.slug)}">Explore ${escape(project.name)}</a></details>`).join('\n');
const production = 'https://giorgigiorgadze18.github.io/PortfolioWebsite/';
const itemList = {
  '@context': 'https://schema.org', '@type': 'ItemList',
  '@id': production + 'projects.html#project-list',
  itemListElement: ARCHIVE_PROJECTS.map((project, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: {'@type': 'CreativeWork', name: project.name,
      description: project.description,
      url: production + 'projects.html#project/' + project.slug,
      creator: {'@id': production + '#person'}},
  })),
};
const structured = JSON.stringify(itemList).replaceAll('<', '\\u003c');
const block = '<!-- PROJECT-SUMMARIES-START -->\n<section class="collection-section container" aria-labelledby="project-descriptions-title"><h2 id="project-descriptions-title">Project details</h2>\n' + summaries + '\n</section>\n<script type="application/ld+json">' + structured + '</script>\n<!-- PROJECT-SUMMARIES-END -->';
const projectsResult = projectsSource.replace(/<!-- PROJECT-SUMMARIES-START -->[\s\S]*?<!-- PROJECT-SUMMARIES-END -->/, block);
if (!projectsSource.includes('<!-- PROJECT-SUMMARIES-START -->')) throw new Error('Project summary boundary missing');
if (process.argv.includes('--check')) {
  if (projectsResult !== projectsSource) throw new Error('Project descriptions are stale. Run node tools/sync-projects.mjs');
} else if (projectsResult !== projectsSource) {
  writeFileSync(projectsPath, projectsResult);
}
