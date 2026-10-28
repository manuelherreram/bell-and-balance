export type Step = {
  name: string;
  dose: string;
  seconds: number;
  cue: string;
  movement?: string;
  phase: 'warmup' | 'main' | 'accessory' | 'cooldown';
  round?: number;
  rest?: boolean;
};
export type Workout = {
  day: number;
  weekday: string;
  name: string;
  kind: string;
  description: string;
  effort: string;
  color: string;
  icon: string;
};
export const workouts: Workout[] = [
  {
    day: 1,
    weekday: 'Monday',
    name: 'Press, squat & pull',
    kind: 'Strength EMOM',
    description:
      'Build repeatable strength. Press with control, squat comfortably, and give your back quality pulling work.',
    effort: '6–8 / 10',
    color: 'rust',
    icon: 'strength',
  },
  {
    day: 2,
    weekday: 'Tuesday',
    name: 'Swing, clean & cruise',
    kind: 'Easy EMOM',
    description:
      'Find a comfortable rhythm. Short ballistic sets, relaxed carries, and space to recover.',
    effort: '5–6 / 10',
    color: 'olive',
    icon: 'wave',
  },
  {
    day: 3,
    weekday: 'Thursday',
    name: 'Hinge, push & build',
    kind: 'Strength EMOM',
    description:
      'Train the posterior chain, add a horizontal push, and keep leg strength in the week.',
    effort: '6–8 / 10',
    color: 'sand',
    icon: 'strength',
  },
  {
    day: 4,
    weekday: 'Saturday',
    name: 'Power & athletic flow',
    kind: 'E2MOM + complex',
    description:
      'Practice your athletic lifts in short clusters. Keep every jerk, snatch, and transition crisp.',
    effort: '6–7 / 10',
    color: 'slate',
    icon: 'bolt',
  },
];
export const weeks = [
  {
    number: 1,
    label: 'Establish',
    text: 'Find your rhythm. Start with repeatable reps and finish with energy in reserve.',
  },
  {
    number: 2,
    label: 'Build',
    text: 'If recovery is good, progress one strength lift. Tuesday gains one round.',
  },
  {
    number: 3,
    label: 'Consolidate',
    text: 'Small, optional rep increases. Keep the same recovery and clean technique.',
  },
  {
    number: 4,
    label: 'Recover',
    text: 'Four 20-minute sessions. Return to starting reps and reduce total sets.',
  },
];
export function mainSteps(day: number, week: number, short = false): Step[] {
  const light = short || week === 4;
  const w = light ? 1 : week;
  const base = (
    name: string,
    dose: string,
    movement?: string,
    rest = false,
  ): Step => ({
    name,
    dose,
    seconds: 60,
    cue: rest
      ? 'Set the bell down and let your breathing settle.'
      : 'Finish reps within about 40 seconds; rest for the remainder.',
    movement,
    phase: 'main',
    rest,
  });
  let pattern: Step[] = [];
  let rounds = light ? 2 : 3;
  if (day === 1)
    pattern = [
      base('Strict press · left', `${w >= 2 ? '6' : '4–5'} reps`, 'press'),
      base('Strict press · right', `${w >= 2 ? '6' : '4–5'} reps`, 'press'),
      base('Goblet squat', `${w >= 3 ? '9' : '8'} reps`, 'squat'),
      base('Supported row · left', '8–10 reps', 'row'),
      base('Supported row · right', '8–10 reps', 'row'),
      base('Full recovery', '60 seconds', undefined, true),
    ];
  if (day === 2) {
    rounds = light ? 4 : week === 1 ? 5 : 6;
    pattern = [
      base('Two-handed swing', `${w >= 3 ? '12' : '10'} reps`, 'swing'),
      base('Single-arm clean', '3 left + 3 right', 'clean'),
      {
        ...base('Suitcase carry', '20 sec left + 20 sec right', 'carry'),
        cue: 'Change hands with the bell down. Rest for the balance of the minute.',
      },
    ];
  }
  if (day === 3)
    pattern = [
      base(
        'Kickstand RDL · left leg forward',
        `${w >= 2 ? '9' : '8'} reps`,
        'rdl',
      ),
      base(
        'Kickstand RDL · right leg forward',
        `${w >= 2 ? '9' : '8'} reps`,
        'rdl',
      ),
      base('Floor press · left', `${w >= 3 ? '9' : '6–8'} reps`, 'floor'),
      base('Floor press · right', `${w >= 3 ? '9' : '6–8'} reps`, 'floor'),
      base('Supported row · left', '8–10 reps', 'row'),
      base('Supported row · right', '8–10 reps', 'row'),
    ];
  if (day === 4)
    pattern = [
      {
        ...base(
          'A · Clean & jerk',
          `${w >= 3 ? '4' : '3'} reps per side`,
          'jerk',
        ),
        seconds: 120,
        cue: 'Every rep includes a clean and a jerk. Finish within 90 seconds and recover.',
      },
      {
        ...base('B · Snatch', '4 reps per side', 'snatch'),
        seconds: 120,
        cue: 'Use familiar technique. Park between sides; finish within 90 seconds.',
      },
      {
        ...base(
          'C · Mixed complex',
          '10 swings → 6 squats → 6 rows / side',
          'swing',
        ),
        seconds: 120,
        cue: 'Park between movements. Finish within 90 seconds; rest for the remainder.',
      },
    ];
  return Array.from({ length: rounds }, (_, i) =>
    pattern.map((s) => ({ ...s, round: i + 1 })),
  ).flat();
}
export function sessionSteps(day: number, week: number, short = false): Step[] {
  const light = short || week === 4;
  const warmups = [
    ['March & mobilize', 'Easy marching + shoulder circles'],
    ['Hinge & squat', '8 unloaded hinges + 6 comfortable squats'],
    ['Pick up & rack', '5 KB deadlifts + 3 easy cleans / side'],
    [
      'Rehearse your first lift',
      day === 1
        ? '2 easy presses / side'
        : day === 2
          ? '5 easy swings'
          : day === 3
            ? '3 unloaded kickstand hinges / side'
            : '1–2 easy clean & jerks and snatches / side',
    ],
  ];
  const warm: Step[] = warmups.map(([name, dose]) => ({
    name,
    dose,
    seconds: 60,
    phase: 'warmup',
    cue: 'Move easily. Rest for the remaining time; use unloaded rehearsal if needed.',
  }));
  const accessory: Step[] = [];
  if (day === 1 || day === 3)
    for (let i = 0; i < (light ? 2 : 3); i++)
      accessory.push({
        name: day === 1 ? 'Suitcase carry' : 'Goblet squat',
        dose:
          day === 1
            ? '20 sec left + 20 sec right'
            : light
              ? '6–8 reps'
              : '8 reps',
        seconds: 60,
        phase: 'accessory',
        movement: day === 1 ? 'carry' : 'squat',
        round: i + 1,
        cue:
          day === 1
            ? 'Stay upright. Park to change hands; use the balance of the minute for rest.'
            : 'Comfortable depth, smooth lowering. Rest for the remainder.',
      });
  const cool: Step[] = [
    {
      name: 'Walk & recover',
      dose: 'Easy steps + relaxed breathing',
      seconds: light && (day === 2 || day === 4) ? 240 : 120,
      phase: 'cooldown',
      cue: 'Let your breathing settle. Gentle comfortable mobility is optional.',
    },
  ];
  return [...warm, ...mainSteps(day, week, short), ...accessory, ...cool];
}
export const minutes = (day: number, week: number, short = false) =>
  sessionSteps(day, week, short).reduce((n, s) => n + s.seconds, 0) / 60;
