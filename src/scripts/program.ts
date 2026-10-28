import {
  workouts,
  weeks,
  sessionSteps,
  mainSteps,
  minutes,
  type Step,
} from '../data/program';
import { escape, readLogs, toast } from './shared';
const $ = <T extends HTMLElement = HTMLElement>(s: string) =>
  document.querySelector<T>(s)!;
let week = 1,
  day = 1,
  short = false;
const fmt = (n: number) =>
  `${Math.floor(Math.max(0, n) / 60)
    .toString()
    .padStart(2, '0')}:${Math.ceil(Math.max(0, n) % 60)
    .toString()
    .padStart(2, '0')}`;
const row = (s: Step, i: number) =>
  `<${s.movement ? 'button' : 'div'} class="exercise-row" ${s.movement ? `data-movement="${s.movement}"` : ''}><span class="exercise-info"><span class="minute">${i + 1}</span><span><strong>${escape(s.name)}</strong><small>${s.seconds === 120 ? 'Two-minute station' : 'One-minute station'}${s.movement ? ' · view technique ↗' : ''}</small></span></span><span class="exercise-right">${escape(s.dose)}</span></${s.movement ? 'button' : 'div'}>`;
function render() {
  const w = workouts[day - 1];
  const light = short || week === 4;
  const main = mainSteps(day, week, short);
  const pattern = main.filter((s) => s.round === 1);
  const all = sessionSteps(day, week, short);
  const extra = all.filter((s) => s.phase === 'accessory');
  const cooldown = all.find((s) => s.phase === 'cooldown')!;
  const rounds = Math.max(...main.map((s) => s.round!));
  $('#week-context').innerHTML =
    `<b>Week ${week} · ${weeks[week - 1].label}.</b> ${weeks[week - 1].text}`;
  document.querySelectorAll<HTMLButtonElement>('[data-week]').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.week) === week);
    b.setAttribute('aria-pressed', String(Number(b.dataset.week) === week));
  });
  document.querySelectorAll<HTMLButtonElement>('.day-card').forEach((b) => {
    const d = +b.dataset.day!;
    b.classList.toggle('selected', d === day);
    b.classList.toggle(
      'completed',
      readLogs().some((e) => e.week === week && e.day === d),
    );
    b.setAttribute('aria-pressed', String(d === day));
    b.querySelector('.selected-label')!.textContent =
      d === day ? 'SELECTED' : 'VIEW SESSION ↗';
    b.querySelector('[data-duration]')!.textContent =
      `${minutes(d, week, short)} min`;
  });
  $('#session-panel').innerHTML =
    `<div class="session-head"><div class="eyebrow rust">WEEK ${week} / DAY 0${day} · ${w.weekday.toUpperCase()}</div><h2>${w.name}</h2><p>${w.description}</p><div class="session-tags"><a href="/guide/" class="pill olive">${w.kind} ↗</a><span class="pill">${rounds} main rounds</span><span class="pill">${light ? '20-minute version' : 'Complete session'}</span></div></div><div class="block"><div class="block-title"><h3><span class="block-letter">01</span> Ease into it.</h3><span class="block-time">4 MIN</span></div><details><summary>Your four-minute warm-up</summary><ol>${all
      .filter((s) => s.phase === 'warmup')
      .map(
        (s) =>
          `<li><strong>${s.name}:</strong> ${s.dose}. Rest for the remaining minute.</li>`,
      )
      .join(
        '',
      )}</ol></details></div><div class="block"><div class="block-title"><h3><span class="block-letter">02</span> ${day === 4 ? 'Practice & flow.' : 'Your main work.'}</h3><span class="block-time">${main.reduce((n, s) => n + s.seconds, 0) / 60} MIN</span></div><p class="block-description">Repeat the sequence <strong>${rounds} times</strong>. ${day === 4 ? 'Start a station every 2 minutes. Finish by about 1:30, then recover. Park the bell between movements as needed.' : 'Start the next movement each minute. Finish reps by about :40; rest for the balance.'} Higher reps are optional; keep starting reps if needed.</p>${pattern.map(row).join('')}${day === 4 ? '<p class="block-description">Complex technique: <button data-movement="swing" class="filter-button">Swing ↗</button> <button data-movement="squat" class="filter-button">Squat ↗</button> <button data-movement="row" class="filter-button">Row ↗</button></p>' : ''}</div>${extra.length ? `<div class="block"><div class="block-title"><h3><span class="block-letter">03</span> A little extra strength.</h3><span class="block-time">${extra.length} MIN</span></div><p class="block-description">${extra.length} one-minute rounds. Work, then rest for the remainder.</p>${row(extra[0], 0)}</div>` : ''}<div class="block"><div class="block-title"><h3><span class="block-letter">${extra.length ? '04' : '03'}</span> Bring it back down.</h3><span class="block-time">${cooldown.seconds / 60} MIN</span></div><p class="block-description">Easy walking and relaxed breathing. Comfortable gentle mobility is optional.</p></div>`;
  $('#session-duration').textContent = fmt(minutes(day, week, short) * 60);
  $('#session-effort').textContent = w.effort;
  const toggle = $<HTMLInputElement>('#short-session');
  toggle.checked = light;
  toggle.disabled = week === 4;
  $('#log-session').setAttribute(
    'href',
    `/progress/?week=${week}&day=${day}&minutes=${minutes(day, week, short)}`,
  );
  $('#start-session').textContent =
    timerStarted && !complete
      ? 'Resume guided timer →'
      : 'Start guided timer →';
}
document.querySelectorAll<HTMLButtonElement>('[data-week]').forEach((b) =>
  b.addEventListener('click', () => {
    week = +b.dataset.week!;
    reset();
    render();
  }),
);
document.querySelectorAll<HTMLButtonElement>('.day-card').forEach((b) =>
  b.addEventListener('click', () => {
    day = +b.dataset.day!;
    reset();
    render();
  }),
);
$('#short-session').addEventListener('change', (e) => {
  short = (e.target as HTMLInputElement).checked;
  reset();
  render();
});
const dialog = $<HTMLDialogElement>('#timer-dialog');
let steps: Step[] = [],
  index = 0,
  remaining = 60,
  deadline = 0,
  running = false,
  resting = false,
  timerStarted = false,
  complete = false,
  sound = false;
let interval: ReturnType<typeof setInterval> | undefined;
let audio: AudioContext | undefined;
function beep() {
  if (!sound) return;
  try {
    audio ??= new AudioContext();
    const oscillator = audio.createOscillator(),
      gain = audio.createGain();
    oscillator.connect(gain);
    gain.connect(audio.destination);
    gain.gain.value = 0.08;
    oscillator.frequency.value = 660;
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.16);
  } catch {}
}
function reset() {
  if (interval) clearInterval(interval);
  running = false;
  timerStarted = false;
  complete = false;
  index = 0;
  remaining = 60;
  resting = false;
  steps = [];
}
function tick() {
  if (!running) return;
  while (Date.now() >= deadline && index < steps.length) {
    beep();
    index++;
    resting = false;
    if (index === steps.length) {
      finish();
      return;
    }
    deadline += steps[index].seconds * 1000;
  }
  remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  paint();
}
function paint() {
  if (complete) return;
  const s = steps[index];
  if (!s) return;
  $('#timer-week').textContent = `WEEK ${week} / DAY ${day}`;
  $('#timer-title').textContent = workouts[day - 1].name;
  $('#timer-phase').textContent =
    `${s.phase}${s.round ? ` · ROUND ${s.round}` : ''}${resting ? ' · RECOVER' : ''}`;
  $('#timer-clock').textContent = fmt(remaining);
  $('#timer-move').textContent = resting ? 'Rest & reset' : s.name;
  $('#timer-dose').textContent = resting
    ? 'Let your breathing settle.'
    : s.dose;
  $('#timer-cue').textContent = s.cue;
  $('#timer-pause').textContent = running ? 'Pause' : 'Resume';
  $('#timer-rest').hidden = s.rest || s.phase === 'cooldown' || resting;
  $('#timer-step').textContent = `Interval ${index + 1} / ${steps.length}`;
  const elapsed =
    steps.slice(0, index).reduce((n, s) => n + s.seconds, 0) +
    s.seconds -
    remaining;
  const total = steps.reduce((n, s) => n + s.seconds, 0);
  $('#timer-total').textContent = `${fmt(total - elapsed)} session remaining`;
  $('#timer-progress').style.width = `${(elapsed / total) * 100}%`;
  $('#timer-upnext').textContent = steps[index + 1]?.name || 'Session complete';
  $('#timer-log').hidden = true;
}
function start() {
  if (!timerStarted || complete) {
    steps = sessionSteps(day, week, short);
    index = 0;
    remaining = steps[0].seconds;
    resting = false;
    timerStarted = true;
    complete = false;
  }
  dialog.showModal();
  document.body.classList.add('no-scroll');
  resume();
}
function resume() {
  if (complete) return;
  running = true;
  deadline = Date.now() + remaining * 1000;
  if (interval) clearInterval(interval);
  interval = setInterval(tick, 200);
  paint();
}
function pause() {
  if (running) {
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    running = false;
    if (interval) clearInterval(interval);
  }
  paint();
}
function close() {
  pause();
  dialog.close();
  document.body.classList.remove('no-scroll');
  render();
}
function finish() {
  running = false;
  complete = true;
  if (interval) clearInterval(interval);
  $('#timer-phase').textContent = 'SESSION COMPLETE';
  $('#timer-clock').textContent = '✓';
  $('#timer-move').textContent = 'Good work. Keep building.';
  $('#timer-dose').textContent = 'Take a moment to recover.';
  $('#timer-cue').textContent =
    'Log your actual training time and effort. Check your knee again tomorrow morning.';
  $('#timer-progress').style.width = '100%';
  $('#timer-step').textContent = 'All intervals complete';
  $('#timer-total').textContent =
    `${minutes(day, week, short)} planned minutes`;
  $('#timer-upnext').textContent = 'Recovery & your session journal';
  $('#timer-log').hidden = false;
  $('#timer-log').setAttribute('href', $('#log-session').getAttribute('href')!);
  document
    .querySelectorAll<HTMLElement>('.timer-controls button')
    .forEach((b) => (b.hidden = true));
}
$('#start-session').addEventListener('click', () => {
  document
    .querySelectorAll<HTMLElement>('.timer-controls button')
    .forEach((b) => (b.hidden = false));
  start();
});
$('#close-timer').addEventListener('click', close);
dialog.addEventListener('cancel', (e) => {
  e.preventDefault();
  close();
});
$('#timer-pause').addEventListener('click', () =>
  running ? pause() : resume(),
);
$('#timer-rest').addEventListener('click', () => {
  resting = true;
  paint();
});
$('#timer-next').addEventListener('click', () => {
  index++;
  resting = false;
  if (index === steps.length) {
    finish();
    return;
  }
  remaining = steps[index].seconds;
  if (running) deadline = Date.now() + remaining * 1000;
  paint();
});
$('#timer-reset').addEventListener('click', () => {
  pause();
  index = 0;
  remaining = steps[0].seconds;
  resting = false;
  complete = false;
  document
    .querySelectorAll<HTMLElement>('.timer-controls button')
    .forEach((b) => (b.hidden = false));
  paint();
  toast('Session restarted. Press Resume when ready.');
});
$('#timer-sound').addEventListener('click', () => {
  sound = !sound;
  $('#timer-sound').textContent = sound ? 'Sound on' : 'Sound off';
  $('#timer-sound').setAttribute('aria-pressed', String(sound));
  if (sound) beep();
});
render();
