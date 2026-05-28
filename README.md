# IronSync — AI Fitness Coaching Platform

> **Frontend MVP · MIS Portfolio Project · Demo data only**
> Built from real coursework research, wireframes, and business model analysis.

---

## Overview

IronSync is a frontend concept for an AI-powered fitness coaching platform aimed at college students and beginner-to-intermediate lifters. I've been lifting for five years, and the idea came directly from a frustration I kept running into: most fitness apps either track what you did or tell you what to do, but almost none adapt based on how you're actually recovering or progressing week to week.

What makes this project a little different is that it started as the same core idea used for two separate classes — approached from completely different angles. In **MIS 3100 (Information Systems Analysis)**, I designed the full wireframe package for IronSync and presented how the system would work from a UX and information flow perspective. In **ENTSP 3100 (Entrepreneurship and Innovation)**, I took that same product concept and researched whether it could actually work in the real market — competitive landscape, target customer, business model feasibility, and value proposition. This repository is what happened when I decided to actually build the thing I'd spent two semesters designing and researching.

**This is not a launched product.** It uses sample data only. There is no backend, no real authentication, no subscriptions, and no paid APIs. The goal is to demonstrate product thinking, frontend development, and UX design as a portfolio piece.

---

## The Problem

After five years of lifting, I still found myself guessing on bad days — should I push hard when I'm under-slept and sore, or back off? Most apps don't help with that. They either replay the same program regardless of how you feel, or they dump data on you without telling you what to do with it.

For beginners, it's even worse. The people most likely to quit — college students in their first few months of training — have the least context for understanding whether they're progressing, overtraining, or just going through the motions. Generic programs don't adapt. Cookie-cutter apps don't account for recovery. And without visible feedback on whether what you're doing is actually working, motivation fades fast.

IronSync is a prototype of what a smarter, more personalized coaching experience could look like: one that accounts for how you feel on a given day, adjusts load suggestions based on actual performance, and gives newer lifters the kind of structured feedback that usually only comes from a knowledgeable training partner.

---

## Target Users

- College students (18–24) who are new to structured resistance training
- Beginner-to-intermediate lifters training without a personal trainer
- People who want progressive overload guidance without having to research it themselves
- Students who respond to social accountability features like leaderboards and streaks

---

## Key Features

| Feature | Description |
|---|---|
| **Goal-based onboarding** | Select Strength, Hypertrophy, Fat Loss, or Endurance — program adapts accordingly |
| **Weekly workout plan** | Full 6-day split with exercise breakdowns, sets/reps targets, and rest day scheduling |
| **Pre-workout recovery check** | Three sliders (sleep, soreness, energy) calculate a dynamic recovery score that would influence training intensity |
| **Live workout tracker** | Log sets with weight and reps, auto-starts rest timer, tracks total volume and elapsed time |
| **AI coach recommendations** | Simulated adaptive coaching: progressive overload suggestions, weekly insights, volume balance analysis |
| **Progress analytics** | Chart.js line charts for bench/squat/deadlift/OHP over 6 weeks, volume by muscle group, monthly summary |
| **Leaderboard** | Weekly/monthly/all-time views with podium visualization and motivational progress indicator |
| **Profile & settings** | Stats summary, achievement badges, program complete card |
| **Full desktop layout** | Left sidebar navigation, multi-column content layouts, designed for a real SaaS dashboard experience |
| **Mobile responsive** | Collapses to bottom nav + single column on small screens |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic, ARIA-labeled) |
| Styling | CSS3 — custom properties, grid, flexbox, animations |
| Logic | Vanilla JavaScript ES6+ — no frameworks |
| Charts | Chart.js 4.4 (CDN) |
| Fonts | Google Fonts — Syne (headings) + DM Sans (body) |
| Icons | Unicode emoji — no external icon library |

**No build tools. No npm. No framework. Open `index.html` and it works.**

---

## Project Structure

```
ironsync/
├── index.html              # All 11 screens and app shell
├── styles.css              # Full design system (desktop + mobile)
├── app.js                  # Navigation, interactivity, charts, state
├── README.md               # This file
└── docs/
    └── product-background.md  # Product concept and research context

---

## Live Demo

(https://ironsync-ai-fitness-coach.vercel.app/)

---

## Running the Project

This project is deployed live on Vercel and can be viewed directly in the browser using the link above.


**Demo keyboard shortcuts** (when not focused in a text input):

| Key | Screen |
|---|---|
| `1` | Login |
| `2` | Goal Onboarding |
| `3` | Program Ready |
| `4` | Dashboard |
| `5` | Workout Plan |
| `6` | Pre-Workout Check |
| `7` | Live Tracker |
| `8` | AI Coach |
| `9` | Progress Analytics |
| `0` | Leaderboard |
| `Q` | Profile |
| `Esc` | Close modal |

---

## Project Background

IronSync was the same project I used for two different classes — each one approaching the idea from a completely different lens.

**MIS 3100 — Information Systems Analysis** is a course focused on systems thinking, requirements gathering, process mapping, and UX wireframing. I chose IronSync as my project and designed the full wireframe package from scratch — every screen, every user flow, and the underlying data and process documentation. The class deliverable was presenting the wireframes and making the case for how the system would work effectively from an information systems perspective. Those wireframes are the direct visual foundation for this implementation.

**ENTSP 3100 — Entrepreneurship and Innovation** is a course where students research and pitch an original product concept through the lens of business feasibility. I brought IronSync into that class and spent the semester researching whether it could actually work in the real market — analyzing competitors like Whoop, Hevy, Fitbod, and MyFitnessPal, identifying the target customer segment, stress-testing the value proposition, and building out the Business Model Canvas. The research sharpened what actually makes IronSync worth building: not the tracking features (everyone has those), but the recovery-aware, adaptive coaching layer that doesn't exist well in the free-to-low-cost tier.

Having worked through the same product in both a systems design context and a market feasibility context gave me a much clearer picture of what to actually build. This frontend MVP is the result of taking both of those deliverables seriously and turning them into something real. More detail in [`docs/product-background.md`](docs/product-background.md).

---

## What I Learned

**1. Desktop layout requires deliberate design decisions.**
Building a sidebar navigation, two-column content areas, and responsive breakpoints from scratch — without a component library — forced me to really understand CSS grid and how layouts break at different viewport sizes.

**2. State management matters even in vanilla JS.**
Even without React or Vue, a 10-screen demo has enough shared state (selected goal, logged sets, timer values) that sloppy variable management would have caused bugs. Having a single `S` object as the source of truth made the code significantly easier to reason about.

**3. Chart.js requires careful dark-mode theming.**
The default Chart.js styles assume a light background. Getting tooltips, gridlines, axis labels, and canvas backgrounds to look right with custom CSS variables took more iteration than expected.

**4. Translating wireframes to code surfaces design gaps you can't see on paper.**
I built every wireframe for this project in MIS 3100, so I knew the screens well — but implementing them revealed interactions that were underspecified on paper. What happens when you switch exercises mid-workout and some sets are already logged? How should the recovery score visually respond to slider changes in real time? Building forced me to answer questions that wireframes let you avoid.

**5. A recruiter-friendly project needs to feel real.**
I spent as much time on polish (hover states, transition animations, the streak badge, rest timer feedback toasts) as I did on core functionality. A flat, technically-correct demo looks amateur. Small details make it feel like a real product.

---

## Future Improvements

If this were to become a real product:

- [ ] **Backend + auth** — Supabase or Firebase for real user accounts and persistent workout history
- [ ] **Real AI integration** — Anthropic or OpenAI API for genuinely adaptive coaching based on performance trends
- [ ] **1RM estimator** — Epley formula displayed per exercise, tracked over time
- [ ] **Wearable integration** — Apple HealthKit / Google Fit for real HRV and sleep data to replace manual sliders
- [ ] **Exercise video library** — Form guidance embedded with each exercise
- [ ] **Push notifications** — Workout reminders, rest day nudges
- [ ] **PWA support** — Offline capability, home screen install
- [ ] **Social features** — Friend groups, gym-based leaderboards, challenge modes
- [ ] **Body metrics tracking** — Weight, measurements, body composition trends
- [ ] **Accessibility audit** — Full WCAG 2.1 compliance, screen reader testing

---

## Disclaimer

This is a **frontend MVP and portfolio demo**. Everything you see is simulated:

- All user data (Alex Martinez, workout history, leaderboard rankings) is hardcoded sample data
- The "AI" coaching recommendations are contextual placeholder text — not connected to any ML model
- There is no backend, no database, no real authentication, and no payment functionality
- This project is not affiliated with any fitness company or real product launch

The purpose is to demonstrate **UI/UX design, frontend development, and product thinking** built on top of real work — wireframes designed for MIS 3100 (Information Systems Analysis) and market feasibility research done for ENTSP 3100 (Entrepreneurship and Innovation).

---

## Author

**Matt Abraham**
MIS Student · Iowa State · Class of 2028

---

*Built with too much pre-workout and not enough sleep.*
