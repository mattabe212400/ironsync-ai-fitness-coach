/* ============================================================
   IRONSYNC — app.js
   Frontend MVP · Demo data only · No backend
   ============================================================

   KEY ARCHITECTURE:
   - S.goal drives all program content: split, exercises,
     day cards, dashboard labels, AI tips, and profile copy.
   - pickGoal() stores the selection; renderGoalContent() fires
     once when the user enters the app shell and stamps every
     goal-dependent element in one pass.
   - Pre-auth screens (login, onboard, program-ready) are full
     .screen elements. The app shell (#s-dash) is persistent with
     multiple .page divs inside it.

   All data is hardcoded sample/demo only.
   ============================================================ */

'use strict';

/* ============================================================
   GOAL DATA — 4 complete programs
   Each goal has:
     subtitle     – shown on program-ready screen
     splitTitle   – card heading (e.g. "6-Week Weekly Split")
     splitBadge   – e.g. "3 days / week"
     split[]      – { day, label, type: 'work'|'rest' }
     todayName    – hero card workout name on dashboard
     todayMeta    – hero card meta line
     aiTip        – dashboard AI coach tip
     prLabel      – stat card label (e.g. "Bench Press PR")
     prValue      – stat card value
     programName  – used in profile "Current Program" row
     topPR        – profile "Top Lift PR" row
     completePR   – program-complete card number
     completePRLbl– program-complete card label
     exercises[]  – today's session: { name, eq, target, rest, muscle }
     liveExercises[] – for live tracker: { name, meta, target, rest, prev }
     planDays[]   – { name, meta, time, status:'today'|'done'|'rest'|'upcoming' }
     recommendation – AI coach card main rec text (HTML allowed)
     insights[]   – { type:'pos'|'warn'|'neu', icon, main, detail }
     adjustments[]– { exercise, change, type:'up'|'hold'|'down' }
   ============================================================ */
const GOAL_DATA = {

  /* ── STRENGTH ─────────────────────────────────────────────── */
  strength: {
    subtitle:      'Optimized for Strength Building',
    splitTitle:    '6-Week Strength Split',
    splitBadge:    '3 days / week',
    split: [
      { day: 'Monday',    label: 'Heavy Compound (Squat focus)',  type: 'work' },
      { day: 'Tuesday',   label: 'Rest / Mobility',               type: 'rest' },
      { day: 'Wednesday', label: 'Power Lifting (Bench focus)',    type: 'work' },
      { day: 'Thursday',  label: 'Rest / Active Recovery',        type: 'rest' },
      { day: 'Friday',    label: 'Max Effort (Deadlift focus)',    type: 'work' },
      { day: 'Saturday',  label: 'Rest',                          type: 'rest' },
      { day: 'Sunday',    label: 'Rest',                          type: 'rest' },
    ],
    todayName:     'Push Day 💪',
    todayMeta:     '5 exercises · ~55 min · Heavy compound focus',
    aiTip:         '"Your bench press improved 15% this month. Add a 5th set today to capitalize on your current strength trajectory."',
    prLabel:       'Bench\nPress PR',
    prValue:       '245',
    prUnit:        'lbs',
    programName:   'Strength Block',
    topPR:         'Bench Press — 245 lbs',
    completePR:    '+60',
    completePRLbl: 'Bench PR',
    exercises: [
      { name: 'Barbell Bench Press', eq: 'Barbell',    target: '4 × 5 @ 225 lbs',   rest: '3 min',  muscle: 'Chest'       },
      { name: 'Overhead Press',      eq: 'Barbell',    target: '3 × 6 @ 135 lbs',   rest: '2 min',  muscle: 'Shoulders'   },
      { name: 'Incline DB Press',    eq: 'Dumbbells',  target: '3 × 8 @ 65 lbs ea.',rest: '2 min',  muscle: 'Upper Chest' },
      { name: 'Tricep Pushdown',     eq: 'Cable',      target: '3 × 12 @ 70 lbs',   rest: '90 sec', muscle: 'Triceps'     },
      { name: 'Lateral Raises',      eq: 'Dumbbells',  target: '3 × 15 @ 25 lbs ea.',rest:'60 sec', muscle: 'Delts'       },
    ],
    liveExercises: [
      { name: 'Barbell Bench Press', meta: 'Barbell · Ex 1 of 5', target: '4×5 @ 225 lbs', rest: '3 min',  prev: '4 sets · 220 lbs · 5 reps avg' },
      { name: 'Overhead Press',      meta: 'Barbell · Ex 2 of 5', target: '3×6 @ 135 lbs', rest: '2 min',  prev: '3 sets · 130 lbs · 6 reps avg' },
      { name: 'Incline DB Press',    meta: 'Dumbbells · Ex 3 of 5',target: '3×8 @ 65 lbs', rest: '2 min',  prev: '3 sets · 60 lbs · 8 reps avg'  },
      { name: 'Tricep Pushdown',     meta: 'Cable · Ex 4 of 5',   target: '3×12 @ 70 lbs', rest: '90 sec', prev: '3 sets · 65 lbs · 12 reps avg' },
      { name: 'Lateral Raises',      meta: 'Dumbbells · Ex 5 of 5',target:'3×15 @ 25 lbs', rest: '60 sec', prev: '3 sets · 20 lbs · 15 reps avg' },
    ],
    planDays: [
      { name: 'Push Day (Bench Focus)',    meta: 'Bench · OHP · Triceps · 5 exercises',   time: '~55 min', status: 'today'    },
      { name: 'Pull Day (Row Focus)',      meta: 'Deadlift · Rows · Biceps · 5 exercises', time: '52 min',  status: 'done'    },
      { name: 'Rest / Active Recovery',   meta: 'Light walk · Stretching · Mobility',     time: '—',       status: 'rest'    },
      { name: 'Lower Strength (Squat)',   meta: 'Squat · Leg Press · Lunges · 5 ex',      time: '60 min',  status: 'done'    },
      { name: 'Max Effort (Deadlift)',    meta: 'Conventional DL · RDL · Accessories',    time: '~60 min', status: 'upcoming'},
    ],
    recommendation: 'Increase bench press weight by <strong>5 lbs</strong> next session',
    insights: [
      { type: 'pos',  icon: '📈', main: 'Bench press up 15% this month',         detail: 'Progressive overload is working — keep it up'               },
      { type: 'warn', icon: '😴', main: 'Sleep quality dipped mid-week',           detail: 'Consider reducing volume on low-sleep days'                  },
      { type: 'pos',  icon: '🔥', main: '12-day streak maintained',               detail: 'Consistency is the #1 predictor of long-term strength gains' },
      { type: 'neu',  icon: '⚖️', main: 'Push/pull volume balance: healthy',      detail: 'Push/pull ratio is 1.1:1 — right on target'                  },
    ],
    adjustments: [
      { exercise: 'Bench Press',    change: '+5 lbs',     type: 'up'   },
      { exercise: 'Overhead Press', change: '+2.5 lbs',   type: 'up'   },
      { exercise: 'Squat',          change: 'Hold weight', type: 'hold' },
      { exercise: 'Deadlift',       change: '+10 lbs',    type: 'up'   },
      { exercise: 'Incline Press',  change: '+5 lbs',     type: 'up'   },
    ],
  },

  /* ── HYPERTROPHY ─────────────────────────────────────────── */
  hypertrophy: {
    subtitle:      'Optimized for Muscle Growth (Hypertrophy)',
    splitTitle:    '6-Week Hypertrophy Split',
    splitBadge:    '4 days / week',
    split: [
      { day: 'Monday',    label: 'Push (Chest / Shoulders / Triceps)', type: 'work' },
      { day: 'Tuesday',   label: 'Pull (Back / Biceps)',                type: 'work' },
      { day: 'Wednesday', label: 'Rest / Mobility',                    type: 'rest' },
      { day: 'Thursday',  label: 'Legs (Quads / Hams / Glutes)',       type: 'work' },
      { day: 'Friday',    label: 'Upper Body (Volume Focus)',           type: 'work' },
      { day: 'Saturday',  label: 'Rest / Active Recovery',             type: 'rest' },
      { day: 'Sunday',    label: 'Rest',                               type: 'rest' },
    ],
    todayName:     'Push Day 🏋️',
    todayMeta:     '6 exercises · ~60 min · High volume hypertrophy',
    aiTip:         '"You hit 4 sets last session with solid technique. Try a 5th set on incline today to push chest volume closer to your weekly target."',
    prLabel:       'Incline DB\nPress PR',
    prValue:       '80',
    prUnit:        'lbs',
    programName:   'Hypertrophy Block',
    topPR:         'Incline DB Press — 80 lbs ea.',
    completePR:    '+2.5',
    completePRLbl: 'inches Arms',
    exercises: [
      { name: 'Incline DB Press',    eq: 'Dumbbells', target: '4 × 10 @ 70 lbs ea.', rest: '90 sec', muscle: 'Upper Chest' },
      { name: 'Flat Cable Fly',      eq: 'Cable',     target: '3 × 15 @ 30 lbs',    rest: '60 sec', muscle: 'Chest'       },
      { name: 'Dumbbell OHP',        eq: 'Dumbbells', target: '4 × 12 @ 50 lbs ea.',rest: '90 sec', muscle: 'Shoulders'   },
      { name: 'Lateral Raises',      eq: 'Dumbbells', target: '4 × 15 @ 20 lbs ea.',rest: '60 sec', muscle: 'Delts'       },
      { name: 'Overhead Tricep Ext', eq: 'Dumbbell',  target: '3 × 15 @ 40 lbs',    rest: '60 sec', muscle: 'Triceps'     },
      { name: 'Tricep Pushdown',     eq: 'Cable',     target: '3 × 15 @ 50 lbs',    rest: '60 sec', muscle: 'Triceps'     },
    ],
    liveExercises: [
      { name: 'Incline DB Press',    meta: 'Dumbbells · Ex 1 of 6', target: '4×10 @ 70 lbs', rest: '90 sec', prev: '4 sets · 65 lbs · 10 reps avg' },
      { name: 'Flat Cable Fly',      meta: 'Cable · Ex 2 of 6',     target: '3×15 @ 30 lbs', rest: '60 sec', prev: '3 sets · 27.5 lbs · 15 reps'  },
      { name: 'Dumbbell OHP',        meta: 'Dumbbells · Ex 3 of 6', target: '4×12 @ 50 lbs', rest: '90 sec', prev: '4 sets · 47.5 lbs · 12 reps'  },
      { name: 'Lateral Raises',      meta: 'Dumbbells · Ex 4 of 6', target: '4×15 @ 20 lbs', rest: '60 sec', prev: '4 sets · 17.5 lbs · 15 reps'  },
      { name: 'Overhead Tricep Ext', meta: 'Dumbbell · Ex 5 of 6',  target: '3×15 @ 40 lbs', rest: '60 sec', prev: '3 sets · 37.5 lbs · 15 reps'  },
      { name: 'Tricep Pushdown',     meta: 'Cable · Ex 6 of 6',     target: '3×15 @ 50 lbs', rest: '60 sec', prev: '3 sets · 45 lbs · 15 reps'    },
    ],
    planDays: [
      { name: 'Push (Chest / Shoulders)',  meta: 'Incline DB · Fly · OHP · 6 exercises',   time: '~60 min', status: 'today'    },
      { name: 'Pull (Back / Biceps)',      meta: 'Pulldown · Cable Row · Curl · 6 ex',      time: '58 min',  status: 'done'    },
      { name: 'Rest / Mobility',           meta: 'Light stretching · Foam rolling',          time: '—',       status: 'rest'    },
      { name: 'Legs (Quad & Glute Focus)', meta: 'Leg Press · Hack Squat · RDL · 6 ex',     time: '62 min',  status: 'done'    },
      { name: 'Upper Body Volume',         meta: 'High rep · Supersets · Full upper body',   time: '~55 min', status: 'upcoming'},
    ],
    recommendation: 'Add one more working set to incline DB press — your volume is trending <strong>12% below target</strong> for chest this week',
    insights: [
      { type: 'pos',  icon: '📏', main: 'Arm measurement up 0.3 inches this month', detail: 'Bicep volume is well above minimum effective dose'   },
      { type: 'warn', icon: '⚖️', main: 'Chest volume slightly low this week',      detail: 'Aim for 18–20 sets/week for your hypertrophy goal'   },
      { type: 'pos',  icon: '🔥', main: '12-day streak maintained',                 detail: 'Frequency is the most underrated hypertrophy driver' },
      { type: 'neu',  icon: '💤', main: 'Recovery is adequate',                     detail: 'Muscle protein synthesis peaks 24–36 hours post-lift' },
    ],
    adjustments: [
      { exercise: 'Incline DB Press',    change: '+5 lbs',     type: 'up'   },
      { exercise: 'Flat Cable Fly',      change: '+2.5 lbs',   type: 'up'   },
      { exercise: 'Dumbbell OHP',        change: '+2.5 lbs',   type: 'up'   },
      { exercise: 'Lateral Raises',      change: 'Hold weight', type: 'hold' },
      { exercise: 'Tricep Work',         change: '+5 lbs',     type: 'up'   },
    ],
  },

  /* ── FAT LOSS ─────────────────────────────────────────────── */
  fatloss: {
    subtitle:      'Optimized for Fat Loss & Body Recomposition',
    splitTitle:    '6-Week Fat Loss Split',
    splitBadge:    '4 days / week',
    split: [
      { day: 'Monday',    label: 'Full Body Strength Circuit A',   type: 'work' },
      { day: 'Tuesday',   label: 'LISS Cardio (30–40 min walk)',   type: 'work' },
      { day: 'Wednesday', label: 'Full Body Strength Circuit B',   type: 'work' },
      { day: 'Thursday',  label: 'Rest / Active Recovery',        type: 'rest' },
      { day: 'Friday',    label: 'Full Body Metabolic Finisher',   type: 'work' },
      { day: 'Saturday',  label: 'LISS Cardio or Hike',           type: 'work' },
      { day: 'Sunday',    label: 'Rest',                          type: 'rest' },
    ],
    todayName:     'Full Body Circuit 🔥',
    todayMeta:     '6 exercises · ~45 min · Minimal rest periods',
    aiTip:         '"Keep rest periods at 60 seconds today to maintain the metabolic demand. Your calorie burn is 18% higher on circuit days than your rest days."',
    prLabel:       'Total Weekly\nCalories Burned',
    prValue:       '3,240',
    prUnit:        'kcal',
    programName:   'Fat Loss Block',
    topPR:         'Circuit B PR — 42 min (↓3 min)',
    completePR:    '−14',
    completePRLbl: 'lbs lost',
    exercises: [
      { name: 'Goblet Squat',       eq: 'Kettlebell', target: '4 × 15 @ 35 lbs',    rest: '60 sec', muscle: 'Quads / Glutes' },
      { name: 'DB Romanian DL',     eq: 'Dumbbells',  target: '3 × 12 @ 55 lbs ea.',rest: '60 sec', muscle: 'Hamstrings'     },
      { name: 'Push-Up to Row',     eq: 'Dumbbells',  target: '3 × 10 each side',   rest: '60 sec', muscle: 'Chest / Back'   },
      { name: 'Dumbbell Thruster',  eq: 'Dumbbells',  target: '3 × 12 @ 30 lbs ea.',rest: '60 sec', muscle: 'Full Body'      },
      { name: 'Renegade Row',       eq: 'Dumbbells',  target: '3 × 10 @ 30 lbs ea.',rest: '60 sec', muscle: 'Back / Core'    },
      { name: 'Plank + Shoulder Tap',eq:'Bodyweight', target: '3 × 30 taps',        rest: '45 sec', muscle: 'Core'           },
    ],
    liveExercises: [
      { name: 'Goblet Squat',        meta: 'Kettlebell · Ex 1 of 6', target: '4×15 @ 35 lbs',   rest: '60 sec', prev: '4 sets · 35 lbs · 15 reps'  },
      { name: 'DB Romanian DL',      meta: 'Dumbbells · Ex 2 of 6',  target: '3×12 @ 55 lbs',   rest: '60 sec', prev: '3 sets · 50 lbs · 12 reps'  },
      { name: 'Push-Up to Row',      meta: 'Dumbbells · Ex 3 of 6',  target: '3×10 each side',  rest: '60 sec', prev: '3 sets · 27.5 lbs · 10 reps'},
      { name: 'Dumbbell Thruster',   meta: 'Dumbbells · Ex 4 of 6',  target: '3×12 @ 30 lbs',   rest: '60 sec', prev: '3 sets · 27.5 lbs · 12 reps'},
      { name: 'Renegade Row',        meta: 'Dumbbells · Ex 5 of 6',  target: '3×10 @ 30 lbs',   rest: '60 sec', prev: '3 sets · 27.5 lbs · 10 reps'},
      { name: 'Plank + Shoulder Tap',meta: 'Bodyweight · Ex 6 of 6', target: '3×30 taps',       rest: '45 sec', prev: '3 sets · 30 taps'            },
    ],
    planDays: [
      { name: 'Full Body Circuit A',   meta: 'Goblet Squat · Thruster · Row · 6 ex', time: '~45 min', status: 'today'    },
      { name: 'LISS Cardio',           meta: '35-min brisk walk · Zone 2',           time: '35 min',  status: 'done'    },
      { name: 'Full Body Circuit B',   meta: 'DL · Push-Up Row · Core · 6 ex',       time: '44 min',  status: 'done'    },
      { name: 'Rest / Active Recovery',meta: 'Light walk · Mobility work',            time: '—',       status: 'rest'    },
      { name: 'Metabolic Finisher',    meta: 'AMRAP circuits · High intensity',       time: '~40 min', status: 'upcoming'},
    ],
    recommendation: 'Keep rest periods at <strong>60 seconds</strong> today — your average has crept to 90 sec which reduces calorie burn by ~15%',
    insights: [
      { type: 'pos',  icon: '⚖️', main: 'Weekly calorie deficit on track',        detail: 'Estimated −400 kcal/day average this week'            },
      { type: 'warn', icon: '🍗', main: 'Protein intake may be too low',          detail: 'Target 0.8–1g per lb of bodyweight to retain muscle'  },
      { type: 'pos',  icon: '🔥', main: 'Circuit days burning ~480 kcal/session', detail: 'Higher than last week — circuit density is improving' },
      { type: 'neu',  icon: '😴', main: 'Sleep is adequate',                      detail: 'Poor sleep raises cortisol and slows fat loss — keep it up' },
    ],
    adjustments: [
      { exercise: 'Goblet Squat',     change: '+5 lbs',    type: 'up'   },
      { exercise: 'DB Romanian DL',   change: '+5 lbs',    type: 'up'   },
      { exercise: 'Thruster',         change: 'Hold weight',type: 'hold' },
      { exercise: 'LISS Duration',    change: '+5 min',    type: 'up'   },
      { exercise: 'Rest Periods',     change: '↓ to 55s',  type: 'up'   },
    ],
  },

  /* ── ENDURANCE ───────────────────────────────────────────── */
  endurance: {
    subtitle:      'Optimized for Endurance & Cardiovascular Fitness',
    splitTitle:    '6-Week Endurance Split',
    splitBadge:    '5 days / week',
    split: [
      { day: 'Monday',    label: 'Tempo Run / Bike (30–45 min)',       type: 'work' },
      { day: 'Tuesday',   label: 'Strength Support (Lower Body)',       type: 'work' },
      { day: 'Wednesday', label: 'Long Slow Distance (45–60 min)',      type: 'work' },
      { day: 'Thursday',  label: 'Rest / Active Recovery',             type: 'rest' },
      { day: 'Friday',    label: 'Interval Training (HIIT)',           type: 'work' },
      { day: 'Saturday',  label: 'Strength Support (Upper Body)',       type: 'work' },
      { day: 'Sunday',    label: 'Rest',                               type: 'rest' },
    ],
    todayName:     'Interval Training ⚡',
    todayMeta:     '6 exercises · ~40 min · High-intensity intervals',
    aiTip:         '"Your VO2 max estimate improved by 4% this month. Keep Tuesday strength sessions — they directly support running economy and injury prevention."',
    prLabel:       '5K Time\nPR',
    prValue:       '24:10',
    prUnit:        'min',
    programName:   'Endurance Block',
    topPR:         '5K — 24:10 (new PR)',
    completePR:    '−4:20',
    completePRLbl: '5K Time',
    exercises: [
      { name: '400m Intervals × 6',   eq: 'Treadmill / Track', target: '6 × 400m @ 5K pace', rest: '90 sec', muscle: 'Cardiovascular' },
      { name: 'Jump Squat',            eq: 'Bodyweight',        target: '3 × 15',              rest: '60 sec', muscle: 'Legs / Power'   },
      { name: 'Burpee to Box Jump',    eq: 'Plyo Box',          target: '3 × 10',              rest: '75 sec', muscle: 'Full Body'      },
      { name: 'Single-Leg RDL',        eq: 'Dumbbells',         target: '3 × 10 @ 30 lbs ea.',rest: '60 sec', muscle: 'Hamstrings'     },
      { name: 'Lateral Band Walk',     eq: 'Resistance Band',   target: '3 × 20 each direction',rest:'45 sec', muscle: 'Glutes / Hip'  },
      { name: 'Dead Bug Hold',         eq: 'Bodyweight',        target: '3 × 30 sec',          rest: '30 sec', muscle: 'Core / Stability'},
    ],
    liveExercises: [
      { name: '400m Intervals × 6',  meta: 'Cardio · Ex 1 of 6',      target: '6×400m @ 5K pace', rest: '90 sec', prev: '6 intervals · avg 1:58/400m' },
      { name: 'Jump Squat',          meta: 'Bodyweight · Ex 2 of 6',   target: '3×15',             rest: '60 sec', prev: '3 sets · 15 reps'             },
      { name: 'Burpee to Box Jump',  meta: 'Plyo Box · Ex 3 of 6',     target: '3×10',             rest: '75 sec', prev: '3 sets · 10 reps'             },
      { name: 'Single-Leg RDL',      meta: 'Dumbbells · Ex 4 of 6',    target: '3×10 @ 30 lbs',   rest: '60 sec', prev: '3 sets · 27.5 lbs · 10 reps'  },
      { name: 'Lateral Band Walk',   meta: 'Band · Ex 5 of 6',         target: '3×20 each side',   rest: '45 sec', prev: '3 sets · 20 reps each'        },
      { name: 'Dead Bug Hold',       meta: 'Bodyweight · Ex 6 of 6',   target: '3×30 sec',         rest: '30 sec', prev: '3 sets · 30 sec'              },
    ],
    planDays: [
      { name: 'Interval Training (HIIT)',  meta: '400m repeats · Plyos · Core · 6 ex', time: '~40 min', status: 'today'    },
      { name: 'Tempo Run',                 meta: '30 min @ comfortably hard pace',      time: '30 min',  status: 'done'    },
      { name: 'Strength Support (Lower)',  meta: 'Squat · Lunge · Hip Hinge · 5 ex',   time: '45 min',  status: 'done'    },
      { name: 'Rest / Active Recovery',   meta: 'Easy walk · Yoga · Foam rolling',     time: '—',       status: 'rest'    },
      { name: 'Long Slow Distance',       meta: '50-min easy run · Zone 2',            time: '~50 min', status: 'upcoming'},
    ],
    recommendation: 'Your interval pace has plateaued — try reducing recovery to <strong>75 seconds</strong> this week to build aerobic capacity',
    insights: [
      { type: 'pos',  icon: '🏃', main: '5K time improved by 45 seconds this month', detail: 'Interval training is directly translating to race pace'     },
      { type: 'warn', icon: '🦵', main: 'Right hamstring tightness noted',            detail: 'Add 5 min of targeted stretching post-run this week'        },
      { type: 'pos',  icon: '💗', main: 'Resting HR down 4 bpm this month',           detail: 'Strong indicator of improving cardiovascular efficiency'     },
      { type: 'neu',  icon: '⚡', main: 'Strength sessions are on schedule',          detail: 'Maintaining strength while building endurance is the sweet spot' },
    ],
    adjustments: [
      { exercise: '400m Interval Pace',  change: '−3 sec/400m',  type: 'up'   },
      { exercise: 'Interval Rest',       change: '↓ to 75 sec',  type: 'up'   },
      { exercise: 'Long Run Duration',   change: '+5 min',        type: 'up'   },
      { exercise: 'Jump Squat',          change: 'Add weight vest',type:'up'   },
      { exercise: 'Single-Leg RDL',      change: '+5 lbs',        type: 'up'   },
    ],
  },
};

/* ============================================================
   APP STATE
   ============================================================ */
const S = {
  goal:      'strength',  // default; overwritten by pickGoal()
  exIdx:     0,
  sets:      {},
  wtSec:     0,
  wtTimer:   null,
  rstSec:    0,
  rstTimer:  null,
  progChart: null,
  musChart:  null,
};

/* ============================================================
   CHART DATA (progress analytics — same for all goals for demo)
   ============================================================ */
const CHART_DATA = {
  bench:    { title:'Bench Press Progress',    labels:['W1','W2','W3','W4','W5','W6'], data:[185,195,205,215,235,245], pr:'245 lbs', delta:'+60 lbs from start 🎉' },
  squat:    { title:'Squat Progress',          labels:['W1','W2','W3','W4','W5','W6'], data:[225,245,255,265,280,295], pr:'295 lbs', delta:'+70 lbs from start 🎉' },
  deadlift: { title:'Deadlift Progress',       labels:['W1','W2','W3','W4','W5','W6'], data:[275,295,315,325,345,365], pr:'365 lbs', delta:'+90 lbs from start 🎉' },
  ohp:      { title:'Overhead Press Progress', labels:['W1','W2','W3','W4','W5','W6'], data:[95,100,105,115,120,130],  pr:'130 lbs', delta:'+35 lbs from start 🎉' },
};

const LB_SUBS = {
  weekly:  'Most workouts this week · University Fitness',
  monthly: 'Most workouts this month · University Fitness',
  alltime: 'All-time leaderboard · University Fitness',
};

const AI_LIVE_TIPS = [
  '"Strong start. Hit all target reps on set 1 before adding weight."',
  '"Nice consistency. Try a 2.5–5 lb increase if that felt controlled."',
  '"Rest timer is your friend — full rest periods keep strength output high."',
  '"You\'re 2 sets away from hitting your volume target. Stay focused."',
  '"Great session. Your progressive overload trend is exactly on track."',
];

/* ============================================================
   NAVIGATION
   ============================================================ */
function go(id) {
  const PAGE_MAP = {
    's-dash':       'page-dash',
    's-plan':       'page-plan',
    's-preworkout': 'page-preworkout',
    's-live':       'page-live',
    's-ai':         'page-ai',
    's-progress':   'page-progress',
    's-lb':         'page-lb',
    's-profile':    'page-profile',
  };
  const PRE_AUTH = ['s-login', 's-onboard', 's-program'];

  if (PRE_AUTH.includes(id)) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen--active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('screen--active');
    stopWt();
  } else if (PAGE_MAP[id]) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen--active'));
    const shell = document.getElementById('s-dash');
    if (shell) shell.classList.add('screen--active');
    swPage(PAGE_MAP[id]);

    document.querySelectorAll('.sidebar-link').forEach(btn => {
      btn.classList.toggle('sidebar-link--active', btn.dataset.screen === id);
    });

    // Re-stamp all goal-driven content whenever we enter the app shell
    renderGoalContent();

    if (id === 's-live') { startWt(); renderSets(); renderLivePills(); renderLiveExList(); }
    else stopWt();
    if (id === 's-progress') setTimeout(initCharts, 100);
  }
}

function swPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'));
  const target = document.getElementById(pageId);
  if (target) { target.classList.add('page--active'); }
  const mainArea = document.getElementById('main-area');
  if (mainArea) mainArea.scrollTop = 0;
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    btn.classList.toggle('bnav-btn--active', btn.dataset.page === pageId);
  });
  updateMobileTopbar(pageId);
}

function updateMobileTopbar(pageId) {
  const right = document.getElementById('mobile-topbar-right');
  if (!right) return;
  if (pageId === 'page-live') {
    right.innerHTML = `<span style="font-family:var(--font-head);font-weight:800;color:var(--blue-2);font-size:.95rem" id="wt-display-m">00:00</span>`;
  } else {
    right.innerHTML = `<button class="icon-btn" onclick="go('s-profile')" title="Profile">👤</button>`;
  }
}

/* ============================================================
   GOAL SELECTION
   ============================================================ */
function pickGoal(el) {
  document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('goal-card--selected'));
  el.classList.add('goal-card--selected');
  S.goal = el.dataset.g;
  S.sets = {}; // reset any logged sets when goal changes

  const btn = document.getElementById('goal-btn');
  if (btn) btn.disabled = false;

  // Update program-ready screen immediately
  renderProgramSplit();
}

/* ============================================================
   GOAL-DRIVEN RENDER FUNCTIONS
   Called once when entering the app shell to stamp all
   goal-dependent content across every page.
   ============================================================ */

/** Render the weekly split table on the program-ready screen */
function renderProgramSplit() {
  const g = GOAL_DATA[S.goal];
  if (!g) return;

  setText('prog-sub',         g.subtitle);
  setText('prog-split-title', g.splitTitle);
  setText('prog-split-badge', g.splitBadge);

  const table = document.getElementById('split-table');
  if (!table) return;
  table.innerHTML = g.split.map(row => `
    <div class="split-row">
      <span class="split-day">${row.day}</span>
      <span class="split-type ${row.type === 'work' ? 'split-type--work' : 'split-type--rest'}">${row.label}</span>
    </div>
  `).join('');
}

/** Stamp all goal-driven content across the app shell pages */
function renderGoalContent() {
  const g = GOAL_DATA[S.goal];
  if (!g) return;

  // ── Dashboard ──
  setText('dash-today-name',      g.todayName);
  setText('dash-today-meta',      g.todayMeta);
  setText('dash-ai-tip',          g.aiTip);
  const prNumEl = document.getElementById('dash-pr-num');
  if (prNumEl) prNumEl.innerHTML = g.prValue + `<span class="stat-unit">${g.prUnit}</span>`;
  // Use first line of prLabel for the stat card
  const prLblEl = document.getElementById('dash-pr-label');
  if (prLblEl) prLblEl.innerHTML = g.prLabel.replace('\n', '<br>');

  // Exercise preview
  const previewTitle = document.getElementById('dash-ex-preview-title');
  if (previewTitle) previewTitle.textContent = `Today's Exercises — ${g.todayName.replace(/\s[\p{Emoji}]/u,'').trim()}`;
  const previewGrid = document.getElementById('dash-ex-preview');
  if (previewGrid) {
    previewGrid.innerHTML = g.exercises.map((ex, i) => `
      <div class="ex-preview-item">
        <span class="ex-preview-num">${i + 1}</span>
        <span class="ex-preview-name">${ex.name}</span>
        <span class="ex-preview-detail">${ex.target}</span>
        <span class="ex-preview-tag">${ex.muscle}</span>
      </div>
    `).join('');
  }

  // ── Workout Plan page ──
  const planLabel = document.getElementById('plan-program-label');
  if (planLabel) planLabel.textContent = `Week 4 of 6 · ${g.programName}`;

  renderPlanDays();
  renderPlanDetail();

  // ── Live Workout ──
  // Pills + list built on swEx() calls; just update the session label
  const liveLabel = document.getElementById('live-session-label');
  if (liveLabel) liveLabel.textContent = `${g.todayName.replace(/\s[\p{Emoji}]/u,'').trim()} · ${g.liveExercises.length} exercises`;

  // ── AI Coach page ──
  const recEl = document.getElementById('ai-rec-main');
  if (recEl) recEl.innerHTML = g.recommendation;

  const insightsEl = document.getElementById('ai-insights');
  if (insightsEl) {
    insightsEl.innerHTML = g.insights.map(ins => `
      <div class="insight insight--${ins.type === 'pos' ? 'positive' : ins.type === 'warn' ? 'warning' : 'neutral'}">
        <span class="insight-icon">${ins.icon}</span>
        <div>
          <p class="insight-main">${ins.main}</p>
          <p class="insight-detail">${ins.detail}</p>
        </div>
      </div>
    `).join('');
  }

  const adjEl = document.getElementById('ai-adj-table');
  if (adjEl) {
    adjEl.innerHTML = `<div class="adj-row adj-row--header"><span>Exercise</span><span>Change</span></div>` +
      g.adjustments.map(a => `
        <div class="adj-row">
          <span class="adj-ex">${a.exercise}</span>
          <span class="${a.type === 'up' ? 'adj-up' : a.type === 'hold' ? 'adj-hold' : 'adj-down'}">${a.change}</span>
        </div>
      `).join('');
  }

  // ── Profile page ──
  const goalNames = { strength:'Strength', hypertrophy:'Hypertrophy', fatloss:'Fat Loss', endurance:'Endurance' };
  const goalEmoji = { strength:'💪', hypertrophy:'🏋️', fatloss:'🔥', endurance:'🏃' };
  const goalName  = goalNames[S.goal] || 'Strength';
  const goalIco   = goalEmoji[S.goal] || '💪';

  setText('profile-goal-tag',     `${goalIco} ${goalName} · Week 4 of 6`);
  setText('profile-program-name', g.programName);
  setText('profile-top-pr',       g.topPR);
  setText('profile-complete-sub', `Congratulations on finishing your 6-week ${goalName} program!`);
  setText('profile-complete-pr',  g.completePR);
  setText('profile-complete-pr-label', g.completePRLbl);
  setText('sidebar-goal-label',   `${goalName} · Week 4/6`);

  // ── Progress highlight stat ──
  setText('prog-pr-highlight',       g.completePR);
  setText('prog-pr-highlight-label', g.completePRLbl + ' Gain');
}

/** Render the day cards in the plan page */
function renderPlanDays() {
  const g    = GOAL_DATA[S.goal];
  const col  = document.getElementById('plan-days-col');
  if (!g || !col) return;

  const statusClasses = { today: 'day-card--today', done: 'day-card--done', rest: 'day-card--rest', upcoming: '' };
  const badgeClasses  = { today: 'day-badge--today', done: 'day-badge--done', rest: 'day-badge--rest', upcoming: 'day-badge--upcoming' };
  const badgeLabels   = { today: 'TODAY', done: '✓ DONE', rest: 'REST', upcoming: 'UPCOMING' };
  const clickAttr     = { today: `onclick="go('s-preworkout')"`, done: '', rest: '', upcoming: '' };

  col.innerHTML = g.planDays.map(d => `
    <div class="day-card ${statusClasses[d.status] || ''}" ${clickAttr[d.status] || ''}>
      <div class="day-card-left">
        <span class="day-badge ${badgeClasses[d.status]}">${badgeLabels[d.status]}</span>
        <h3 class="day-card-name">${d.name}</h3>
        <p class="day-card-meta">${d.meta}</p>
      </div>
      <div class="day-card-right">
        <span class="day-card-time">${d.time}</span>
        ${d.status === 'today'    ? '<span class="day-card-arrow">→</span>' : ''}
        ${d.status === 'done'     ? '<span class="day-card-check">✓</span>'  : ''}
      </div>
    </div>
  `).join('');
}

/** Render the exercise breakdown table in the plan detail panel */
function renderPlanDetail() {
  const g  = GOAL_DATA[S.goal];
  const el = document.getElementById('plan-exercise-table');
  const titleEl = document.getElementById('plan-detail-title');
  if (!g || !el) return;

  const todayDay = g.planDays.find(d => d.status === 'today');
  if (titleEl && todayDay) titleEl.textContent = `${todayDay.name} — Exercise Breakdown`;

  el.innerHTML = g.exercises.map((ex, i) => `
    <div class="exercise-table-row">
      <span class="ex-num-badge">${i + 1}</span>
      <div class="ex-info"><span class="ex-name">${ex.name}</span><span class="ex-eq">${ex.eq}</span></div>
      <span class="ex-target">${ex.target}</span>
      <span class="ex-rest-time">${ex.rest}</span>
      <span class="muscle-tag">${ex.muscle}</span>
    </div>
  `).join('');
}

/* ============================================================
   PRE-WORKOUT SLIDERS
   ============================================================ */
function slUpdate(key, value) {
  const map = { sleep: 'sv-sleep', sore: 'sv-sore', energy: 'sv-energy' };
  setText(map[key], value + ' / 10');
  recalc();
}

function recalc() {
  const sleep  = +document.getElementById('sl-sleep').value;
  const sore   = +document.getElementById('sl-sore').value;
  const energy = +document.getElementById('sl-energy').value;
  const score  = Math.round(Math.max(20, Math.min(100,
    (sleep / 10) * 40 + (energy / 10) * 40 + ((10 - sore) / 10) * 20
  )));
  setText('rc-score', score + '%');
  const statusEl = document.getElementById('rc-status');
  if (statusEl) {
    statusEl.className = 'rr-status';
    if (score >= 75) { statusEl.textContent = '✓ Ready to train at full intensity';       statusEl.classList.add('rr-status--good'); }
    else if (score >= 50) { statusEl.textContent = '⚡ Moderate intensity recommended today'; statusEl.classList.add('rr-status--warn'); }
    else                  { statusEl.textContent = '😴 Consider a rest day or light session'; statusEl.classList.add('rr-status--low');  }
  }
  const bs = document.getElementById('rr-bar-sleep');  if (bs) bs.style.width = (sleep / 10 * 100) + '%';
  const be = document.getElementById('rr-bar-energy'); if (be) be.style.width = (energy / 10 * 100) + '%';
  const bf = document.getElementById('rr-bar-fresh');  if (bf) bf.style.width = ((10 - sore) / 10 * 100) + '%';
}

/* ============================================================
   LIVE WORKOUT TRACKER
   ============================================================ */

/** Render exercise pills from current goal's liveExercises */
function renderLivePills() {
  const g   = GOAL_DATA[S.goal];
  const el  = document.getElementById('expills');
  if (!g || !el) return;
  el.innerHTML = g.liveExercises.map((ex, i) => `
    <button class="ex-pill ${i === S.exIdx ? 'ex-pill--active' : ''}" onclick="swEx(${i})">
      ${i + 1}. ${ex.name.split(' ').slice(0, 2).join(' ')}
    </button>
  `).join('');
}

/** Render the sidebar exercise status list */
function renderLiveExList() {
  const g  = GOAL_DATA[S.goal];
  const el = document.getElementById('live-ex-list');
  if (!g || !el) return;
  el.innerHTML = g.liveExercises.map((ex, i) => {
    const sets = S.sets[i] || [];
    return `
      <div class="live-ex-item ${i === S.exIdx ? 'live-ex-item--active' : ''}" onclick="swEx(${i})">
        <span class="lex-num">${i + 1}</span>
        <span class="lex-name">${ex.name.split(' ').slice(0, 3).join(' ')}</span>
        <span class="lex-status" id="lex-${i}">${sets.length > 0 ? sets.length + ' sets' : '–'}</span>
      </div>
    `;
  }).join('');
}

/** Switch active exercise */
function swEx(index) {
  S.exIdx = index;
  const g  = GOAL_DATA[S.goal];
  if (!g) return;
  const ex = g.liveExercises[index];
  if (!ex) return;

  // Re-render pills and list with updated active state
  renderLivePills();
  renderLiveExList();

  setText('ex-name',     ex.name);
  setText('ex-meta',     ex.meta);
  setText('ex-target',   'Target: ' + ex.target);
  setText('ex-rest-chip','Rest: ' + ex.rest);
  setText('prev-best',   ex.prev);
  renderSets();

  const totalSets = Object.values(S.sets).flat().length;
  setText('live-ai-tip', AI_LIVE_TIPS[Math.min(totalSets, AI_LIVE_TIPS.length - 1)]);
}

/** Render sets table for current exercise */
function renderSets() {
  const sets  = S.sets[S.exIdx] || [];
  const list  = document.getElementById('sets-list');
  const empty = document.getElementById('sets-empty');
  if (!list) return;
  if (sets.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');
  list.innerHTML = sets.map((s, i) => `
    <div class="set-row">
      <span class="sn">${i + 1}</span>
      <span class="sw">${s.weight} lbs</span>
      <span class="sr">${s.reps} reps</span>
      <span class="ss">✓ Done</span>
    </div>
  `).join('');
}

function updateWStats() {
  const all = Object.values(S.sets).flat();
  const vol = all.reduce((a, s) => a + s.weight * s.reps, 0);
  const m   = Math.floor(S.wtSec / 60), sec = S.wtSec % 60;
  setText('wstat-sets', all.length.toString());
  setText('wstat-vol',  vol.toLocaleString());
  setText('wstat-time', pad2(m) + ':' + pad2(sec));
}

// ── Modal ─────────────────────────────────────────────────────
function openModal() {
  const g    = GOAL_DATA[S.goal];
  const sets = S.sets[S.exIdx] || [];
  setText('m-num',    '#' + (sets.length + 1));
  setText('m-exname', g ? g.liveExercises[S.exIdx]?.name : '');
  if (sets.length > 0) {
    setVal('m-weight', sets[sets.length - 1].weight);
    setVal('m-reps',   sets[sets.length - 1].reps);
  } else {
    // Pull default weight from first number in target string
    const ex     = g?.liveExercises[S.exIdx];
    const wMatch = ex?.target.match(/(\d+)\s*lbs/);
    const rMatch = ex?.target.match(/×\s*(\d+)/);
    setVal('m-weight', wMatch ? parseInt(wMatch[1]) : 135);
    setVal('m-reps',   rMatch ? parseInt(rMatch[1]) : 8);
  }
  document.getElementById('modal').classList.remove('modal-overlay--hidden');
  setTimeout(() => document.getElementById('m-weight').focus(), 80);
}

function closeModal() { document.getElementById('modal').classList.add('modal-overlay--hidden'); }

function saveSet() {
  const weight = parseInt(document.getElementById('m-weight').value) || 0;
  const reps   = parseInt(document.getElementById('m-reps').value)   || 0;
  if (!S.sets[S.exIdx]) S.sets[S.exIdx] = [];
  S.sets[S.exIdx].push({ weight, reps });
  closeModal();
  renderSets();
  updateWStats();
  renderLiveExList();
  startRest();
  const count = S.sets[S.exIdx].length;
  if (count === 1) setTimeout(() => toast('✅ Set 1 logged! Rest timer started.'), 300);
  else if (count === 2) setTimeout(() => toast('🤖 AI: Looking good — consider +5 lbs next set.'), 350);
  else if (count >= 4) setTimeout(() => toast('💪 Target sets complete! Move to next exercise.'), 350);
  const total = Object.values(S.sets).flat().length;
  setText('live-ai-tip', AI_LIVE_TIPS[Math.min(total, AI_LIVE_TIPS.length - 1)]);
}

function finishWo() {
  stopWt(); skipRest();
  const total = Object.values(S.sets).flat().length;
  const vol   = Object.values(S.sets).flat().reduce((a, s) => a + s.weight * s.reps, 0);
  toast(`🎉 Workout complete! ${total} sets · ${vol.toLocaleString()} lbs volume.`);
  setTimeout(() => go('s-ai'), 1400);
}

// ── Timers ────────────────────────────────────────────────────
function startWt() {
  stopWt(); S.wtSec = 0;
  S.wtTimer = setInterval(() => {
    S.wtSec++;
    const str = pad2(Math.floor(S.wtSec / 60)) + ':' + pad2(S.wtSec % 60);
    setText('wt-display',   str);
    setText('wt-display-m', str);
    updateWStats();
  }, 1000);
}
function stopWt() { if (S.wtTimer) { clearInterval(S.wtTimer); S.wtTimer = null; } }

function startRest() {
  if (S.rstTimer) clearInterval(S.rstTimer);
  S.rstSec = 180;
  const bar = document.getElementById('rest-bar');
  if (bar) bar.classList.remove('hidden');
  updRest();
  S.rstTimer = setInterval(() => {
    S.rstSec--;
    updRest();
    if (S.rstSec <= 0) { skipRest(); toast('⏱ Rest complete — time for your next set!'); }
  }, 1000);
}
function skipRest() {
  if (S.rstTimer) { clearInterval(S.rstTimer); S.rstTimer = null; }
  const bar = document.getElementById('rest-bar');
  if (bar) bar.classList.add('hidden');
}
function updRest() {
  const el = document.getElementById('rest-count');
  if (el) el.textContent = Math.floor(S.rstSec / 60) + ':' + pad2(S.rstSec % 60);
}

/* ============================================================
   CHARTS
   ============================================================ */
function initCharts() {
  const c1 = document.getElementById('prog-chart');
  if (c1) {
    if (S.progChart) { S.progChart.destroy(); S.progChart = null; }
    const d = CHART_DATA.bench;
    S.progChart = new Chart(c1, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{ label:'Max Weight (lbs)', data:d.data, borderColor:'#4f6ef7', backgroundColor:'rgba(79,110,247,.10)', borderWidth:2.5, pointBackgroundColor:'#4f6ef7', pointBorderColor:'#fff', pointBorderWidth:1.5, pointRadius:5, pointHoverRadius:8, tension:.4, fill:true }]
      },
      options: {
        responsive:true, maintainAspectRatio:true,
        plugins:{ legend:{display:false}, tooltip:{backgroundColor:'#141f35',borderColor:'#1f3050',borderWidth:1,titleColor:'#eef2ff',bodyColor:'#8b9cc8',padding:12,callbacks:{label:c=>'  '+c.parsed.y+' lbs'}} },
        scales:{ x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#8b9cc8',font:{size:11}},border:{color:'transparent'}}, y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#8b9cc8',font:{size:11}},border:{color:'transparent'}} }
      }
    });
  }
  const c2 = document.getElementById('muscle-chart');
  if (c2) {
    if (S.musChart) { S.musChart.destroy(); S.musChart = null; }
    S.musChart = new Chart(c2, {
      type: 'bar',
      data: { labels:['Chest','Back','Legs','Shoulders','Arms','Core'], datasets:[{ label:'Sets', data:[18,16,20,12,14,8], backgroundColor:['rgba(79,110,247,.82)','rgba(108,143,255,.82)','rgba(79,110,247,.68)','rgba(108,143,255,.68)','rgba(79,110,247,.52)','rgba(108,143,255,.48)'], borderRadius:7, borderWidth:0 }] },
      options: { responsive:true, maintainAspectRatio:true, plugins:{legend:{display:false},tooltip:{backgroundColor:'#141f35',titleColor:'#eef2ff',bodyColor:'#8b9cc8',borderColor:'#1f3050',borderWidth:1,padding:12,callbacks:{label:c=>'  '+c.parsed.y+' sets'}}}, scales:{x:{grid:{display:false},ticks:{color:'#8b9cc8',font:{size:11}},border:{color:'transparent'}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#8b9cc8',font:{size:11}},border:{color:'transparent'}}} }
    });
  }
}

function swChart(key, el) {
  document.querySelectorAll('#prog-pills .ex-pill').forEach(p => p.classList.remove('ex-pill--active'));
  el.classList.add('ex-pill--active');
  const d = CHART_DATA[key];
  if (!d || !S.progChart) return;
  S.progChart.data.datasets[0].data = d.data;
  S.progChart.data.labels = d.labels;
  S.progChart.update('active');
  setText('chart-title', d.title);
  setText('pr-val',  d.pr);
  setText('pr-delta', d.delta);
}

/* ============================================================
   LEADERBOARD
   ============================================================ */
function swLb(key, el) {
  document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('lb-tab--active'));
  el.classList.add('lb-tab--active');
  setText('lb-sub', LB_SUBS[key] || LB_SUBS.weekly);
  toast('Showing ' + key + ' leaderboard');
}

/* ============================================================
   TOAST
   ============================================================ */
let _tt = null;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  if (_tt) clearTimeout(_tt);
  el.textContent = msg;
  el.classList.remove('toast--hidden');
  _tt = setTimeout(() => el.classList.add('toast--hidden'), 2800);
}

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
const KEY_MAP = { '1':'s-login','2':'s-onboard','3':'s-program','4':'s-dash','5':'s-plan','6':'s-preworkout','7':'s-live','8':'s-ai','9':'s-progress','0':'s-lb','q':'s-profile' };
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (KEY_MAP[e.key]) { go(KEY_MAP[e.key]); toast('⌨️ Screen ' + e.key); }
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   UTILITY
   ============================================================ */
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setVal(id, val)  { const el = document.getElementById(id); if (el) el.value = val; }
function pad2(n)          { return n.toString().padStart(2, '0'); }

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  go('s-login');
  recalc();
  // Pre-render the default (strength) split so the program-ready
  // screen looks correct even if user skips onboarding in demo mode
  renderProgramSplit();

  console.log('%c IronSync MVP 🏋️ ', 'background:#4f6ef7;color:#fff;font-size:14px;font-weight:bold;padding:5px 12px;border-radius:6px;');
  console.log('Goal-driven splits: strength | hypertrophy | fatloss | endurance');
  console.log('Keys 1-9, 0, Q to jump screens · Esc to close modal');
});

