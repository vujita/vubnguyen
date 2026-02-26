import { type Metadata } from "next";
import Link from "next/link";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";

export const metadata: Metadata = {
  description:
    "I attend a lot of meetings. Without a system, they evaporate. Here's how I use Granola, Obsidian, Dataview, and Claude to make every meeting searchable, queryable, and actually useful.",
  title: "My Granola + Obsidian Setup for Staying Organized — Vu Nguyen",
};

export default function ObsidianGranolaNotesPage() {
  return (
    <PostLayout
      date="2026-02-26"
      description="I attend a lot of meetings. Without a system, they evaporate. Here's how I use Granola, Obsidian, Dataview, and Claude to make every meeting searchable, queryable, and actually useful."
      tags={["productivity", "obsidian", "ai", "note-taking", "workflow"]}
      title="My Granola + Obsidian Setup for Staying Organized"
    >
      <p>
        {
          "As a Staff Engineer, a large portion of my week disappears into meetings — syncs, design reviews, cross-team alignment, 1:1s. The conversations are real and often important. But without a deliberate system, they produce almost nothing durable. I would leave a meeting with a clear picture in my head, context-switch twice, and by the next morning the details were gone. Notes helped, but only if I took them — which meant I was either transcribing and not listening, or listening and losing the content."
        }
      </p>
      <p>
        {
          "Over the past several months I have settled on a setup that actually works. It combines Granola for AI-generated meeting notes, Obsidian as the knowledge base, the Dataview plugin for querying across notes, and Claude for reasoning over everything. Each piece is simple on its own. Together they give me something close to a searchable, queryable record of my work life."
        }
      </p>

      <h2>{"Step 1: Capture with Granola"}</h2>
      <p>
        {
          "Granola is a Mac app that runs silently in the background during your meetings and produces structured notes from the audio transcript. It does not require bots in your calls — it listens through your system audio. After the meeting ends, it gives you a clean summary with key topics, decisions, and action items. You can also attach a template to shape the output format."
        }
      </p>
      <p>
        {"Download it at "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="https://granola.ai"
        >
          {"granola.ai"}
        </Link>
        {
          ". The free tier covers a reasonable number of meetings per month. If you are in back-to-back meetings regularly, the paid plan is worth it — this is the part of the system that does the heaviest lifting."
        }
      </p>
      <p>
        {
          "The most important thing Granola captures beyond the summary is the attendee list. That becomes the connective tissue for everything else downstream."
        }
      </p>

      <h2>{"Step 2: Sync into Obsidian"}</h2>
      <p>
        {
          "Obsidian is a local-first Markdown note-taking app. Your notes live as plain files on disk — no proprietary format, no lock-in. The reason it is particularly useful here is not just organization: it is that plugins like Dataview can run SQL-like queries across your entire vault, treating note metadata as a queryable database."
        }
      </p>
      <p>
        {"Download Obsidian at "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="https://obsidian.md"
        >
          {"obsidian.md"}
        </Link>
        {
          ". Once you have it open and a vault created, install the community plugin "
        }
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="https://github.com/dannymcc/Granola-to-Obsidian"
        >
          {"Granola to Obsidian"}
        </Link>
        {
          ". This plugin polls your Granola account and writes each meeting note as a Markdown file into a folder you designate — I use "
        }
        <code>{"granola/"}</code>
        {
          " at the root of my vault. Each note includes YAML front matter with the meeting title, date, and attendees array, which is what Dataview will query later."
        }
      </p>
      <p>
        {
          "After initial setup, this step is completely passive. I finish a meeting, open Obsidian, and the note is already there."
        }
      </p>

      <h2>{"Step 3: Install Dataview"}</h2>
      <p>
        {
          "Dataview is a community plugin that treats your Obsidian vault like a database. You write queries directly inside notes using code blocks, and Dataview renders the results live. It can pull data from YAML front matter, inline fields, task checkboxes, and file metadata."
        }
      </p>
      <p>
        {
          "Install it from the Obsidian community plugin store: Settings → Community plugins → Browse → search \"Dataview\" → Install → Enable. Make sure to also enable the \"Enable JavaScript Queries\" and \"Enable Inline Queries\" options in its settings — the templates below use both."
        }
      </p>

      <h2>{"The Person Template"}</h2>
      <p>
        {
          "The first template I set up was for people. Every colleague I interact with regularly gets a note in "
        }
        <code>{"work/people/"}</code>
        {
          ". The note title is their name. With Dataview, the note automatically shows every Granola meeting where they appeared as an attendee — no manual linking required."
        }
      </p>
      <pre>
        <code>
          {`---
email: "{{title}}"
name: "{{title}}"
---

\`\`\`dataview
TABLE dateformat(created, "MM/dd/yy") as "Date"
FROM "granola"
WHERE contains(attendees, this.name) OR contains(attendees, "{{title}}")
SORT created DESC
\`\`\``}
        </code>
      </pre>
      <p>
        {
          "When I open someone's note before a 1:1, I can immediately see every meeting we have had, in reverse chronological order. Before I would have to search for their name across separate notes and manually piece together the history. Now it is surfaced automatically."
        }
      </p>

      <h2>{"The Daily Notes Template"}</h2>
      <p>
        {
          "The daily note is the operational center of the setup. It combines three things: a task list for the day, a view of overdue and upcoming tasks pulled from notes across my "
        }
        <code>{"work/"}</code>
        {
          " folder, and a live table of every meeting that happened that day — auto-populated from Granola."
        }
      </p>
      <pre>
        <code>
          {`---
day: "{{date:YYYY-MM-DD}}"
---

# \`= dateformat(this.day, "cccc MMM dd yyyy")\`

## Tasks
- [ ]

## Overdue Tasks
\`\`\`dataview
TASK
FROM "work"
WHERE due < this.file.day
AND !done
AND !completed
AND completed != null
AND due != null
GROUP BY file.folder
\`\`\`

## Tasks due today
\`\`\`dataview
TASK
  FROM "work"
  WHERE due = this.file.day AND (completion = null OR completion > this.file.day)
  WHERE due != null
  GROUP BY file.folder
\`\`\`

## Tasks due within the next 7 days
\`\`\`dataview
TASK
FROM "work"
WHERE due > default(this.file.day, date(today))
  AND due <= (default(this.file.day, date(today)) + dur(7 days))
  AND (completion = null OR completion > default(this.file.day, date(today)))
  AND date(created) < date(this.file.day)
GROUP BY file.folder
\`\`\`

## \`= dateformat(this.day, "MMM dd yyyy")\` meeting notes
\`\`\`dataview
TABLE map(attendees, (x) => link("work/people/" + x, x)) AS "Attendees"
FROM "granola"
WHERE (created - dur(8h)).day = this.day.day
  AND (created - dur(8h)).month = this.day.month
\`\`\``}
        </code>
      </pre>
      <p>
        {
          "A few things worth noting here. The meeting notes query subtracts 8 hours from the meeting's "
        }
        <code>{"created"}</code>
        {
          " timestamp before comparing to the day — this handles timezone offset so meetings show up on the correct calendar day rather than the UTC date. The attendees in the meeting table render as links directly to the corresponding person notes, so clicking an attendee takes you straight to their history."
        }
      </p>
      <p>
        {
          "The task sections do the real organizational work. Overdue tasks from anywhere in my vault surface automatically. I do not need to remember where I wrote something down — if it has a due date and is not done, it appears."
        }
      </p>

      <h2>{"Step 4: Claude as a Reasoning Layer"}</h2>
      <p>
        {
          "Once your vault has a few weeks of Granola notes in it, you have something genuinely useful to reason over: a timestamped, structured record of your work life. This is where I use Claude as a personal assistant on the vault folder."
        }
      </p>
      <p>
        {
          "I point Claude at my vault directory and use it for three things. First, summarizing a batch of meeting notes — if I want a concise brief on everything that happened in a given project area over the last two weeks, I can ask for it. Second, answering questions across notes — things like \"what did we last decide about the data model for this feature\" or \"who was in the room when we scoped this\" can be answered directly rather than through manual search. Third, identifying patterns across meetings — recurring themes, unresolved blockers that keep resurfacing, topics that are getting a lot of meeting time relative to their priority."
        }
      </p>
      <p>
        {
          "The key is that the vault gives Claude structured, well-formatted context. Granola notes have consistent front matter, clean prose summaries, and named attendees. That structure makes the answers substantially better than feeding Claude raw transcripts would."
        }
      </p>

      <h2>{"What This Actually Changes"}</h2>
      <p>
        {
          "The setup does not eliminate meetings or make them shorter. What it does is change their return on investment. Every meeting now produces a durable artifact that connects to the people in it, surfaces in daily notes, and is queryable weeks later. The cost of forgetting drops significantly."
        }
      </p>
      <p>
        {
          "The bigger shift is the person notes. I used to rely on memory for the history of a working relationship — what we had discussed, what I had committed to, what context they had that I did not. Now that history is a query. Before a conversation I can see what we last talked about. After a hard discussion I can record a follow-up note that will surface in the next daily note. This is the part of the system that has changed how I work the most."
        }
      </p>
      <p>
        {
          "If you are in a role where meetings are unavoidable and context across those meetings compounds over time, this setup is worth the afternoon it takes to configure. The individual pieces — Granola, Obsidian, Dataview — are all well-maintained and actively developed. The integration is light enough that it has not broken on any update in the months I have been running it."
        }
      </p>
    </PostLayout>
  );
}
