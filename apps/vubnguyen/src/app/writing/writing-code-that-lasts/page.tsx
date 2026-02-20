import { type Metadata } from "next";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";

export const metadata: Metadata = {
  description: "Code is read far more than it is written. The choices you make today will be debugged by someone at 2am three years from now — make their life easier.",
  title: "Writing Code That Lasts — Vu Nguyen",
};

export default function WritingCodeThatLastsPage() {
  return (
    <PostLayout
      date="2024-06-20"
      description="Code is read far more than it is written. The choices you make today will be debugged by someone at 2am three years from now — make their life easier."
      tags={["engineering", "craft", "code-quality"]}
      title="Writing Code That Lasts"
    >
      <p>{"The most honest thing I can say about software engineering is this: we are primarily in the business of managing complexity. Every line of code is a bet that the value it provides outweighs the cognitive load it adds to the codebase."}</p>

      <h2>{"Clarity Over Cleverness"}</h2>
      <p>{"The cleverest solution is rarely the best one. A function that uses a clever bit manipulation trick to save two lines of code will confuse the next engineer who reads it — possibly you, six months later."}</p>
      <p>{"Write code that tells a story. Name variables and functions after what they represent, not how they work. The implementation is self-documenting. The intent rarely is."}</p>

      <h2>{"Boundaries and Contracts"}</h2>
      <p>{"Long-lived systems are built around stable interfaces, not stable implementations. The internal workings of a module can be rewritten as many times as needed. The contract it presents to the outside world should change rarely and carefully."}</p>
      <p>{"Define your module boundaries early. Put the things that are likely to change behind abstractions. Leave the things that are stable as they are."}</p>

      <h2>{"The Cost of Abstraction"}</h2>
      <p>{"Every abstraction is a trade-off. It reduces one kind of complexity while introducing another. A premature abstraction bets on a pattern that may not hold. If you are not certain that two things are truly the same, resist the urge to unify them."}</p>
      <p>{"Wait until you have three concrete examples before extracting a general solution. Two might be coincidence."}</p>

      <h2>{"Delete Code Aggressively"}</h2>
      <p>{"Dead code is worse than no code. It misleads, it confuses, and it makes the useful code harder to find. When you remove a feature, remove its code. When an abstraction is no longer needed, flatten it back out."}</p>
      <p>{"The best code is the code that does not exist."}</p>
    </PostLayout>
  );
}
