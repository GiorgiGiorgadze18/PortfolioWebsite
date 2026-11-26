import {experiments} from './registry.js';
import {createRuntime} from './runtime.js';

const gallery = document.querySelector('#experiment-gallery');
const dialog = document.querySelector('#experiment-dialog');
const stage = dialog.querySelector('.experiment-stage');
const form = dialog.querySelector('form');
const reset = form.querySelector('[type="reset"]');
const pause = dialog.querySelector('[data-pause]');
const status = dialog.querySelector('[role="status"]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let session;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function dispose() {
  const current = session;
  session = undefined;
  current?.runtime?.dispose();
}

function control([key, title, min, max, value, step], settings) {
  const label = element('label', title);
  const input = element(Array.isArray(min) ? 'select' : 'input');
  input.setAttribute('aria-label', title);
  input.name = key;
  if (Array.isArray(min)) {
    for (const item of min) input.add(new Option(item, item));
  } else {
    input.type = 'range';
    Object.assign(input, {min, max, step, defaultValue: value});
  }
  const output = element('output');
  output.setAttribute('aria-hidden', 'true');
  const update = () => {
    settings[key] = input.type === 'range' ? input.valueAsNumber : input.value;
    output.textContent = input.type === 'range' ? input.value : '';
  };
  label.append(input, output);
  const apply = () => { update(); session?.runtime?.invalidate(); };
  input.addEventListener('input', apply);
  input.addEventListener('change', apply);
  update();
  return {label, update};
}

async function open(experiment, trigger) {
  dispose();
  const settings = {};
  const current = {trigger, paused: false};
  session = current;
  dialog.querySelector('h2').textContent = experiment.title;
  dialog.querySelector('.experiment-instructions').textContent = experiment.instructions;
  form.hidden = true;
  pause.hidden = true;
  status.textContent = 'Loading experiment…';
  stage.className = 'experiment-stage';
  reset.textContent = experiment.replay ? 'Reset settings' : 'Reset';
  const replay = form.querySelector('[data-replay]');
  replay.hidden = !experiment.replay;
  current.controls = experiment.controls.map(config => control(config, settings));
  form.querySelector('.experiment-settings').replaceChildren(...current.controls.map(item => item.label));
  dialog.showModal();

  function fallback(error) {
    if (session !== current) return;
    current.runtime?.dispose();
    current.runtime = undefined;
    stage.className = 'experiment-stage experiment-preview preview-' + experiment.id;
    form.hidden = true;
    pause.hidden = true;
    status.textContent = experiment.fallback;
    console.info('[Creative Lab]', experiment.title, error.message);
  }

  try {
    const module = await experiment.load();
    if (session !== current || !dialog.open) return;
    current.runtime = createRuntime(stage, settings, fallback);
    current.runtime.activate(module.mount(current.runtime.api));
    if (!current.runtime) return;
    current.syncMotion = () => {
      pause.hidden = !experiment.animated || reduced.matches;
      replay.disabled = reduced.matches;
      status.textContent = reduced.matches && experiment.animated ? 'Reduced motion is active. Controls update the still view.' : '';
    };
    pause.textContent = 'Pause';
    pause.setAttribute('aria-pressed', 'false');
    form.hidden = false;
    current.syncMotion();
  } catch (error) { fallback(error); }
}

for (const experiment of experiments) {
  const card = element('article', '', 'experiment-card');
  const preview = element('div', '', 'experiment-preview preview-' + experiment.id);
  preview.setAttribute('aria-hidden', 'true');
  const button = element('button', 'Open experiment', 'btn btn--outline');
  button.type = 'button';
  button.setAttribute('aria-label', 'Open ' + experiment.title);
  button.addEventListener('click', () => open(experiment, button));
  const content = element('div', '', 'experiment-card-content');
  content.append(element('p', experiment.technology, 'experiment-technology'),
    element('h3', experiment.title), element('p', experiment.description), button);
  card.append(preview, content);
  gallery.append(card);
}
document.querySelector('#experiment-library').hidden = false;
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => {
  const current = session;
  queueMicrotask(() => {
    if (session !== current || !current) return;
    for (const item of current.controls) item.update();
    current.runtime?.reset();
  });
});
form.querySelector('[data-replay]').addEventListener('click', () => {
  if (!session?.runtime) return;
  if (session.paused) pause.click();
  session.runtime.reset();
});
pause.addEventListener('click', () => {
  if (!session?.runtime) return;
  session.paused = !session.paused;
  pause.setAttribute('aria-pressed', String(session.paused));
  pause.textContent = session.paused ? 'Resume' : 'Pause';
  session.runtime.pause(session.paused);
});
reduced.addEventListener('change', () => session?.syncMotion?.());
window.addEventListener('pagehide', () => {
  if (dialog.open) dialog.close();
  dispose();
});
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  const trigger = session?.trigger;
  dispose();
  trigger?.focus({preventScroll: true});
});
