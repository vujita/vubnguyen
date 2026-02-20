---
title: "Building Systems That Scale"
date: "2024-11-15"
description: "Lessons learned from scaling analytics infrastructure to handle billions of events per day — and the engineering principles that made it possible."
tags: ["distributed-systems", "engineering", "platform"]
---

Scaling a system is not a single event. It is a continuous process of observation, measurement, and deliberate trade-offs. After years of working on analytics infrastructure that processes billions of events daily, I have distilled a few principles that matter most.

## Start With Observability

Before you can scale anything, you need to understand it. A system you cannot observe is a system you cannot improve. Instrument early, instrument deeply. Track latency percentiles — not just averages. P99 latency is where your users live.

The single most valuable investment at Amplitude was building comprehensive dashboards before we needed them. When traffic spikes happened, we already knew where to look.

## Embrace Boring Technology

There is a temptation, especially in platform engineering, to reach for the newest tool. Resist it. Kafka, PostgreSQL, and Redis have solved hard problems for decades. Their failure modes are well-documented. Their operational characteristics are understood.

New technology introduces unknowns you cannot afford during an outage at 3am.

## Design for Failure

Every distributed system will experience partial failure. The question is not *if* a component will go down, but *when*, and whether your system degrades gracefully or catastrophically.

Build bulkheads. Isolate failure domains. Design your retry strategies carefully — exponential backoff with jitter is not premature optimization, it is basic courtesy to your dependencies.

## The Boring Middle

The heroic moments of engineering — the big rewrites, the 10x performance improvements — are rare. Most of the work is incremental: adding indexes, tuning batch sizes, fixing memory leaks. This unglamorous work is what actually keeps systems running.

Learn to love the boring middle. That is where systems are maintained.
