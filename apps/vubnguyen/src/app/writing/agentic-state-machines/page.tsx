import { type Metadata } from "next";
import Link from "next/link";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";

export const metadata: Metadata = {
  description:
    "LLM agents drift. They hold contradictory beliefs, wander into undefined transitions, and silently declare victory. State machines are how you stop that.",
  title: "Agentic Systems Need State Machines — Vu Nguyen",
};

export default function AgenticStateMachinesPage() {
  return (
    <PostLayout
      date="2026-02-25"
      description="LLM agents drift. They hold contradictory beliefs, wander into undefined transitions, and silently declare victory. State machines are how you stop that."
      tags={["ai", "engineering", "architecture", "agentic", "state-machines"]}
      title="Agentic Systems Need State Machines"
    >
      <p>
        {
          "The pitch for agentic AI systems is compelling: give a model access to tools, let it reason across multiple steps, and it will accomplish tasks that a single prompt never could. The agent plans, executes, observes, and adapts. It can write code, run tests, fix failures, and iterate — all without a human directing each step."
        }
      </p>
      <p>
        {
          "The reality, for anyone who has built and operated these systems, is messier. Agents drift. They contradict decisions they made two steps ago. They wander into action sequences that were never sanctioned. They declare a task complete when it is not, or loop endlessly because they cannot recognize that it is. The more capable the underlying model, the more convincing the drift looks — which makes it harder, not easier, to catch."
        }
      </p>
      <p>
        {
          "The solution is not a better prompt. It is a better structure. Specifically, it is a state machine."
        }
      </p>

      <h2>{"Why Agentic Systems Drift"}</h2>
      <p>
        {
          "Most agentic systems today are built as loops: observe the environment, reason about what to do next, call a tool, observe the result, repeat. The logic that governs transitions between steps lives in the model's context — in the prompt, the conversation history, and whatever the model infers from the current situation. There is no external record of what state the system is in. There is no enforced set of valid transitions. There is no invariant being checked between steps."
        }
      </p>
      <p>
        {
          "This creates three failure modes that show up consistently in production agentic systems."
        }
      </p>
      <p>
        {
          "The first is contradictory state. An agent performing a multi-step task will often make a decision early in a session — choose a strategy, confirm a constraint, establish an assumption — and then, several tool calls later, make a different decision that directly contradicts the first. The model is not lying. It simply does not have a reliable mechanism for tracking what it has already committed to. The context window is long, attention is imperfect, and by step eight the early decisions are effectively invisible. The agent holds contradictory beliefs simultaneously and acts on whichever one surfaced most recently."
        }
      </p>
      <p>
        {
          "The second is an unbounded decision space. At each step, an unrestricted agent can take essentially any action its tools permit. There is nothing stopping it from deciding, mid-task, to use a completely different approach, invoke a tool that has no relevance to the current goal, or take an action that is technically valid but operationally dangerous in the current context. The model's judgment about what is appropriate is unsupervised. When it is wrong, it is wrong without guardrails."
        }
      </p>
      <p>
        {
          "The third is silent failure. Agents are optimized to be helpful, which means they are biased toward appearing successful. An agent that cannot complete a step will often rationalize past it — summarizing the situation as resolved, reporting partial progress as complete, or skipping a step entirely and continuing as if it had succeeded. Without an explicit record of which steps have been completed and verified, there is no way to detect this from inside the agent loop. The task appears to finish. The work was not done."
        }
      </p>

      <h2>{"What State Machines Give You"}</h2>
      <p>
        {
          "A state machine is a formal model with three components: a finite set of states, a set of valid transitions between those states, and the conditions that trigger each transition. At any moment, the system is in exactly one state. It can only move to states that are reachable from the current one. Transitions that are not defined simply cannot happen."
        }
      </p>
      <p>
        {
          "Applying this model to an agentic system does not change what the agent can do — it changes what the agent is allowed to do depending on where it is. The model still reasons. It still calls tools. But the orchestration layer — the code outside the model — maintains authoritative state and enforces which actions are valid in that state. The agent's output becomes a signal that influences transitions; it does not unilaterally determine them."
        }
      </p>
      <p>
        {
          "This directly addresses each failure mode. Contradictory state disappears because the current state is owned by the system, not inferred by the model. Whatever the agent believed three steps ago is irrelevant — the system knows exactly where it is. Unbounded decisions disappear because the transition function only permits actions that are valid from the current state. Silent failure disappears because a step cannot be marked complete by the agent's assertion alone — the system requires a verified transition before advancing."
        }
      </p>
      <p>
        {
          "There is a secondary benefit that matters as much as correctness: debuggability. When an agentic system fails, the hardest question to answer is usually where it went wrong. In a prompt-driven loop, the failure is buried somewhere in a long context window with no structural landmarks. In a state machine, you have an audit trail of every state and every transition. You can see exactly where the system was when it went off-track, and exactly what input triggered the bad transition. This is not a luxury — it is a prerequisite for operating these systems reliably in production."
        }
      </p>

      <h2>{"What This Looks Like in Practice"}</h2>
      <p>
        {
          "You do not need a dedicated library to apply state machine thinking to an agentic system, but some tools make it easier. XState is a mature JavaScript/TypeScript library for modeling state machines and statecharts explicitly — it gives you a visual representation of your machine, enforced transitions, and a clean actor model for managing side effects. LangGraph, from the LangChain ecosystem, applies a similar graph-based state model specifically to LLM workflows, with first-class support for cycles, checkpointing, and human-in-the-loop interrupts. The underlying idea is the same in both: state is explicit, transitions are defined, and the model's role is to drive transitions rather than own state."
        }
      </p>
      <p>
        {
          "Even without a library, the pattern is implementable. Define an enum of your agent's possible states. Write a transition function that takes a current state and an agent action and returns a new state — or throws if the transition is invalid. Store the current state outside the agent's context. Before each agent step, inject only the state and actions that are valid from the current position. After each step, validate the agent's output against the transition function before applying it."
        }
      </p>
      <p>
        {
          "This is more upfront design work than starting with a raw loop. You have to think through the states your task requires before you start building. That constraint is the point. If you cannot enumerate the states a task moves through, you do not understand the task well enough to automate it reliably. The design work that state machines require is work that was always necessary — it was just being deferred into production failures."
        }
      </p>

      <h2>{"The Deeper Connection"}</h2>
      <p>
        {"As I argued in "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="/writing/ai-coding-paradigm"
        >
          {"The Shifting Paradigm of Coding in the Age of AI"}
        </Link>
        {
          ", predictability is becoming a first-class property of well-designed systems. AI-generated code tends toward variation, and variation is the enemy of reviewability. The same principle applies one level up, to the agents doing the generating. An agent whose behavior is constrained by a state machine is an agent whose actions are predictable given its current state. That predictability is what makes agentic systems auditable, trustworthy, and safe to deploy in contexts where mistakes have real consequences."
        }
      </p>
      <p>
        {"The connection to "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="/writing/tech-debt-in-the-ai-era"
        >
          {"Tech Debt in the Age of AI"}
        </Link>
        {
          " is just as direct. Agentic systems that drift are agentic systems that accumulate structural debt — not in the codebase, but in the task execution itself. Every unchecked transition is a decision made without verification. Every silent failure is a gap in the work that gets papered over. The debt shows up eventually, either as incorrect outputs that reach users or as an agent that needs to be restarted and supervised manually because no one trusts it to run unattended. A state machine is the agentic equivalent of the architectural guardrails that keep AI-generated code from drifting from the intended design."
        }
      </p>

      <h2>{"Design the Machine Before You Write the Prompt"}</h2>
      <p>
        {
          "The mindset shift that state machines require is this: an agentic system is not a model doing a task. It is a system with defined states moving through a defined process, where a model is responsible for driving individual transitions. The model is powerful and flexible. The system is structured and constrained. Those two things are not in tension — the constraints are what allow the power to be useful."
        }
      </p>
      <p>
        {
          "The practical implication is that the design artifact you need before you write a single prompt is a state diagram, not a system prompt. What states can this task be in? What transitions are valid between them? What does it mean for a transition to have succeeded? What states are terminal — successfully or otherwise? Answer those questions, encode them in your orchestration layer, and the agent's role becomes dramatically clearer: at each step, given the current state, produce the output that drives the right transition."
        }
      </p>
      <p>
        {
          "The teams building reliable agentic systems are not the ones with the best prompts. They are the ones who treat the agent's behavior as an engineering problem — with the same rigor around state, invariants, and transitions that they would bring to any other stateful system. The model is not magic. It is a component. Design the system around it accordingly."
        }
      </p>
    </PostLayout>
  );
}
