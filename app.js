/* ============================================================
   IRONSYNC — app.js
   Frontend MVP · Demo data only · No backend
   ============================================================

   Architecture:
   - Pre-auth screens (login, onboarding, program-ready) are full
     .screen elements that replace the viewport.
   - The app shell (#s-dash) is a persistent layout with a sidebar
     and a main content area containing multiple .page divs.
   - go(screenId) switches between pre-auth screens OR activates
     a page within the app shell.
   - swPage(pageId) is the internal page switcher for the app shell.
   - Sidebar links and mobile bottom nav both call go() or swPage().

   All data is hardcoded sample/demo data.
   ============================================================ */

'use strict';

// ── App state ─────────────────────────────────────────────────
const S = {
  goal:      null,        // selected onboarding goal key
  exIdx:     0,           // current exercise index in live tracker
  sets:      {},          // sets[exIdx] = [{weight, reps}, ...]
  wtSec:     0,           // workout timer seconds
  wtTimer:   null,        // setInterval ref for workout timer
  rstSec:    0,           // rest timer countdown seconds
  rstTimer:  null,        // setInterval ref for rest timer
  progChart: null,        // Chart.js line chart instance
  musChart:  null,        // Chart.js bar chart instance
};

// ── Exercise data (Push Day) ──────────────────────────────────
const EXERCISES = [
  { name: 'Barbell Bench Press', meta: 'Barbell · Exercise 1 of 5', target: '4×5 @ 225 lbs', rest: '3 min',  prev: '4 sets · 220 lbs · 5 reps avg' },
  { name: 'Overhead Press',      meta: 'Barbell · Exercise 2 of 5', target: '3×6 @ 135 lbs', rest: '2 min',  prev: '3 sets · 130 lbs · 6 reps avg' },
  { name: 'Incline DB Press',    meta: 'Dumbbells · Exercise 3 of 5',target: '3×8 @ 65 lbs',  rest: '2 min',  prev: '3 sets · 60 lbs · 8 reps avg'  },
  { name: 'Tricep Pushdown',     meta: 'Cable · Exercise 4 of 5',   target: '3×12 @ 70 lbs', rest: '90 sec', prev: '3 sets · 65 lbs · 12 reps avg' },
  { name: 'Lateral Raises',      meta: 'Dumbbells · Exercise 5 of 5',target: '3×15 @ 25 lbs', rest: '60 sec', prev: '3 sets · 20 lbs · 15 reps avg' },
];

// Default weights / reps per exercise for the modal pre-fill
const EX_DEFAULTS = {
  weight: [225, 135, 65, 70, 25],
  reps:   [5,   6,  8, 12, 15],
};

// AI coaching tips that rotate as sets are logged
const AI_LIVE_TIPS = [
  '"Strong start. Hit all target reps on set 1 before adding weight."',
  '"Nice consistency. Try a 2.5–5 lb increase if that felt controlled."',
  '"Rest timer is your friend — 3 full minutes keeps strength output high."',
  '"You\'re 2 sets away from hitting your volume target. Stay focused."',
  '"Great session. Your progressive overload trend is exactly on track."',
];

// ── Progress chart data ───────────────────────────────────────
const CHART_DATA = {
  bench: {
    title: 'Bench Press Progress',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    data:   [185, 195, 205, 215, 235, 245],
    pr: '245 lbs', delta: '+60 lbs from start 🎉',
  },
  squat: {
    title: 'Squat Progress',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    data:   [225, 245, 255, 265, 280, 295],
    pr: '295 lbs', delta: '+70 lbs from start 🎉',
  },
  deadlift: {
    title: 'Deadlift Progress',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    data:   [275, 295, 315, 325, 345, 365],
    pr: '365 lbs', delta: '+90 lbs from start 🎉',
  },
  ohp: {
    title: 'Overhead Press Progress',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    data:   [95, 100, 105, 115, 120, 130],
    pr: '130 lbs', delta: '+35 lbs from start 🎉',
  },
};

// Leaderboard tab subtitles
const LB_SUBS = {
  weekly:  'Most workouts this week · University Fitness',
  monthly: 'Most workouts this month · University Fitness',
  alltime: 'All-time leaderboard · University Fitness',
};

/* ============================================================
   NAVIGATION
   ============================================================ */

/**
 * Primary navigation function.
 * Handles both pre-auth full screens and in-app page switching.
 *
 * Pre-auth screen IDs: 's-login', 's-onboard', 's-program'
 * App-shell page IDs:  's-dash' → 'page-dash'
 *                      's-plan' → 'page-plan'  etc.
 */
function go(id) {
  // Map of screen shorthand IDs to their internal page IDs
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
    // ── Pre-auth screens ──
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen--active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('screen--active');

    // Hide app shell cleanup
    stopWt();

  } else if (PAGE_MAP[id]) {
    // ── App shell: ensure app shell is visible ──
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen--active'));
    const shell = document.getElementById('s-dash');
    if (shell) shell.classList.add('screen--active');

    swPage(PAGE_MAP[id]);

    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(btn => {
      btn.classList.toggle('sidebar-link--active', btn.dataset.screen === id);
    });

    // Page-specific side effects
    if (id === 's-live') {
      startWt();
      renderSets();
      updateLiveExList();
    } else {
      stopWt();
    }

    if (id === 's-progress') {
      // Slight delay so the canvas is visible before Chart.js renders
      setTimeout(initCharts, 100);
    }
  }
}

/**
 * Switch the visible .page within the app shell's main content area.
 * Also updates the mobile bottom nav active state.
 */
function swPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'));

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('page--active');
    // Scroll main area to top
    const mainArea = document.getElementById('main-area');
    if (mainArea) mainArea.scrollTop = 0;
  }

  // Sync mobile bottom nav
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    btn.classList.toggle('bnav-btn--active', btn.dataset.page === pageId);
  });

  // Update mobile topbar right content for live tracking
  updateMobileTopbar(pageId);
}

/** Update mobile topbar secondary content per page */
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
   GOAL SELECTION (Onboarding)
   ============================================================ */

function pickGoal(el) {
  // Deselect all, select clicked
  document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('goal-card--selected'));
  el.classList.add('goal-card--selected');
  S.goal = el.dataset.g;

  // Enable continue button
  const btn = document.getElementById('goal-btn');
  if (btn) btn.disabled = false;

  // Update program-ready subtitle
  const subtitles = {
    strength:    'Optimized for Strength Building',
    hypertrophy: 'Optimized for Muscle Growth (Hypertrophy)',
    fatloss:     'Optimized for Fat Loss & Body Recomposition',
    endurance:   'Optimized for Endurance & Conditioning',
  };
  const el2 = document.getElementById('prog-sub');
  if (el2) el2.textContent = subtitles[S.goal] || subtitles.strength;
}

/* ============================================================
   PRE-WORKOUT SLIDERS
   ============================================================ */

/**
 * Called on every slider input event.
 * Updates the displayed value and recalculates the recovery score.
 */
function slUpdate(key, value) {
  const map = { sleep: 'sv-sleep', sore: 'sv-sore', energy: 'sv-energy' };
  const el = document.getElementById(map[key]);
  if (el) el.textContent = value + ' / 10';
  recalc();
}

/** Recalculate recovery score from the three slider values */
function recalc() {
  const sleep  = +document.getElementById('sl-sleep').value;
  const sore   = +document.getElementById('sl-sore').value;
  const energy = +document.getElementById('sl-energy').value;

  // Weighted formula: sleep 40%, energy 40%, freshness (inverse soreness) 20%
  const score = Math.round(
    Math.max(20, Math.min(100,
      (sleep / 10) * 40 +
      (energy / 10) * 40 +
      ((10 - sore) / 10) * 20
    ))
  );

  // Update score display
  const scoreEl = document.getElementById('rc-score');
  if (scoreEl) scoreEl.textContent = score + '%';

  // Update status text + color class
  const statusEl = document.getElementById('rc-status');
  if (statusEl) {
    statusEl.className = 'rr-status';
    if (score >= 75) {
      statusEl.textContent = '✓ Ready to train at full intensity';
      statusEl.classList.add('rr-status--good');
    } else if (score >= 50) {
      statusEl.textContent = '⚡ Moderate intensity recommended today';
      statusEl.classList.add('rr-status--warn');
    } else {
      statusEl.textContent = '😴 Consider a rest day or light session';
      statusEl.classList.add('rr-status--low');
    }
  }

  // Update mini progress bars in recovery result card
  const barSleep  = document.getElementById('rr-bar-sleep');
  const barEnergy = document.getElementById('rr-bar-energy');
  const barFresh  = document.getElementById('rr-bar-fresh');
  if (barSleep)  barSleep.style.width  = (sleep / 10 * 100) + '%';
  if (barEnergy) barEnergy.style.width = (energy / 10 * 100) + '%';
  if (barFresh)  barFresh.style.width  = ((10 - sore) / 10 * 100) + '%';
}

/* ============================================================
   LIVE WORKOUT TRACKER
   ============================================================ */

/** Switch the active exercise in the live tracker */
function swEx(index) {
  S.exIdx = index;
  const ex = EXERCISES[index];

  // Update exercise pill active state
  document.querySelectorAll('.ex-pill').forEach((p, i) => {
    p.classList.toggle('ex-pill--active', i === index);
  });

  // Update exercise header card
  setText('ex-name',     ex.name);
  setText('ex-meta',     ex.meta);
  setText('ex-target',   'Target: ' + ex.target);
  setText('ex-rest-chip','Rest: ' + ex.rest);
  setText('prev-best',   ex.prev);

  // Update live exercise sidebar list
  updateLiveExList();

  // Re-render the sets table for this exercise
  renderSets();

  // Rotate AI tip based on total sets logged
  const totalSets = Object.values(S.sets).flat().length;
  const tip = AI_LIVE_TIPS[Math.min(totalSets, AI_LIVE_TIPS.length - 1)];
  setText('live-ai-tip', tip);
}

/** Render the sets table for the currently selected exercise */
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

/** Update the sidebar exercise list with set counts */
function updateLiveExList() {
  EXERCISES.forEach((ex, i) => {
    const statusEl = document.getElementById('lex-' + i);
    if (!statusEl) return;
    const sets = S.sets[i] || [];
    statusEl.textContent = sets.length > 0 ? sets.length + ' sets' : '–';

    const item = statusEl.closest('.live-ex-item');
    if (item) item.classList.toggle('live-ex-item--active', i === S.exIdx);
  });
}

/** Update the live session stat widgets */
function updateWStats() {
  const allSets = Object.values(S.sets).flat();
  const vol = allSets.reduce((acc, s) => acc + (s.weight * s.reps), 0);

  const m   = Math.floor(S.wtSec / 60);
  const sec = S.wtSec % 60;
  const timeStr = pad2(m) + ':' + pad2(sec);

  setText('wstat-sets', allSets.length.toString());
  setText('wstat-vol',  vol.toLocaleString());
  setText('wstat-time', timeStr);
}

// ── Modal ─────────────────────────────────────────────────────

/** Open the add-set modal pre-filled with smart defaults */
function openModal() {
  const sets = S.sets[S.exIdx] || [];
  const setNum = sets.length + 1;

  setText('m-num',    '#' + setNum);
  setText('m-exname', EXERCISES[S.exIdx].name);

  // Pre-fill with last logged set or exercise defaults
  if (sets.length > 0) {
    const last = sets[sets.length - 1];
    setVal('m-weight', last.weight);
    setVal('m-reps',   last.reps);
  } else {
    setVal('m-weight', EX_DEFAULTS.weight[S.exIdx] || 135);
    setVal('m-reps',   EX_DEFAULTS.reps[S.exIdx]   || 8);
  }

  document.getElementById('modal').classList.remove('modal-overlay--hidden');
  setTimeout(() => document.getElementById('m-weight').focus(), 80);
}

function closeModal() {
  document.getElementById('modal').classList.add('modal-overlay--hidden');
}

/** Save a set from the modal */
function saveSet() {
  const weight = parseInt(document.getElementById('m-weight').value) || 0;
  const reps   = parseInt(document.getElementById('m-reps').value)   || 0;

  if (!S.sets[S.exIdx]) S.sets[S.exIdx] = [];
  S.sets[S.exIdx].push({ weight, reps });

  closeModal();
  renderSets();
  updateWStats();
  updateLiveExList();
  startRest();

  // Progressive coaching toasts
  const count = S.sets[S.exIdx].length;
  if (count === 1) {
    setTimeout(() => toast('✅ Set 1 logged! Rest timer started.'), 300);
  } else if (count === 2) {
    setTimeout(() => toast('🤖 AI: Looking good — consider +5 lbs on set 3.'), 350);
  } else if (count >= 4) {
    setTimeout(() => toast('💪 Target sets complete! Move to next exercise.'), 350);
  }

  // Rotate AI tip in sidebar
  const totalSets = Object.values(S.sets).flat().length;
  const tip = AI_LIVE_TIPS[Math.min(totalSets, AI_LIVE_TIPS.length - 1)];
  setText('live-ai-tip', tip);
}

/** Finish the workout and navigate to AI coach screen */
function finishWo() {
  stopWt();
  skipRest();
  const total = Object.values(S.sets).flat().length;
  const vol   = Object.values(S.sets).flat().reduce((a, s) => a + s.weight * s.reps, 0);
  toast(`🎉 Workout complete! ${total} sets · ${vol.toLocaleString()} lbs volume.`);
  setTimeout(() => go('s-ai'), 1400);
}

// ── Workout timer ─────────────────────────────────────────────

function startWt() {
  stopWt();
  S.wtSec = 0;
  S.wtTimer = setInterval(() => {
    S.wtSec++;
    const m   = Math.floor(S.wtSec / 60);
    const sec = S.wtSec % 60;
    const str = pad2(m) + ':' + pad2(sec);
    setText('wt-display',   str);
    setText('wt-display-m', str); // mobile topbar mirror
    updateWStats();
  }, 1000);
}

function stopWt() {
  if (S.wtTimer) { clearInterval(S.wtTimer); S.wtTimer = null; }
}

// ── Rest timer ────────────────────────────────────────────────

function startRest() {
  if (S.rstTimer) clearInterval(S.rstTimer);
  S.rstSec = 180; // 3 minutes default

  const bar = document.getElementById('rest-bar');
  if (bar) bar.classList.remove('hidden');
  updateRestDisplay();

  S.rstTimer = setInterval(() => {
    S.rstSec--;
    updateRestDisplay();
    if (S.rstSec <= 0) {
      skipRest();
      toast('⏱ Rest complete — time for your next set!');
    }
  }, 1000);
}

function skipRest() {
  if (S.rstTimer) { clearInterval(S.rstTimer); S.rstTimer = null; }
  const bar = document.getElementById('rest-bar');
  if (bar) bar.classList.add('hidden');
}

function updateRestDisplay() {
  const el = document.getElementById('rest-count');
  if (!el) return;
  const m   = Math.floor(S.rstSec / 60);
  const sec = S.rstSec % 60;
  el.textContent = m + ':' + pad2(sec);
}

/* ============================================================
   PROGRESS CHARTS (Chart.js)
   ============================================================ */

/** Initialize or re-render both progress charts */
function initCharts() {
  initLineChart();
  initBarChart();
}

function initLineChart() {
  const canvas = document.getElementById('prog-chart');
  if (!canvas) return;

  if (S.progChart) { S.progChart.destroy(); S.progChart = null; }

  const d = CHART_DATA.bench;

  S.progChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [{
        label: 'Max Weight (lbs)',
        data: d.data,
        borderColor: '#4f6ef7',
        backgroundColor: 'rgba(79, 110, 247, 0.10)',
        borderWidth: 2.5,
        pointBackgroundColor: '#4f6ef7',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#141f35',
          borderColor: '#1f3050',
          borderWidth: 1,
          titleColor: '#eef2ff',
          bodyColor: '#8b9cc8',
          padding: 12,
          callbacks: { label: ctx => '  ' + ctx.parsed.y + ' lbs' },
        },
      },
      scales: {
        x: {
          grid:   { color: 'rgba(255,255,255,0.04)' },
          ticks:  { color: '#8b9cc8', font: { size: 11 } },
          border: { color: 'transparent' },
        },
        y: {
          grid:   { color: 'rgba(255,255,255,0.04)' },
          ticks:  { color: '#8b9cc8', font: { size: 11 } },
          border: { color: 'transparent' },
        },
      },
    },
  });
}

function initBarChart() {
  const canvas = document.getElementById('muscle-chart');
  if (!canvas) return;

  if (S.musChart) { S.musChart.destroy(); S.musChart = null; }

  S.musChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'],
      datasets: [{
        label: 'Sets This Week',
        data: [18, 16, 20, 12, 14, 8],
        backgroundColor: [
          'rgba(79,110,247,.82)',
          'rgba(108,143,255,.82)',
          'rgba(79,110,247,.68)',
          'rgba(108,143,255,.68)',
          'rgba(79,110,247,.52)',
          'rgba(108,143,255,.48)',
        ],
        borderRadius: 7,
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#141f35',
          titleColor: '#eef2ff',
          bodyColor: '#8b9cc8',
          borderColor: '#1f3050',
          borderWidth: 1,
          padding: 12,
          callbacks: { label: ctx => '  ' + ctx.parsed.y + ' sets' },
        },
      },
      scales: {
        x: { grid: { display: false },          ticks: { color: '#8b9cc8', font: { size: 11 } }, border: { color: 'transparent' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b9cc8', font: { size: 11 } }, border: { color: 'transparent' } },
      },
    },
  });
}

/** Switch the progress line chart to a different lift */
function swChart(key, el) {
  // Update pill active state — only within #prog-pills
  document.querySelectorAll('#prog-pills .ex-pill').forEach(p => p.classList.remove('ex-pill--active'));
  el.classList.add('ex-pill--active');

  const d = CHART_DATA[key];
  if (!d || !S.progChart) return;

  S.progChart.data.datasets[0].data  = d.data;
  S.progChart.data.labels            = d.labels;
  S.progChart.update('active');

  setText('chart-title', d.title);
  setText('pr-val',      d.pr);
  setText('pr-delta',    d.delta);
}

/* ============================================================
   LEADERBOARD TABS
   ============================================================ */

function swLb(key, el) {
  document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('lb-tab--active'));
  el.classList.add('lb-tab--active');
  setText('lb-sub', LB_SUBS[key] || LB_SUBS.weekly);
  toast('Showing ' + key + ' leaderboard');
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */

let _toastTimer = null;

function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;

  if (_toastTimer) clearTimeout(_toastTimer);

  el.textContent = message;
  el.classList.remove('toast--hidden');

  _toastTimer = setTimeout(() => {
    el.classList.add('toast--hidden');
  }, 2800);
}

/* ============================================================
   KEYBOARD SHORTCUTS  (press 1–9, 0, q in any non-input context)
   Useful for live demos and recruiter walkthroughs.
   ============================================================ */
const KEY_MAP = {
  '1': 's-login',
  '2': 's-onboard',
  '3': 's-program',
  '4': 's-dash',
  '5': 's-plan',
  '6': 's-preworkout',
  '7': 's-live',
  '8': 's-ai',
  '9': 's-progress',
  '0': 's-lb',
  'q': 's-profile',
};

document.addEventListener('keydown', e => {
  // Don't fire inside text inputs or textareas
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (KEY_MAP[e.key]) {
    go(KEY_MAP[e.key]);
    toast('⌨️ Jumped to screen ' + e.key);
  }

  // Escape closes the modal
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/** Set textContent safely */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/** Set an input value safely */
function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

/** Zero-pad a number to 2 digits */
function pad2(n) {
  return n.toString().padStart(2, '0');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Start on login screen
  go('s-login');

  // Initialise recovery slider display
  recalc();

  // Console branding for demo/portfolio
  console.log(
    '%c IronSync MVP 🏋️ ',
    'background: #4f6ef7; color: #fff; font-size: 14px; font-weight: bold; padding: 5px 12px; border-radius: 6px;'
  );
  console.log('Frontend MVP · Demo data only · No backend · No real auth');
  console.log('Keyboard shortcuts: 1–9, 0 = screens, Q = profile, Esc = close modal');
});
