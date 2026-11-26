export function mount(api) {
  if (!CSS.supports('transform-style', 'preserve-3d')) throw new Error('CSS 3D unavailable');
  const viewport = document.createElement('div');
  viewport.className = 'spatial-viewport';
  const group = document.createElement('div');
  group.className = 'spatial-group';
  for (const [label, detail] of [
    ['Navigation', 'Overview · Activity'],
    ['Workspace', 'Selected collection'],
    ['Toolbar', 'Filter · Sort']
  ]) {
    const layer = document.createElement('div');
    layer.className = 'spatial-layer';
    const title = document.createElement('strong');
    title.textContent = label;
    const sub = document.createElement('span');
    sub.textContent = detail;
    layer.append(title, sub);
    group.append(layer);
  }
  viewport.append(group);
  api.stage.append(viewport);
  return {
    resize() {},
    draw() {
      const {layout, depth, perspective, angle} = api.settings;
      viewport.style.perspective = perspective + 'px';
      group.style.setProperty('--view-angle', angle + 'deg');
      group.style.setProperty('--spread', layout === 'Exploded' ? '1' : '0');
      group.style.setProperty('--depth', (layout === 'Exploded' ? depth : 1) + 'px');
      return false;
    }
  };
}
