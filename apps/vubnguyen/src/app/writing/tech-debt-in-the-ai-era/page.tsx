import { type Metadata } from "next";
import Link from "next/link";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";

export const metadata: Metadata = {
  description:
    "AI is generating code faster than we can reason about it. The old playbook for managing tech debt — stop, clean up, resume — is no longer enough.",
  title: "Tech Debt in the Age of AI — Vu Nguyen",
};

export default function TechDebtInTheAiEraPage() {
  return (
    <PostLayout
      date="2026-02-22"
      description="AI is generating code faster than we can reason about it. The old playbook for managing tech debt — stop, clean up, resume — is no longer enough."
      tags={["ai", "engineering", "tech-debt", "architecture"]}
      title="Tech Debt in the Age of AI"
    >
      <p>
        {
          "We have always accumulated tech debt. It is a natural byproduct of shipping: you make a shortcut to hit a deadline, you scaffold something quickly to test an idea, you copy a pattern that made sense at the time and repeat it until the codebase is full of it. Debt is not a failure of discipline — it is the residue of movement."
        }
      </p>
      <p>
        {
          "But there is something different happening now. AI coding tools have changed the rate at which we accumulate debt — and the systems we built to manage it were not designed for this speed."
        }
      </p>

      <h2>{"The Acceleration"}</h2>
      <p>
        {
          "As I wrote in "
        }
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="/writing/ai-coding-paradigm"
        >
          {"The Shifting Paradigm of Coding in the Age of AI"}
        </Link>
        {
          ", the cost of generating code has dropped close to zero. An engineer who used to ship one feature a week can now ship three. A team that used to take a quarter to build a product can take a month. This is real, measurable productivity — and it is genuinely valuable."
        }
      </p>
      <p>
        {
          "But there is a side effect that is easy to miss in the excitement: we are now generating structural decisions — abstractions, data models, API contracts, naming conventions — at the same accelerated rate. And unlike raw code volume, structural decisions compound. A wrong abstraction introduced today becomes the foundation ten features depend on next month."
        }
      </p>
      <p>
        {
          "AI tools are optimized to produce code that works. They are less optimized to produce code that fits — code that is consistent with the existing architecture, that does not duplicate logic that already exists three files away, that introduces the right abstraction rather than the nearest approximation. The delta between \"works\" and \"fits\" is tech debt, and it is accumulating faster than at any point in the history of software."
        }
      </p>

      <h2>{"The Old Playbook Is Breaking"}</h2>
      <p>
        {
          "The traditional approach to tech debt has always been episodic. You ship until the weight becomes noticeable — velocity slows, bugs cluster in certain areas, every new feature touches the same fragile code. Then you stop. You run a cleanup sprint, or a refactor quarter, or a dedicated debt-reduction cycle. You pay down the balance, reset the clock, and resume."
        }
      </p>
      <p>
        {
          "This model was sustainable when debt accumulated at the pace of human developers writing code by hand. A team of ten engineers, working for a quarter, could generate a manageable amount of debt. A focused effort could meaningfully reduce it. The cycle worked because the rate of accumulation and the rate of paydown were in the same order of magnitude."
        }
      </p>
      <p>
        {
          "That equilibrium is gone. When AI tools double or triple the rate at which code is generated, a cleanup sprint that used to get you back to neutral now leaves you still behind. You surface from the refactor to find the debt has grown back while you were cleaning. The episodic model assumes the codebase is roughly static during the cleanup. It is not anymore."
        }
      </p>

      <h2>{"What We Need Instead"}</h2>
      <p>
        {
          "Managing tech debt in the AI era requires a shift from episodic to continuous. The cleanup sprint cannot be the primary mechanism because there is no longer a natural pause in the rate of accumulation. Instead, debt management has to be embedded in the flow of shipping."
        }
      </p>
      <p>
        {
          "This means a few things in practice. It means treating the code review step as a structural review — not just \"does this work\" but \"does this belong here, and does it introduce a pattern we want to live with.\" AI can generate a solution quickly; the human judgment that matters is whether the solution fits the system's existing shape."
        }
      </p>
      <p>
        {
          "It means investing in architectural guardrails that constrain what AI tools can generate. When a codebase has clear conventions, documented boundaries, and consistent patterns, AI output tends to stay within those constraints — because the model is inferring from examples. A well-structured codebase is itself a form of debt prevention. The structure communicates what belongs, and the tools follow."
        }
      </p>
      <p>
        {
          "It also means accepting that some debt is now unavoidable and building the capacity to pay it down incrementally, in parallel with shipping — not in lieu of it. Small refactors as part of every feature. Opportunistic cleanup whenever you touch a file. A steady background rate of improvement, rather than a periodic reset."
        }
      </p>

      <h2>{"The Harder Reckoning"}</h2>
      <p>
        {
          "There is a deeper issue that the acceleration exposes. Most teams do not have a clear enough picture of their architectural intentions to know when a generated piece of code violates them. The AI does not know what you meant to build — only what you have built. If what you have built is inconsistent, the generated code will be inconsistent too, and the inconsistency will compound."
        }
      </p>
      <p>
        {
          "The teams that will manage AI-era debt well are the ones who can articulate what their architecture is supposed to look like — and then use that picture as a standard against which generated code is evaluated. This is not a new skill. It is the same judgment that good senior engineers have always exercised. But it now has to be exercised at a higher rate, because the volume of decisions requiring judgment has increased."
        }
      </p>
      <p>
        {
          "The answer is not to slow down AI-assisted development. The productivity gains are too real and the competitive pressure is too strong. The answer is to build the organizational and technical infrastructure to absorb the rate of change — better conventions, faster structural feedback, continuous rather than episodic cleanup, and a clear enough picture of where you are trying to go that you can recognize when generated code is taking you somewhere else."
        }
      </p>
      <p>
        {
          "We are in the early days of figuring this out. The teams who solve it will not just be faster — they will be the ones who stay fast, compounding their advantage while others slow under the weight of a codebase that grew faster than anyone could understand it."
        }
      </p>
    </PostLayout>
  );
}
