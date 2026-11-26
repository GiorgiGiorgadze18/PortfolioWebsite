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
const cards = ARCHIVE_PROJECTS.map(project => `<article class="archive-card" id="project/${escape(project.slug)}" role="listitem" data-category="${escape(project.categories.join(' '))}" style="--active-light:${escape(project.accent)}">
  <div class="archive-thumb"><img loading="lazy" src="assets/${escape(project.thumbnail || project.cover)}" alt="${escape(project.name)} original design artwork"></div>
  <div class="archive-info">
    <span class="archive-kind">${escape(project.categoryLabel)}</span>
    <h3>${escape(project.name)}</h3>
    <p>${escape(project.year)} · ${escape(project.device.toUpperCase())} DISPLAY</p>
    <details class="project-summary" id="project-${escape(project.slug)}">
      <summary class="archive-action" data-explore="${escape(project.id)}" aria-label="About ${escape(project.name)}">About <span aria-hidden="true">↗</span></summary>
      <p>${escape(project.description)}</p>
      <a href="${project.id === 'portfolio' ? 'index.html' : 'assets/' + escape(project.cover)}">${project.id === 'portfolio' ? 'Open portfolio' : 'View original'}</a>
    </details>
  </div>
</article>`).join('\n');
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
const block = '<!-- PROJECT-SUMMARIES-START -->\n<script type="application/ld+json">' + structured + '</script>\n<!-- PROJECT-SUMMARIES-END -->';
const projectsResult = projectsSource
  .replace(/<!-- PROJECT-CARDS-START -->[\s\S]*?<!-- PROJECT-CARDS-END -->/, () =>
    '<!-- PROJECT-CARDS-START -->\n' + cards + '\n<!-- PROJECT-CARDS-END -->')
  .replace(/<!-- PROJECT-SUMMARIES-START -->[\s\S]*?<!-- PROJECT-SUMMARIES-END -->/, () => block);
if (!projectsSource.includes('<!-- PROJECT-SUMMARIES-START -->')) throw new Error('Project summary boundary missing');
if (process.argv.includes('--check')) {
  if (projectsResult !== projectsSource) throw new Error('Project descriptions are stale. Run node tools/sync-projects.mjs');
} else if (projectsResult !== projectsSource) {
  writeFileSync(projectsPath, projectsResult);
}
