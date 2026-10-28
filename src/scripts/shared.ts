import { movementById } from '../data/movements';
export const escape = (s: unknown) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
export function toast(message: string) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}
export type Entry = {
  week: number;
  day: number;
  date: string;
  minutes: number;
  effort: number | null;
  knee: string;
  notes: string;
};
export const logKey = 'bell-balance-logs-v1';
export function readLogs(): Entry[] {
  try {
    const v = JSON.parse(localStorage.getItem(logKey) || '[]');
    return Array.isArray(v)
      ? v.filter(
          (e) =>
            e &&
            Number.isInteger(e.week) &&
            e.week >= 1 &&
            e.week <= 4 &&
            Number.isInteger(e.day) &&
            e.day >= 1 &&
            e.day <= 4 &&
            typeof e.date === 'string' &&
            Number.isFinite(e.minutes) &&
            e.minutes > 0 &&
            e.minutes <= 120,
        )
      : [];
  } catch {
    return [];
  }
}
export function saveLogs(entries: Entry[]) {
  try {
    localStorage.setItem(logKey, JSON.stringify(entries));
    return true;
  } catch {
    toast(
      'Browser storage is unavailable. Please enable it to save your journal.',
    );
    return false;
  }
}
const dialog = document.querySelector<HTMLDialogElement>('#movement-dialog');
const content = document.querySelector<HTMLDivElement>(
  '#movement-dialog-content',
);
export function closeMovement() {
  dialog?.close();
  if (content) content.innerHTML = '';
  document.body.classList.remove('no-scroll');
}
export function openMovement(id: string) {
  const m = movementById[id];
  if (!m || !dialog || !content) return;
  const v = m.video;
  const url =
    v.provider === 'youtube'
      ? `https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ''}`
      : `https://vimeo.com/${v.id}`;
  const thumb =
    v.provider === 'youtube'
      ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
      : 'https://i.vimeocdn.com/video/1471664345-80ae31e2514cb0b40f838a2cfe8d60ac191276b1450a02f9b7d907d1b5ed1f53-d_640';
  content.innerHTML = `<div class="dialog-media"><img class="video-backdrop" src="${thumb}" alt=""/><button class="video-launch" id="load-video"><span class="play-large">▶</span><span>Watch ${escape(m.name)}</span><small>Loads ${v.provider === 'youtube' ? 'YouTube' : 'Vimeo'} video</small></button></div><div class="dialog-body"><div class="video-credit"><span>DEMONSTRATION · ${escape(v.author)}</span><a href="${url}" target="_blank" rel="noreferrer">Watch original ↗</a></div><div class="eyebrow rust">${escape(m.category)} / ${escape(m.muscles)}</div><h2 id="movement-dialog-title">${escape(m.name)}</h2><p>${escape(m.description)}</p>${v.note ? `<p style="margin-top:12px;font-size:11px">Video note: ${escape(v.note)}</p>` : ''}<div class="cue-box">${escape(m.cue)}</div><div class="dialog-columns"><div><h3>How to do it</h3><ol>${m.steps.map((s) => `<li>${escape(s)}</li>`).join('')}</ol></div><div><h3>Watch out for</h3><ul>${m.mistakes.map((s) => `<li>${escape(s)}</li>`).join('')}</ul></div></div><h3 class="swaps-heading">A replacement when you need it.</h3>${m.swaps.map((s) => `<div class="swap-item"><strong>${escape(s.when)}</strong><div><strong>→ ${escape(s.name)}</strong><small>${escape(s.dose)}</small></div></div>`).join('')}<p style="font-size:11px;margin-top:15px">Keep the original interval. Reduce the dose or stop if symptoms or technique worsen.</p></div>`;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('no-scroll');
  content.querySelector('#load-video')?.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = `${m.name} demonstration by ${v.author}`;
    frame.src =
      v.provider === 'youtube'
        ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0${v.start ? `&start=${v.start}` : ''}`
        : `https://player.vimeo.com/video/${v.id}?autoplay=1`;
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    content.querySelector('.dialog-media')?.replaceChildren(frame);
  });
}
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-movement]');
  if (btn) openMovement(btn.dataset.movement!);
});
document
  .querySelector('[data-close-dialog]')
  ?.addEventListener('click', closeMovement);
dialog?.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeMovement();
});
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeMovement();
  }
});
let category = 'All';
const search = document.querySelector<HTMLInputElement>('#movement-search');
function filter() {
  let count = 0;
  document
    .querySelectorAll<HTMLElement>('#movement-library .movement-card')
    .forEach((el) => {
      const match =
        (category === 'All' || el.dataset.category === category) &&
        el.dataset.search!.includes(search?.value.trim().toLowerCase() || '');
      el.hidden = !match;
      if (match) count++;
    });
  const label = document.querySelector('#library-count');
  if (label)
    label.textContent = `${count} movement${count === 1 ? '' : 's'} · technique, video & replacements`;
  const empty = document.querySelector<HTMLElement>('#library-empty');
  if (empty) empty.hidden = count > 0;
}
search?.addEventListener('input', filter);
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) =>
  btn.addEventListener('click', () => {
    category = btn.dataset.filter!;
    document.querySelectorAll('[data-filter]').forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    filter();
  }),
);
