# Saathi: an AI companion for parents who live alone

**Builder's Day 2026 · RFS 17: AI Agents for Elder Care**

**Live app:** https://saathi-seven-tau.vercel.app/
**Demo video (2 min):** https://github.com/ajaykumarkr/saathi/blob/main/demo/saathi-demo.mp4 (click "View raw" / download to play)
**Use-case deck:** https://claude.ai/artifact/RRyFjP4aNt4F6Kit6rVx4M

Saathi lives in an elderly parent's WhatsApp. It reminds them about tablets, checks a tablet strip or a meal from a photo, chats with them in their own language, and raises an alarm when something sounds wrong. Their children, living in another city, see one calm status screen instead of guessing on a nightly phone call.

## The problem

Millions of Indian parents in their 60s and 70s live alone while their children work in other cities. They manage several daily medicines, diet limits and doctor visits on their own, often without the tech skills to get help. Their children can't visit often or attend doctor appointments, so they have no reliable way to know whether their parents took the right medicines, ate well or stayed active, until something goes wrong.

| The child (away) | The parent (at home) |
|---|---|
| Can't travel home often | Not comfortable with apps or forms |
| Can't attend doctor visits | Unsure which tablet to take, and when |
| Doesn't know if medicines were taken, or the right ones | Medicines run out; ordering is a hassle |
| Doesn't know if they're eating and exercising well | Doesn't know what to eat for their conditions |

## Why I care

At Walmart I build tools that tell customers exactly where their order is. Yet many of us in Bangalore know less about whether our parents took their BP tablet today. Families deserve that same calm, real-time visibility, without making parents feel watched.

## The core use case

"Amma, if you need help and I'm not replying, message Saathi." Saathi is the always-available first responder when the child is in a meeting or asleep: it answers routine questions instantly from the prescription and the doctor's advice, handles emergencies (call 108 + alert the child), and queues everything that needs the child's decision.

## Design principle: nothing to install for the parent

The parent only uses WhatsApp, which they already have. One tap (👍), a voice message or a photo is all any interaction needs. The child uses a simple web dashboard.

## What it does

Saathi works for any family member (Amma, Appa, Ajji…). Messages go either to the parent's own WhatsApp or to a **caretaker** at home, who gets the same reminders plus a daily care plan.

**1. The parent's (or caretaker's) WhatsApp**
- **Tablet reminders** with one-tap 👍 Taken / Later. No 👍 after 60 minutes alerts the family.
- **"Which tablet now?"**: Saathi answers from the prescribed schedule and what's already been taken, so the parent doesn't have to call their child in the middle of a meeting.
- **"What did you eat?"**: a scheduled question; the reply can be a photo or a voice note. Claude judges the meal against the doctor's diet rules (good / okay / poor, which rules were kept or broken, one tip).
- **Tablet-strip photo check:** Claude reads the label and matches it to the prescription; a medicine that isn't on the list is flagged and the parent is told not to take it.
- **Send a prescription or lab report** as a photo: Claude reads it and the child gets a review card; once approved, the record and the tablet reminders update.
- **Appointment and test reminders**, including fasting instructions.
- **Daily check-ins** in Kannada, Hindi, Tamil, Telugu or English, by text or voice; replies can be sent as voice notes.
- **Red flags** (chest pain, a fall, breathlessness, low-sugar signs) trigger "sit down and call 108" and an immediate family alert.

**2. Health record**: **scan a prescription or lab report photo** → Claude reads it (printed or handwritten), proposes new medicines and times, test results, the doctor's advice and the next visit → the child approves before anything changes, and the parent gets their updated tablet times on WhatsApp. The record also holds profile, conditions, allergies, current medicines with 7-day adherence, reports with abnormal values flagged, doctors, upcoming and past appointments with the doctor's notes, diet advice, and recent symptoms in the parent's own words. Share it with any doctor by **email**, **download as PDF / print**, or copy as text; an AI-drafted note for the doctor can be added.

**3. Summary for the child**: a one-line status, **"Saathi reminds you"** (overdue eye check, upcoming tests and reviews, refills) with Mark booked / Tell Amma, and a **Daily / Weekly** view of food against the doctor's rules, tablets, walking and mood, plus an AI brief.

**4. Settings**: add family members and caretakers, instructions for Saathi and the caretaker, medicines, the doctor's diet rules, and language.

## Reply rules and transparency

Saathi is a separate, introduced contact ("Saathi · Ajay's helper"), never the child pretending to reply. Its first message explains who it is, and anything the child sends through it is labelled "From Ajay". Every incoming message is classified by Claude, and each family member has their own rules in Settings:

| Message type | Example | Default |
|---|---|---|
| Safety red flag | chest pain, a fall, low-sugar signs | Instant reply ("sit down, call 108") and the child is alerted. Always on |
| Routine | which tablet now, 👍, meal or tablet photo | Instant answer from the schedule and the doctor's rules (or hold for the child) |
| Needs a decision | skip or change a medicine, new symptom, a prescription | Short acknowledgement, then "Waiting for you" on the child's summary. Saathi never decides |
| Personal / for the child | "tell Ajay to call", feeling lonely | Warm acknowledgement, passed to the child |
| Chatter | "ok", good-morning forwards | Short friendly reply (configurable: just 🙏, or no reply) |

Also configurable per person: **quiet hours** (no proactive messages; red flags still answered) and **reminders per dose** before Saathi stops nudging and alerts the child instead.

## Where the AI is used

All intelligence comes from Claude (Anthropic) through `api/claude.js`:

| Feature | What Claude does |
|---|---|
| Chat and voice check-ins | Replies in the parent's language and extracts structured data (`mood`, `symptoms`, `took_meds`, `walk_minutes`, `urgent`) that updates the family dashboard |
| Tablet photo | Vision: reads the label, matches it to the prescription, decides if it's due or the wrong medicine |
| Prescription / lab report photo | Vision: extracts medicines (converting OD/BD/after food into times), test values with normal ranges, the doctor's advice and next visit; shows a diff against current medicines for the child to approve |
| Meal photo | Vision: identifies Indian home food, rates sugar and salt against the parent's conditions |
| Daily brief | Summarises 7 days of logs into four actionable lines for the child |
| Doctor note | Turns the week's logs into a concise clinical-style note |

**Safety guardrails (in every prompt):** Saathi never diagnoses and never adds, changes or stops a medicine. Medical doubts are routed to "please ask the doctor" and the family is told. Red-flag symptoms always escalate.

## What's real vs simulated

- **Real, live Claude AI:** understanding chat and voice notes, "which tablet now?" answers, tablet and meal photo checks, red-flag escalation, daily and weekly briefs, the doctor note.
- **Real app logic:** family members and caretakers, health record with email / PDF / print, reminders, refill tracking, summaries.
- **Simulated:** the WhatsApp screen (production would use the WhatsApp Business API), scheduled messages (triggered by buttons in the demo), refill ordering, and the sample family's previous 7 days of data. Voice input uses the browser's speech recognition.

## Built with

- **Claude API** (Anthropic): all in-product intelligence, including vision for tablet strips and meals
- **Claude** as a coding and product assistant during the build
- Vanilla HTML/CSS/JavaScript, a zero-dependency Node server, **Vercel** for hosting and the serverless API proxy, **GitHub**
- Browser Web Speech API for voice input and read-aloud

## Run it

Requires Node 18 or later. No dependencies.

```bash
git clone <this repo> && cd saathi
cp .env.example .env        # then put your Anthropic API key in .env
node server.js              # open http://localhost:3000
```

**Deploy (Vercel):** import the repo, set `ANTHROPIC_API_KEY` (and optionally `CLAUDE_MODEL`) as environment variables, deploy. `index.html` is served as the page and `api/claude.js` becomes the `/api/claude` function. The key never reaches the browser.

You can also paste your own key in the app's Settings to call Claude directly from the browser. If no AI is reachable, the app falls back to built-in sample replies so a demo never stalls, and the footer always shows which mode is active.

## Try it: a 3-minute walkthrough

One user, one flow: Ajay is in a meeting in Bangalore; Amma is at home in Mysuru.

1. **Amma's phone:** Amma asks "Which tablet now?" → Saathi answers from her schedule; she taps 👍.
2. "What did you eat?" → Amma sends a lunch photo → judged against Dr. Rao's diet rules.
3. Amma sends a photo of a tablet strip → Saathi confirms what it is and whether it's due.
4. **Summary:** Ajay sees one nudge, the overdue eye check and a low BP-tablet stock → Mark booked, Order refill, weekly view, AI brief.
5. **Health record:** email the record to Dr. Rao or download the PDF before the next visit.
6. Switch to **Appa** → the same flow runs through his caretaker, Manju.

The demo persona (Lakshmi, 68, Mysuru) and her 7 days of history are sample data. The WhatsApp screen is a simulation of the real channel.

## Project structure

```
index.html      Single-page app: phone (WhatsApp) view, health record, summary, settings
api/claude.js   Claude proxy (Vercel serverless function; also used locally)
server.js       Zero-dependency local server
.env.example    Environment variables template
```

## Future use cases

- **Fall and inactivity alerts** (suggested by my Builder's Day mentor): a home camera or motion sensor detects a fall, or no movement by mid-morning; Saathi calls the parent, then alerts the child, caretaker and a neighbour. Opt-in, processed on the device, no video stored.
- **BP and sugar meters, wearables:** readings flow in automatically; out-of-range values reach the child and the doctor note.
- **Voice calls in Kannada and other languages** for parents without WhatsApp, using Indian-language speech models (e.g. Sarvam).
- **Real WhatsApp channel:** WhatsApp Business API (via Twilio or Meta Cloud API) with approved reminder templates.
- **One-tap refills and home lab tests:** pharmacy delivery when stock runs low; sample collection booked for due tests.
- **Doctor visit companion:** record shared before the visit; the new prescription and advice captured after.
- **Family circle:** siblings and caretakers share one view, with tasks assigned (who books, who calls, who visits).

## Business model

The child pays; the parent uses it free with nothing to install.

| Plan | Includes | Price |
|---|---|---|
| Free | One parent; tablet reminders and "which tablet now?" answers; 7-day history | ₹0 |
| Family | Up to 3 parents; photo checks, prescription reading, health record, weekly insights | to be validated |
| Family+ | Caretaker mode, fall and inactivity alerts, BP and sugar meter sync, priority escalation | to be validated |

Later revenue: pharmacy and home-lab referrals, clinic partnerships, and employers offering Saathi as a caregiver benefit. Running cost per parent is a few AI calls a day plus WhatsApp message fees.

## Limitations

This is a 4-hour hackathon prototype. Data is stored only in the browser, there is no login, and alerts are shown on the dashboard rather than pushed. Saathi is a support tool for families and is not a medical device.
