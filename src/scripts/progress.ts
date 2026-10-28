import { readLogs, saveLogs, escape, toast, type Entry } from './shared';
import { minutes, workouts } from '../data/program';
const $ = <T extends HTMLElement = HTMLElement>(s: string) =>
  document.querySelector<T>(s)!;
const form = $<HTMLFormElement>('#journal-form');
const input = (name: string) =>
  form.elements.namedItem(name) as HTMLInputElement;
let logs = readLogs();
const params = new URLSearchParams(location.search);
const n = (s: string | null) => Number(s);
const index = (s: string | null) => {
  const v = Number(s);
  return Number.isInteger(v) && v >= 1 && v <= 4 ? v : 1;
};
input('week').value = String(index(params.get('week')));
input('day').value = String(index(params.get('day')));
const now = new Date();
input('date').value =
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
function defaults() {
  input('minutes').value = String(
    minutes(+input('day').value, +input('week').value),
  );
}
defaults();
if (n(params.get('minutes')) >= 1 && n(params.get('minutes')) <= 120)
  input('minutes').value = params.get('minutes')!;
function populate(week: number, day: number) {
  input('week').value = String(week);
  input('day').value = String(day);
  const e = logs.find((e) => e.week === week && e.day === day);
  if (e) {
    for (const key of ['date', 'minutes', 'knee', 'notes', 'effort'] as const)
      input(key).value = String(e[key] ?? '');
  } else {
    defaults();
    input('effort').value = '';
    input('knee').value = 'pending';
    input('notes').value = '';
  }
}
if (
  logs.some(
    (e) => e.week === +input('week').value && e.day === +input('day').value,
  )
)
  populate(+input('week').value, +input('day').value);
for (const name of ['week', 'day'])
  input(name).addEventListener('change', () =>
    populate(+input('week').value, +input('day').value),
  );
const kneeLabels: Record<string, string> = {
  pending: 'Knee: not checked yet',
  normal: 'Knee: normal',
  sensitive: 'Knee: more sensitive',
  pain: 'Knee: pain / swelling',
};
function render() {
  const unique = new Map(logs.map((e) => [`${e.week}-${e.day}`, e]));
  logs = [...unique.values()];
  $('#stat-sessions').innerHTML = `${logs.length} <small>/ 16</small>`;
  $('#stat-minutes').textContent = String(
    logs.reduce((sum, e) => sum + e.minutes, 0),
  );
  const efforts = logs.filter(
    (e) => e.effort !== null && e.effort >= 1 && e.effort <= 10,
  );
  $('#stat-effort').textContent = efforts.length
    ? (efforts.reduce((sum, e) => sum + e.effort!, 0) / efforts.length).toFixed(
        1,
      )
    : '—';
  $('#stat-complete').textContent = `${Math.round((logs.length / 16) * 100)}%`;
  document.querySelectorAll<HTMLAnchorElement>('[data-cell]').forEach((el) => {
    const done = unique.has(el.dataset.cell!);
    el.classList.toggle('done', done);
    el.textContent = done ? '✓ Logged' : '＋ Log';
  });
  $('#journal-entries').innerHTML = logs.length
    ? [...logs]
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) || b.week - a.week || b.day - a.day,
        )
        .map(
          (e) =>
            `<article class="journal-entry"><div><small>${escape(e.date)} · WEEK ${e.week} / DAY ${e.day}</small><h4>${workouts[e.day - 1].name}</h4><div class="entry-metrics"><span class="pill">${e.minutes} min</span>${e.effort ? `<span class="pill">Effort ${e.effort}/10</span>` : ''}<span class="pill">${escape(kneeLabels[e.knee] || 'Knee: not recorded')}</span></div>${e.notes ? `<p>${escape(e.notes)}</p>` : ''}</div><div class="entry-actions"><button data-edit="${e.week}-${e.day}" aria-label="Edit week ${e.week} day ${e.day}">Edit</button><button data-delete="${e.week}-${e.day}" aria-label="Delete week ${e.week} day ${e.day}">Delete</button></div></article>`,
        )
        .join('')
    : '<div class="empty-state"><h3>Your first session starts the story.</h3><p>Log a workout above to begin.</p></div>';
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const entry: Entry = {
    week: +input('week').value,
    day: +input('day').value,
    date: input('date').value,
    minutes: +input('minutes').value,
    effort: input('effort').value ? +input('effort').value : null,
    knee: input('knee').value,
    notes: input('notes').value.trim(),
  };
  const updated = [
    ...logs.filter((e) => e.week !== entry.week || e.day !== entry.day),
    entry,
  ];
  if (saveLogs(updated)) {
    logs = updated;
    render();
    toast('Session saved. Check in with your knee tomorrow.');
  }
});
document.addEventListener('click', (e) => {
  const t = (e.target as Element).closest<HTMLElement>(
    '[data-edit],[data-delete],[data-cell]',
  );
  if (!t) return;
  const key = t.dataset.edit || t.dataset.delete || t.dataset.cell!;
  const [week, day] = key.split('-').map(Number);
  if (t.dataset.delete) {
    const updated = logs.filter((e) => e.week !== week || e.day !== day);
    if (saveLogs(updated)) {
      logs = updated;
      render();
      toast('Session removed from this browser.');
    }
  } else {
    if (t.dataset.cell) e.preventDefault();
    populate(week, day);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    input('week').focus({ preventScroll: true });
  }
});
$('#export-journal').addEventListener('click', () => {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          program: 'Bell & Balance — four-week home kettlebell plan',
          exported: new Date().toISOString(),
          sessions: logs,
        },
        null,
        2,
      ),
    ],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bell-and-balance-journal.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Journal exported. Keep it somewhere safe.');
});
render();
