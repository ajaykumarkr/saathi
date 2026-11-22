# Saathi: an AI companion for parents who live alone

**Builder's Day 2026 · RFS 17: AI Agents for Elder Care**

**Live demo:** https://saathi-seven-tau.vercel.app/

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

## Design principle: nothing to install for the parent

The parent only uses WhatsApp, which they already have. One tap (👍), a voice message or a photo is all any interaction needs. The child uses a simple web dashboard.

## What it does

**On the parent's WhatsApp**
1. **Tablet reminders:** Saathi sends a reminder at each dose time; the parent replies 👍 or "Later". A dose with no 👍 after 60 minutes alerts the family.
2. **"Is this my tablet?":** the parent sends a photo of a strip. Claude reads the label, matches it against their prescription, says what it's for and whether it's due now. If it isn't on their list, Saathi tells them not to take it and flags the mix-up.
3. **Meal check:** a photo of a meal gets a sugar and salt judgement for their conditions, plus one practical tip.
4. **Daily check-in:** the parent types or speaks in Kannada, Hindi or English. Saathi replies in the same language and quietly logs mood, symptoms, tablets taken and walking minutes.
5. **Red flags:** chest pain, breathlessness, a fall, fainting or low-sugar signs trigger an instruction to sit down and call 108, and an immediate alert to the family.

**For the child**
6. **Status board:** a one-line verdict ("Amma is doing well" / "Call Amma now"), alerts, 7-day adherence and walking, medicine stock with refill ordering, and a way to message the parent through Saathi.
7. **Daily AI brief:** four lines covering today's status, what needs attention, a weekly pattern, and a suggested opening line for the phone call.

**For the doctor**
8. **Weekly report:** adherence per medicine, symptoms with dates and the parent's own words, diet and activity, and an AI-drafted note with two questions for the doctor.

## Where the AI is used

All intelligence comes from Claude (Anthropic) through `api/claude.js`:

| Feature | What Claude does |
|---|---|
| Chat and voice check-ins | Replies in the parent's language and extracts structured data (`mood`, `symptoms`, `took_meds`, `walk_minutes`, `urgent`) that updates the family dashboard |
| Tablet photo | Vision: reads the label, matches it to the prescription, decides if it's due or the wrong medicine |
| Meal photo | Vision: identifies Indian home food, rates sugar and salt against the parent's conditions |
| Daily brief | Summarises 7 days of logs into four actionable lines for the child |
| Doctor note | Turns the week's logs into a concise clinical-style note |

**Safety guardrails (in every prompt):** Saathi never diagnoses and never adds, changes or stops a medicine. Medical doubts are routed to "please ask the doctor" and the family is told. Red-flag symptoms always escalate.

## Run it

Requires Node 18 or later. No dependencies.

```bash
git clone <this repo> && cd saathi
cp .env.example .env        # then put your Anthropic API key in .env
node server.js              # open http://localhost:3000
```

**Deploy (Vercel):** import the repo, set `ANTHROPIC_API_KEY` (and optionally `CLAUDE_MODEL`) as environment variables, deploy. `index.html` is served as the page and `api/claude.js` becomes the `/api/claude` function. The key never reaches the browser.

You can also paste your own key in the app's Settings to call Claude directly from the browser. If no AI is reachable, the app falls back to built-in sample replies so a demo never stalls, and the footer always shows which mode is active.

## Demo flow (3 minutes)

1. **Amma's phone:** "Send next tablet reminder" → tap 👍 Taken.
2. Send a photo of a tablet strip → Saathi confirms it's the BP tablet and that it's due.
3. Speak or type in Kannada: "Knees are paining, didn't walk today" → kind reply; "What Saathi noted" updates.
4. Type "chest pain" → Saathi says call 108 → switch to **Family**, which now reads "Call Amma now".
5. "Summarise Amma's day" → AI brief. Low BP-tablet stock → Order refill.
6. **Doctor** → weekly report → "Draft with Saathi".

The demo persona (Lakshmi, 68, Mysuru) and her 7 days of history are sample data. The WhatsApp screen is a simulation of the real channel.

## Project structure

```
index.html      Single-page app: Amma's WhatsApp view, Family dashboard, Doctor report
api/claude.js   Claude proxy (Vercel serverless function; also used locally)
server.js       Zero-dependency local server
.env.example    Environment variables template
```

## Roadmap

- **Real WhatsApp:** WhatsApp Business API (via Twilio or Meta Cloud API) with approved reminder templates.
- **Voice in Indian languages:** Sarvam AI (Saaras speech-to-text, Bulbul text-to-speech) for Kannada voice notes in and out.
- **Phone calls for parents without WhatsApp:** a voice agent that calls a normal phone number.
- **Prescription photo → schedule:** read a new prescription after a doctor visit and update the medicine plan, with the child's approval.
- **Pharmacy integration** for one-tap refills, and multiple caregivers per parent.

## Limitations

This is a 4-hour hackathon prototype. Data is stored only in the browser, there is no login, and alerts are shown on the dashboard rather than pushed. Saathi is a support tool for families and is not a medical device.
