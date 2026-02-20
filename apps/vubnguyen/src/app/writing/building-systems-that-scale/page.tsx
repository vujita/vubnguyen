import { type Metadata } from "next";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";

export const metadata: Metadata = {
  description: "Lessons learned from scaling analytics infrastructure to handle billions of events per day — and the engineering principles that made it possible.",
  title: "Building Systems That Scale — Vu Nguyen",
};

export default function BuildingSystemsThatScalePage() {
  return (
    <PostLayout
      date="2024-11-15"
      description="Lessons learned from scaling analytics infrastructure to handle billions of events per day — and the engineering principles that made it possible."
      tags={["distributed-systems", "engineering", "platform"]}
      title="Building Systems That Scale"
    >
      <p>{"Scaling a system is not a single event. It is a continuous process of observation, measurement, and deliberate trade-offs. After years of working on analytics infrastructure that processes billions of events daily, I have distilled a few principles that matter most."}</p>

      <h2>{"Start With Observability"}</h2>
      <p>{"Before you can scale anything, you need to understand it. A system you cannot observe is a system you cannot improve. Instrument early, instrument deeply. Track latency percentiles — not just averages. P99 latency is where your users live."}</p>
      <p>{"The single most valuable investment at Amplitude was building comprehensive dashboards before we needed them. When traffic spikes happened, we already knew where to look."}</p>

      <h2>{"Embrace Boring Technology"}</h2>
      <p>{"There is a temptation, especially in platform engineering, to reach for the newest tool. Resist it. Kafka, PostgreSQL, and Redis have solved hard problems for decades. Their failure modes are well-documented. Their operational characteristics are understood."}</p>
      <p>{"New technology introduces unknowns you cannot afford during an outage at 3am."}</p>

      <h2>{"Design for Failure"}</h2>
      <p>
        {"Every distributed system will experience partial failure. The question is not "}
        <em>{"if"}</em>
        {" a component will go down, but "}
        <em>{"when"}</em>
        {", and whether your system degrades gracefully or catastrophically."}
      </p>
      <p>{"Build bulkheads. Isolate failure domains. Design your retry strategies carefully — exponential backoff with jitter is not premature optimization, it is basic courtesy to your dependencies."}</p>

      <h2>{"The Boring Middle"}</h2>
      <p>{"The heroic moments of engineering — the big rewrites, the 10x performance improvements — are rare. Most of the work is incremental: adding indexes, tuning batch sizes, fixing memory leaks. This unglamorous work is what actually keeps systems running."}</p>
      <p>{"Learn to love the boring middle. That is where systems are maintained."}</p>
    </PostLayout>
  );
}
