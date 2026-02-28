import { type Metadata } from "next";
import Link from "next/link";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";
import StateMachineDiagram from "@vujita/vubnguyen/src/components/StateMachineDiagram";

export const metadata: Metadata = {
  description: "LLM agents drift. They hold contradictory beliefs, wander into undefined transitions, and silently declare victory. State machines are how you stop that.",
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
      <p>{"The pitch for agentic AI systems is compelling: give a model access to tools, let it reason across multiple steps, and it will accomplish tasks that a single prompt never could. The agent plans, executes, observes, and adapts. It can write code, run tests, fix failures, and iterate — all without a human directing each step."}</p>
      <p>{"The reality, for anyone who has built and operated these systems, is messier. Agents drift. They contradict decisions they made two steps ago. They wander into action sequences that were never sanctioned. They declare a task complete when it is not, or loop endlessly because they cannot recognize that it is. The more capable the underlying model, the more convincing the drift looks — which makes it harder, not easier, to catch."}</p>
      <p>{"The solution is not a better prompt. It is a better structure. And the clearest way I know to explain what that structure looks like is with a game of Snake."}</p>

      <StateMachineDiagram />

      <h2>{"A Familiar Machine"}</h2>
      <p>
        {"I recently built a "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="/games/snake"
        >
          {"Snake game"}
        </Link>
        {" using XState v5 and Phaser 3. The game logic lives entirely in a state machine with four states: "}
        <code>{"idle"}</code>
        {", "}
        <code>{"playing"}</code>
        {", "}
        <code>{"paused"}</code>
        {", and "}
        <code>{"dead"}</code>
        {". Six event types drive transitions between them: "}
        <code>{"START"}</code>
        {", "}
        <code>{"PAUSE"}</code>
        {", "}
        <code>{"RESUME"}</code>
        {", "}
        <code>{"RESET"}</code>
        {", "}
        <code>{"STEER"}</code>
        {", and "}
        <code>{"TICK"}</code>
        {"."}
      </p>
      <p>{"The rules that fall out of this are obvious and correct in a way that is worth paying attention to. You cannot steer a snake that is not playing — STEER only applies in the playing state. You cannot resume a game that was never paused — RESUME has no effect outside of paused. You cannot tick a dead snake forward — TICK in the dead state simply does not exist as a valid transition. And when a TICK does arrive in playing, a guard called willCollide is evaluated by the machine before anything happens. If the next cell would be a wall or the snake's own body, the machine transitions to dead. The snake itself does not make this decision. The machine does."}</p>
      <p>{"This is a state machine doing its job: holding the authoritative state of the system, enforcing which events are valid in each state, and evaluating guards before committing to a transition. The renderer, the input handler, the physics loop — none of them own state. They send events. The machine decides what those events mean."}</p>

      <h2>{"Why Agentic Systems Drift"}</h2>
      <p>{"Now imagine building that Snake game without the state machine. Instead of a defined set of states and transitions, you have a loop: every tick, you send the current game context to a model and ask it what should happen next. The model is smart. It knows Snake. It will probably get the right answer most of the time."}</p>
      <p>{"But here is what you have given up. The model does not have a formal record of whether the game is paused. It infers that from context. By tick forty, when the context window is full of game history and the model's attention is spread thin, the inference may be wrong. The model might decide to advance the snake during a pause, or fail to recognize that the snake has already died, or — because models are optimized to be helpful — rationalize a collision as a near miss and continue playing anyway."}</p>
      <p>{"This is precisely how agentic systems built as prompt-driven loops behave in production. The failure modes have names."}</p>
      <p>{"The first is contradictory state. An agent performing a multi-step task will make a decision early in a session — choose a strategy, confirm a constraint, establish an assumption — and then, several tool calls later, make a different decision that directly contradicts the first. The model is not lying. It simply does not have a reliable mechanism for tracking what it has already committed to. The context window is long, attention is imperfect, and by step eight the early decisions are effectively invisible. The agent holds contradictory beliefs simultaneously and acts on whichever one surfaced most recently. This is the Snake game where the machine has forgotten whether it is paused."}</p>
      <p>{"The second is an unbounded decision space. At each step, an unrestricted agent can take essentially any action its tools permit. There is nothing stopping it from deciding, mid-task, to use a completely different approach, invoke a tool that has no relevance to the current goal, or take an action that is technically valid but operationally dangerous in the current context. This is the Snake game where STEER is accepted regardless of state, and the renderer dutifully processes steering input on a dead snake."}</p>
      <p>{"The third is silent failure. Agents are optimized to be helpful, which means they are biased toward appearing successful. An agent that cannot complete a step will often rationalize past it — summarizing the situation as resolved, reporting partial progress as complete, or skipping a step entirely and continuing as if it had succeeded. This is the willCollide guard evaluated by the model instead of the machine. The model, wanting to be useful, decides the collision was not quite fatal."}</p>

      <h2>{"What State Machines Give You"}</h2>
      <p>{"A state machine is a formal model with three components: a finite set of states, a set of valid transitions between those states, and the conditions that trigger each transition. At any moment, the system is in exactly one state. It can only move to states that are reachable from the current one. Transitions that are not defined simply cannot happen."}</p>
      <p>{"The Snake machine makes this concrete. "}
        <code>{"idle"}</code>
        {" only accepts "}
        <code>{"START"}</code>
        {". "}
        <code>{"dead"}</code>
        {" only accepts "}
        <code>{"RESET"}</code>
        {". "}
        <code>{"paused"}</code>
        {" accepts "}
        <code>{"RESUME"}</code>
        {" and "}
        <code>{"RESET"}</code>
        {". Everything else is ignored. The machine cannot be argued into an invalid transition by a persuasive context window."}</p>
      <p>{"Applying this model to an agentic system does not change what the agent can do — it changes what the agent is allowed to do depending on where it is. The model still reasons. It still calls tools. But the orchestration layer — the code outside the model — maintains authoritative state and enforces which actions are valid in that state. The agent's output becomes a signal that influences transitions; it does not unilaterally determine them."}</p>
      <p>{"This directly addresses each failure mode. Contradictory state disappears because the current state is owned by the system, not inferred by the model. Whatever the agent believed three steps ago is irrelevant — the system knows exactly where it is. Unbounded decisions disappear because the transition function only permits actions that are valid from the current state. Silent failure disappears because a step cannot be marked complete by the agent's assertion alone — the system requires a verified transition before advancing."}</p>
      <p>{"There is a secondary benefit that matters as much as correctness: debuggability. When an agentic system fails, the hardest question to answer is usually where it went wrong. In a prompt-driven loop, the failure is buried somewhere in a long context window with no structural landmarks. In a state machine, you have an audit trail of every state and every transition. You can see exactly where the system was when it went off-track, and exactly what input triggered the bad transition. In the Snake game, I can replay every TICK and every STEER and know precisely when and why the snake died. The same should be true of every agentic system."}</p>

      <h2>{"What This Looks Like in Practice"}</h2>
      <p>{"The Snake game uses XState v5, which is the library I would reach for first when modeling agentic systems in TypeScript. XState gives you a visual representation of your machine — the diagram at the top of this article is generated from the same machine definition the game runs on — enforced transitions, guards that gate state changes, and a clean actor model for managing side effects. The machine definition is plain data. You can inspect it, serialize it, checkpoint it, and resume it."}</p>
      <p>{"LangGraph, from the LangChain ecosystem, applies a similar graph-based state model specifically to LLM workflows, with first-class support for cycles, checkpointing, and human-in-the-loop interrupts. The underlying idea is the same in both: state is explicit, transitions are defined, and the model's role is to drive transitions rather than own state."}</p>
      <p>{"Even without a library, the pattern is implementable. Define an enum of your agent's possible states. Write a transition function that takes a current state and an agent action and returns a new state — or throws if the transition is invalid. Store the current state outside the agent's context. Before each agent step, inject only the state and actions that are valid from the current position. After each step, validate the agent's output against the transition function before applying it."}</p>
      <p>{"This is more upfront design work than starting with a raw loop. You have to think through the states your task requires before you start building. That constraint is the point. If you cannot enumerate the states a task moves through, you do not understand the task well enough to automate it reliably. The Snake machine has four states because Snake has four states — not because someone tried to enumerate them cleverly, but because the game's rules make them obvious once you look. The same clarity is available for any agentic task, if you do the work."}</p>

      <h2>{"The Deeper Connection"}</h2>
      <p>
        {"As I argued in "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="/writing/ai-coding-paradigm"
        >
          {"The Shifting Paradigm of Coding in the Age of AI"}
        </Link>
        {", predictability is becoming a first-class property of well-designed systems. AI-generated code tends toward variation, and variation is the enemy of reviewability. The same principle applies one level up, to the agents doing the generating. An agent whose behavior is constrained by a state machine is an agent whose actions are predictable given its current state. That predictability is what makes agentic systems auditable, trustworthy, and safe to deploy in contexts where mistakes have real consequences."}
      </p>
      <p>
        {"The connection to "}
        <Link
          className="text-[var(--site-accent)] underline underline-offset-2 transition-colors hover:opacity-75"
          href="/writing/tech-debt-in-the-ai-era"
        >
          {"Tech Debt in the Age of AI"}
        </Link>
        {" is just as direct. Agentic systems that drift are agentic systems that accumulate structural debt — not in the codebase, but in the task execution itself. Every unchecked transition is a decision made without verification. Every silent failure is a gap in the work that gets papered over. The debt shows up eventually, either as incorrect outputs that reach users or as an agent that needs to be restarted and supervised manually because no one trusts it to run unattended. A state machine is the agentic equivalent of the architectural guardrails that keep AI-generated code from drifting from the intended design."}
      </p>

      <h2>{"Design the Machine Before You Write the Prompt"}</h2>
      <p>{"The mindset shift that state machines require is this: an agentic system is not a model doing a task. It is a system with defined states moving through a defined process, where a model is responsible for driving individual transitions. The model is powerful and flexible. The system is structured and constrained. Those two things are not in tension — the constraints are what allow the power to be useful."}</p>
      <p>{"The Snake machine was easy to design because Snake has clear rules. An idle game waits to start. A playing game advances on every tick, steers on input, and dies on collision. A paused game waits to resume. A dead game waits to reset. Four states, six events, one guard. Anyone who has played Snake could have written those rules without looking at the code."}</p>
      <p>{"The practical implication is that the design artifact you need before you write a single prompt is a state diagram, not a system prompt. What states can this task be in? What transitions are valid between them? What does it mean for a transition to have succeeded? What states are terminal — successfully or otherwise? Answer those questions, encode them in your orchestration layer, and the agent's role becomes dramatically clearer: at each step, given the current state, produce the output that drives the right transition. Same as the snake."}</p>
      <p>{"The teams building reliable agentic systems are not the ones with the best prompts. They are the ones who treat the agent's behavior as an engineering problem — with the same rigor around state, invariants, and transitions that they would bring to any other stateful system. The model is not magic. It is a component. Design the system around it accordingly."}</p>
    </PostLayout>
  );
}
