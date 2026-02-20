---
title: "On Leading Engineering Teams"
date: "2024-09-03"
description: "What I have learned about technical leadership — the parts no one tells you about when you transition from individual contributor to staff engineer."
tags: ["leadership", "engineering", "team"]
---

The transition from senior engineer to staff engineer is not a promotion in the traditional sense. It is a change in what you are optimizing for. You shift from maximizing your own output to maximizing the output of your team.

This shift is harder than it sounds.

## Multiplying, Not Adding

An individual contributor adds value linearly. A staff engineer should multiply it. This means your most important work is often invisible: the design review that prevents a six-month detour, the conversation that unblocks someone, the RFC that aligns three teams before they start diverging.

Invisible work is still work. Learn to communicate its value without being self-promotional about it.

## The Map and the Territory

At staff level, you are responsible for maintaining the map of a large technical territory. You need to know enough about each area to ask the right questions, even if you are not writing the code yourself.

This requires ruthless prioritization of where to go deep versus where to stay shallow. Invest depth in the areas where your judgment is most needed. Let the people closest to the problem own the details.

## On Technical Decisions

The most consequential technical decisions are often not purely technical. They involve organizational dynamics, team capabilities, and business constraints. The best technical decision that your team cannot execute is not actually the best decision.

Always ask: who will build this, who will maintain it, and what happens when it breaks at 3am?

## Feedback Is a Gift

Give it early, give it directly, give it specifically. A code review comment that says "this could be cleaner" is nearly useless. One that says "this function has four responsibilities and will be hard to test — consider extracting the transformation logic" is actionable.

The same applies to receiving feedback. Assume good intent. Ask clarifying questions before defending.
