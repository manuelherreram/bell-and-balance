export type Movement = {
  id: string;
  name: string;
  category: string;
  level: string;
  description: string;
  muscles: string;
  cue: string;
  steps: string[];
  mistakes: string[];
  swaps: { when: string; name: string; dose: string }[];
  video: {
    provider: 'youtube' | 'vimeo';
    id: string;
    author: string;
    title: string;
    start?: number;
    note?: string;
  };
};
export const movements: Movement[] = [
  {
    id: 'press',
    name: 'Strict press',
    category: 'Push',
    level: 'Strength',
    description:
      'A controlled overhead press from the rack, driven by the shoulder and arm.',
    muscles: 'Shoulders · triceps · trunk',
    cue: 'Clean once. Press smoothly. Keep 2–3 reps in reserve.',
    steps: [
      'Clean the bell into a comfortable rack. Stand tall with feet grounded and wrist neutral.',
      'Brace gently, keep the legs still, and press until the bell is stable overhead.',
      'Lower with control to the rack. Complete the set before parking the bell.',
    ],
    mistakes: [
      'Leaning back to finish the rep.',
      'Turning a strict press into a leg-driven push press.',
      'Forcing a repetition when the shoulder position changes.',
    ],
    swaps: [
      {
        when: '16 kg feels too heavy today',
        name: 'Fewer strict presses',
        dose: '2–3 clean reps per side, then rest for the minute.',
      },
      {
        when: 'Overhead position is uncomfortable',
        name: 'Floor press or elevated push-up',
        dose: '6–10 floor presses per side, or 6–12 elevated push-ups if pain-free.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'WMb8U-V-6ek',
      author: 'Lebe Stark',
      title: 'Overhead press technique',
    },
  },
  {
    id: 'squat',
    name: 'Goblet squat',
    category: 'Squat',
    level: 'Strength',
    description:
      'A squat with the bell held close to the chest and a depth that feels comfortable.',
    muscles: 'Quads · glutes · trunk',
    cue: 'Stay balanced over the whole foot. Own your comfortable depth.',
    steps: [
      'Hold the horns close to the chest and choose a comfortable stance.',
      'Bend at the knees and hips, with knees following the direction of the toes.',
      'Lower smoothly to your comfortable depth, then stand without bouncing.',
    ],
    mistakes: [
      'Forcing extra depth or a particular knee position.',
      'Collapsing into the bottom or lifting the heels.',
      'Continuing when discomfort increases across sets.',
    ],
    swaps: [
      {
        when: 'Knee feels sensitive',
        name: 'Bodyweight chair squat',
        dose: '6–10 controlled reps to a stable chair; choose a comfortable depth.',
      },
      {
        when: 'Holding the bell is limiting',
        name: 'Bodyweight squat',
        dose: '8–12 smooth reps. Preserve the same minute and rest.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'hWB6uwfjHVI',
      author: 'Lebe Stark',
      title: 'How to goblet squat with a kettlebell',
    },
  },
  {
    id: 'row',
    name: 'Supported row',
    category: 'Pull',
    level: 'Strength',
    description:
      'A horizontal pull with the free hand supported so the back can stay quiet.',
    muscles: 'Lats · upper back · biceps',
    cue: 'Pull toward the hip. Keep the trunk still.',
    steps: [
      'Hinge and support your free hand on your thigh or a secure surface.',
      'Let the working arm hang, then pull the elbow toward the hip.',
      'Lower smoothly without rotating the torso. Repeat on the other side.',
    ],
    mistakes: [
      'Twisting to move the bell.',
      'Shrugging toward the ear.',
      'Using a surface that can slide or tip.',
    ],
    swaps: [
      {
        when: 'Lower back gets tired',
        name: 'More supported row',
        dose: 'Raise the support and shorten the hinge. Use 6–10 controlled reps per side.',
      },
      {
        when: 'Grip fades',
        name: 'Shorter sets',
        dose: 'Use 6–8 reps per side and keep the remaining time for recovery.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'IlNaupDwxIs',
      author: 'Lebe Stark',
      title: 'How to row with a kettlebell',
      note: 'The demonstration shows a bent row. Use the extra free-hand support described here.',
    },
  },
  {
    id: 'swing',
    name: 'Two-handed swing',
    category: 'Hinge',
    level: 'Ballistic',
    description:
      'A rhythmic hip hinge that lets the bell float from hip drive.',
    muscles: 'Glutes · hamstrings · grip · trunk',
    cue: 'Hips drive. Arms guide. Park before the next movement.',
    steps: [
      'Set the bell slightly ahead of you, hinge, and hike it between the thighs.',
      'Stand through the hips and let the bell float naturally, up to about shoulder height.',
      'Allow it to return, hinge as the arms reconnect, and park under control at the end.',
    ],
    mistakes: [
      'Lifting the bell with the shoulders.',
      'Turning every rep into a deep squat.',
      'Leaning back at the top or chasing height.',
    ],
    swaps: [
      {
        when: 'Back or grip feels fatigued',
        name: 'Two-handed KB deadlift',
        dose: '8–10 controlled reps instead of 10 swings, within the same interval.',
      },
      {
        when: 'Breathing does not settle',
        name: 'Reduced swing set',
        dose: '6–8 crisp reps, then rest. Keep the next interval easy.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'lc8eBdV08yg',
      author: 'Lebe Stark',
      title: 'How to master the kettlebell swing',
    },
  },
  {
    id: 'clean',
    name: 'Single-arm clean',
    category: 'Hinge',
    level: 'Ballistic',
    description: 'A close-to-body ballistic pull into a soft rack catch.',
    muscles: 'Hips · upper back · grip · trunk',
    cue: 'Keep it close. Slip the hand through. Catch softly.',
    steps: [
      'Hinge and hike the bell using a secure, relaxed working grip.',
      'Drive from the hips and guide the bell close to the body.',
      'Insert the hand smoothly into the handle and settle into the rack. Park to change sides if needed.',
    ],
    mistakes: [
      'Curling the bell with the arm.',
      'Letting it loop out and strike the forearm.',
      'Rushing the hand change.',
    ],
    swaps: [
      {
        when: 'Forearm catches are uncomfortable',
        name: 'Two-handed deadlift',
        dose: '8–10 reps total in that minute, then rest.',
      },
      {
        when: 'The set is too taxing',
        name: 'Fewer cleans',
        dose: '2 per side with a full park between sides.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'eEC2nItRb-s',
      start: 1952,
      author: 'Lebe Stark',
      title: 'Clean technique · beginner guide',
      note: 'Starts at the clean chapter, 32:32. This is a technique reference, not an extra workout.',
    },
  },
  {
    id: 'carry',
    name: 'Suitcase carry',
    category: 'Carry',
    level: 'Stability',
    description:
      'Walking, marching, or holding one bell at your side while staying upright.',
    muscles: 'Grip · obliques · trunk · hips',
    cue: 'Tall posture. Quiet steps. Equal time on both sides.',
    steps: [
      'Pick up the bell with a controlled hinge and stand upright.',
      'Walk in a clear space, march gently, or remain still without leaning.',
      'After 20 seconds, park and change sides. Include the change in the rest time.',
    ],
    mistakes: [
      'Leaning away from the bell.',
      'Rushing around furniture.',
      'Trying to make the hand change fit at the expense of control.',
    ],
    swaps: [
      {
        when: 'Space is limited',
        name: 'Suitcase hold',
        dose: '20 seconds per side, then rest for the balance of the minute.',
      },
      {
        when: 'Marching irritates the knee',
        name: 'Standing suitcase hold',
        dose: 'Use a comfortable stance and stay still for up to 20 seconds per side.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'IAa-5uP7tSY',
      author: 'E3 Rehab',
      title: 'Suitcase carry demonstration',
    },
  },
  {
    id: 'rdl',
    name: 'Kickstand RDL',
    category: 'Hinge',
    level: 'Strength',
    description:
      'A hip hinge with the rear toes acting as a kickstand and the front leg doing most of the work.',
    muscles: 'Hamstrings · glutes · trunk',
    cue: 'Soft front knee. Hips back. Rear toes support balance.',
    steps: [
      'Stagger the feet slightly and hold the bell opposite the front leg.',
      'Keep a soft front knee and hinge through the hips, lowering only while the trunk stays controlled.',
      'Stand through the front hip. Keep the rear foot planted for support.',
    ],
    mistakes: [
      'Reaching for the floor by rounding the back.',
      'Turning the movement into a balance test.',
      'Letting the hips rotate.',
    ],
    swaps: [
      {
        when: 'Balance interferes',
        name: 'Bilateral Romanian deadlift',
        dose: '8 controlled reps in each scheduled side minute, or rest the second minute if needed.',
      },
      {
        when: 'Range is uncomfortable',
        name: 'Shorter-range hinge',
        dose: '6–8 reps within the comfortable range. Stop for pain.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'ztXjknHC9NQ',
      author: 'Kathletics',
      title: 'Kettlebell kickstand RDL',
    },
  },
  {
    id: 'floor',
    name: 'Single-arm floor press',
    category: 'Push',
    level: 'Strength',
    description:
      'A horizontal press from the floor, with a controlled setup and limited bottom range.',
    muscles: 'Chest · triceps · shoulders',
    cue: 'Set up with both hands. Forearm vertical. Touch down softly.',
    steps: [
      'Use both hands and a familiar setup to bring the bell into position while lying on your back.',
      'Keep the working forearm vertical and press to a stable arm position.',
      'Lower until the upper arm gently touches the floor. Use both hands to finish safely.',
    ],
    mistakes: [
      'Rushing the floor transition because of the clock.',
      'Letting the bell pull the wrist backward.',
      'Dropping the upper arm onto the floor.',
    ],
    swaps: [
      {
        when: 'Floor setup is unfamiliar',
        name: 'Push-ups + a rest minute',
        dose: '6–15 push-ups in minute 3, then full rest in minute 4. Elevate hands if needed.',
      },
      {
        when: 'The load is too demanding',
        name: 'Elevated push-up',
        dose: '6–12 controlled reps using a secure elevated surface; keep the second press minute as rest.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'yXstm050X84',
      author: 'NASM',
      title: 'How to do a kettlebell floor press',
    },
  },
  {
    id: 'jerk',
    name: 'Clean & jerk',
    category: 'Power',
    level: 'Ballistic',
    description:
      'A clean to the rack followed by a leg-driven launch, a second dip to receive the bell, and a stable stand.',
    muscles: 'Legs · shoulders · triceps · trunk',
    cue: 'Clean. Dip and drive. Re-dip to catch. Stand tall.',
    steps: [
      'Clean into the rack and settle before each jerk.',
      'Use a comfortable shallow dip, drive through the legs, and receive the bell with the arm extended in a second dip.',
      'Stand to a stable overhead position, lower to rack, then repeat the clean for the next rep.',
    ],
    mistakes: [
      'Confusing the jerk with a strict press or a push press.',
      'Forcing a deeper knee dip.',
      'Rushing the overhead catch or lowering.',
    ],
    swaps: [
      {
        when: 'The dip irritates your knee',
        name: 'Strict press',
        dose: '3 strict presses per side, only if comfortable. Keep the two-minute station.',
      },
      {
        when: 'Overhead position is uncomfortable',
        name: 'Single-arm clean',
        dose: '3–4 cleans per side if pain-free. Recover for the rest of the station.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'N6Rvg3EH8mM',
      author: 'Zack Henderson',
      title: 'Single-arm kettlebell jerk tutorial',
      note: 'The video teaches the jerk. In this program, add a new clean before every jerk repetition.',
    },
  },
  {
    id: 'snatch',
    name: 'Single-arm snatch',
    category: 'Power',
    level: 'Ballistic',
    description:
      'A one-arm ballistic lift to a stable overhead finish, using your established technique.',
    muscles: 'Hips · upper back · shoulders · grip',
    cue: 'Guide it close. Insert the hand. Fix overhead softly.',
    steps: [
      'Start with your familiar one-arm hinge and hip drive.',
      'Guide the bell close and insert the hand as it floats into the overhead position.',
      'Stabilize, return with your familiar controlled technique, and park before changing sides.',
    ],
    mistakes: [
      'Allowing the bell to crash onto the forearm.',
      'Continuing as grip or overhead control fades.',
      'Treating the interval as a maximum-repetition test.',
    ],
    swaps: [
      {
        when: 'Grip or catches deteriorate',
        name: 'Single-arm clean',
        dose: '4 cleans per side in the same two-minute station.',
      },
      {
        when: 'Overhead movement is uncomfortable',
        name: 'Two-handed deadlift',
        dose: '8–10 comfortable reps, then recover for the rest of the station.',
      },
    ],
    video: {
      provider: 'youtube',
      id: '0XOGIGEOdG4',
      author: 'Lebe Stark',
      title: 'Kettlebell snatch · full tutorial',
    },
  },
  {
    id: 'deadlift',
    name: 'Two-handed deadlift',
    category: 'Hinge',
    level: 'Strength',
    description:
      'A controlled lift from the floor using the hips and legs, with the bell held in both hands.',
    muscles: 'Glutes · hamstrings · back · grip',
    cue: 'Bell between the feet. Hips back. Stand tall without leaning.',
    steps: [
      'Stand over the bell with a comfortable stance. Hinge and bend the knees enough to take the handle with both hands.',
      'Brace your trunk and push through the feet to stand, keeping the bell close.',
      'Send the hips back and return the bell to the floor with control. Reset before the next rep.',
    ],
    mistakes: [
      'Jerking the bell from the floor.',
      'Leaning backward at the top.',
      'Forcing a floor reach beyond a comfortable range.',
    ],
    swaps: [
      {
        when: 'Reaching the floor is uncomfortable',
        name: 'Shorter-range Romanian deadlift',
        dose: '6–8 controlled reps. Use a comfortable range after a safe setup.',
      },
      {
        when: 'Grip or general fatigue rises',
        name: 'Reduce the set',
        dose: '5–6 smooth reps, then rest for the remaining interval.',
      },
    ],
    video: {
      provider: 'youtube',
      id: 'LnIMaf-XOpM',
      author: 'NASM',
      title: 'Kettlebell deadlift technique',
    },
  },
];
export const movementById = Object.fromEntries(movements.map((m) => [m.id, m]));
