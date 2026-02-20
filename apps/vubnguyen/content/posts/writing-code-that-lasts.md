---
title: "Writing Code That Lasts"
date: "2024-06-20"
description: "Code is read far more than it is written. The choices you make today will be debugged by someone at 2am three years from now — make their life easier."
tags: ["engineering", "craft", "code-quality"]
---

The most honest thing I can say about software engineering is this: we are primarily in the business of managing complexity. Every line of code is a bet that the value it provides outweighs the cognitive load it adds to the codebase.

## Clarity Over Cleverness

The cleverest solution is rarely the best one. A function that uses a clever bit manipulation trick to save two lines of code will confuse the next engineer who reads it — possibly you, six months later.

Write code that tells a story. Name variables and functions after what they represent, not how they work. The implementation is self-documenting. The intent rarely is.

## Boundaries and Contracts

Long-lived systems are built around stable interfaces, not stable implementations. The internal workings of a module can be rewritten as many times as needed. The contract it presents to the outside world should change rarely and carefully.

Define your module boundaries early. Put the things that are likely to change behind abstractions. Leave the things that are stable as they are.

## The Cost of Abstraction

Every abstraction is a trade-off. It reduces one kind of complexity while introducing another. A premature abstraction bets on a pattern that may not hold. If you are not certain that two things are truly the same, resist the urge to unify them.

Wait until you have three concrete examples before extracting a general solution. Two might be coincidence.

## Delete Code Aggressively

Dead code is worse than no code. It misleads, it confuses, and it makes the useful code harder to find. When you remove a feature, remove its code. When an abstraction is no longer needed, flatten it back out.

The best code is the code that doesn't exist.
