# Gym of Communication (GoC) 🎙️🏋️‍♂️

> **The Gym for Communication.**  
> *Train the human skills AI can't replace.*

Gym of Communication is an AI-powered articulation and communication training platform for Indonesian young professionals, founders, salespeople, managers, consultants, and students who know what they want to say, but struggle to articulate it clearly under pressure.

This is **NOT** a passive video course. It functions like a gym:  
**Learn → Practice → Get Feedback → Repeat → Improve**.

---

## 🌟 Key Features

1. **Bilingual & Code-Switching First**: Full native support for **Bahasa Indonesia 🇮🇩** and **English 🇬🇧**, including Indonesian-English code-switching (*bahasa campur*).
2. **Real Audio Recording**: In-browser recording via standard `MediaRecorder` API with live waveform animation, 30–90 second pacing targets, and playback preview.
3. **Verbatim Audio Transcription (`gemini-3.5-transcribe`)**: Preserves raw conversational markers, false starts, and regional filler words (*eee, eh, emm, anu, apa ya, kayak, maksudnya, um, uh, like, actually*).
4. **Deterministic Speech Metrics**: Numerical metrics computed directly in application code rather than hallucinated:
   - Speaking Duration & Word Count
   - Speaking Pace (Words per Minute / WPM)
   - Filler Word Counts & Breakdown
   - Filler Rate (`fillers / total words * 100`)
   - Repetition Detection (*"saya saya"*, *"jadi jadi"*)
   - Pause Detection (>1.5s pauses)
5. **AI Communication Coach (`gemini-3.8-flash`)**: Strict structured JSON feedback evaluating:
   - **Clarity (25%)**
   - **Conciseness (20%)**
   - **Structure (20%)**
   - **Filler Control (15%)**
   - **Pace (10%)**
   - **Vocabulary (10%)**
   - **Weighted Overall Articulation Score (0–100)**
6. **PREP Framework & Actionable Coaching**: Concrete suggestions, rewritten answers, and immediate "Try Again" mode to compare progress side-by-side with previous scores (+8 improvement tracking).
7. **7-Day Articulation Gym**: Daily 10-minute micro-workouts:
   - **Day 1**: Stop Rambling (The PREP Framework)
   - **Day 2**: Answer in 30 Seconds (The Elevator Cut)
   - **Day 3**: Structure Under Pressure (What - Why - Next)
   - **Day 4**: Kill Filler Words (The Intentional Pause)
   - **Day 5**: Confident Delivery & Tone (Vocal Grounding)
   - **Day 6**: Persuade Without Pushing (Problem - Consequence - Solution)
   - **Day 7**: Final Benchmark & Before/After Comparison
8. **1-Click Demo Mode**: Built-in realistic sample recordings and benchmark evaluations to test the application instantly without requiring a microphone or API key.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS (Warm editorial palette: off-white `#FBFBFA`, charcoal `#18181B`, accent orange `#F95738`)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **AI SDK**: `@google/genai` (Official Google GenAI SDK v2.3+)
- **Models**:
  - `gemini-3.5-transcribe` (Audio Speech-to-Text with Verbatim mode)
  - `gemini-3.8-flash` (Structured Communication Evaluation)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm 9+

### 2. Environment Setup
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the platform automatically supports 1-click interactive Demo Mode with realistic data for full exploration).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
GoC/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts      # Server-side Gemini transcribe & coach pipeline
│   │   │   └── health/route.ts       # Health-check endpoint
│   │   ├── assessment/page.tsx       # Recording studio & prompt flow
│   │   ├── results/page.tsx          # Articulation score, breakdown & PREP coaching
│   │   ├── training/
│   │   │   ├── page.tsx              # 7-Day Gym dashboard & streaks
│   │   │   └── day/[id]/page.tsx     # Daily interactive micro-workout
│   │   ├── globals.css               # Editorial gym styling & animations
│   │   ├── layout.tsx                # Root layout with LanguageProvider & Navbar
│   │   └── page.tsx                  # High-converting landing page
│   ├── components/
│   │   ├── AudioRecorder.tsx         # MediaRecorder with timer & browser permissions
│   │   ├── CategoryBar.tsx           # Category score bars
│   │   ├── DemoBanner.tsx            # Interactive demo switcher banner
│   │   ├── Footer.tsx                # Editorial footer
│   │   ├── LanguageContext.tsx       # ID / EN bilingual state management
│   │   ├── Navbar.tsx                # Sticky navigation header
│   │   ├── ScoreDonut.tsx            # Animated SVG score ring
│   │   ├── StagedLoading.tsx         # 3-step animated analysis loader
│   │   └── WaveformVisualizer.tsx    # Live audio frequency visualizer
│   └── lib/
│       ├── analytics.ts              # Privacy-preserving event tracking
│       ├── demoData.ts               # Sample recordings & benchmarks (ID/EN)
│       ├── dictionary.ts             # Complete bilingual translations
│       ├── gemini.ts                 # Google GenAI SDK integration
│       ├── metrics.ts                # Deterministic speech calculation engine
│       ├── storage.ts                # LocalStorage management (streaks, progress)
│       ├── trainingData.ts           # 7-day curriculum content & exercises
│       └── types.ts                  # TypeScript interfaces & types
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔒 Security & Privacy

- **Server-Side AI Calls**: All Gemini calls run exclusively on the server (`/api/analyze`). The `GEMINI_API_KEY` is never sent to or visible in the client browser.
- **Audio Privacy**: Audio clips uploaded for assessment are analyzed in temporary memory and are not stored in any persistent database.

---

## 📄 License
MIT © Gym of Communication
