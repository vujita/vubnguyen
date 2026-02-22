import { type Metadata } from "next";

import PostLayout from "@vujita/vubnguyen/src/components/PostLayout";

export const metadata: Metadata = {
  description:
    "The narrative that SaaS is dying has overcorrected. Some of the pessimism is warranted — but conflating a discipline cycle with a model failure leads builders to abandon durable ideas.",
  title: "The SaaS Overcorrection — Vu Nguyen",
};

export default function SaasMarketCorrectionPage() {
  return (
    <PostLayout
      date="2026-02-22"
      description="The narrative that SaaS is dying has overcorrected. Some of the pessimism is warranted — but conflating a discipline cycle with a model failure leads builders to abandon durable ideas."
      tags={["saas", "startups", "engineering", "business", "market"]}
      title="The SaaS Overcorrection"
    >
      <p>{"The pendulum swings hard in tech. A few years ago, the consensus was that SaaS multiples would compound indefinitely — recurring revenue was magical, and the market rewarded growth above all else. Today the consensus has nearly inverted. \"SaaS is dead\" has become a sentence that gets said, written, and shared without much challenge."}</p>
      <p>{"Neither extreme is a useful map of reality. The pessimism about SaaS is not entirely wrong — but it has overcorrected in ways worth examining, especially for engineers and builders trying to decide what is worth building."}</p>

      <h2>{"The Valuation Reset Was Not a Model Failure"}</h2>
      <p>{"The most common error in the \"SaaS is dead\" narrative is conflating two things that are different: a valuation reset and a business model failure."}</p>
      <p>{"What happened between 2021 and 2023 was a valuation reset. Interest rates rose, the discount rate on future cash flows increased, and the multiples that investors were willing to pay for high-growth software companies compressed sharply. A company trading at 40x ARR in 2021 might trade at 8x in 2023 — not because the business got worse, but because the price the market assigned to future earnings changed."}</p>
      <p>{"That is a financial correction. It is not evidence that the SaaS model is structurally broken. Recurring revenue, predictable cash flows, and low marginal cost of delivery are still real properties. They have economic value independent of what investors were briefly willing to pay for them at the peak of a zero-interest-rate cycle."}</p>
      <p>{"The companies that genuinely struggled were the ones that needed 2021 market conditions to survive — businesses that were unprofitable not because they were investing in growth, but because the unit economics were never good. When capital got expensive, those businesses ran into trouble. That is not SaaS failing. That is capital discipline revealing which SaaS companies had real businesses."}</p>

      <h2>{"What the Pessimists Are Actually Seeing"}</h2>
      <p>{"The mistake of dismissing all the SaaS pessimism is just as bad as overcorrecting into it. There are real structural shifts underway, and builders who ignore them will run into them."}</p>
      <p>{"Software budgets are being audited in a way they weren't during the expansion years. Enterprise buyers added tools without much scrutiny when capital was cheap and growth was the only metric. Now, procurement is slower, renewals are negotiated harder, and finance teams are asking what software is actually being used. This is a real headwind for point solutions that got in under the radar but never became essential."}</p>
      <p>{"Bundling pressure is real in certain categories. Large platforms — Microsoft across its suite, Salesforce across its clouds, Google Workspace — have the distribution to offer \"good enough\" versions of capabilities that were previously served by independent products. Not every category is under this threat, but some are. Builders should be honest about which side of that line their product sits on."}</p>
      <p>{"The build-vs-buy calculus has also shifted. AI tools have reduced the cost of building certain categories of software functionality significantly. Things that were economically viable to buy at a per-seat price are now, in some cases, viable to build with a small engineering team. This does not undermine SaaS broadly — but it puts pressure on the thinner-moat ends of the market, and the pressure is directional."}</p>

      <h2>{"What Actually Changed, Permanently"}</h2>
      <p>{"Some things that looked temporary are not. The era of \"grow at all costs\" is over in a structural sense. Free cash flow and capital efficiency are now first-class metrics — not just for public company investors, but in the board conversations at Series B startups. That is not a market cycle. It reflects a broader recalibration of how the industry thinks about sustainable business building."}</p>
      <p>{"For SaaS companies specifically, this means growth that is not paired with a path to efficiency is no longer as fundable or as valuable. The model still works — but the game has tighter rules than it did in 2020."}</p>
      <p>{"Pricing models are under genuine pressure to evolve as well. The seat-based subscription, which was the dominant SaaS pricing pattern for a decade, is facing scrutiny from buyers who want to pay for outcomes or consumption rather than access. This is not universal, but it is directional. Companies that figure out how to align pricing with realized value will be more defensible than the ones that hold the old model out of habit."}</p>

      <h2>{"What This Means for Builders"}</h2>
      <p>{"For engineers and teams deciding what to build, the practical read is fairly simple: the SaaS model still works, but the bar for what makes a SaaS product defensible has risen."}</p>
      <p>{"Products that are defensible are built on deep workflow integration, not features. If a product is the place where a team does consequential work — where decisions are made, records are kept, processes run — switching cost is structural. Products that are just features, or that solve problems adjacent to where the real work happens, are the ones that get consolidated or replicated."}</p>
      <p>{"The categories worth building in are the ones where the workflow moat is real. Where customers cannot easily leave not because of artificial lock-in but because leaving would require changing how their team operates. That kind of defensibility survives both a valuation compression and a market consolidation."}</p>

      <h2>{"The Honest Read"}</h2>
      <p>{"The sentence \"SaaS is dead\" is as wrong as \"SaaS multiples will always be 20x ARR.\" Both are extrapolations from a moment, not descriptions of durable reality."}</p>
      <p>{"What is true is that the easy version of SaaS — raise money, grow fast, price on seats, let the tide carry the valuation — is behind us. What persists is the underlying logic: software that is genuinely valuable to the work people do, delivered continuously, with pricing that reflects that value, is still one of the better business models in existence."}</p>
      <p>{"The overcorrection in sentiment has created a gap between what people say about SaaS and what the best SaaS companies are actually doing. Builders who can see through the narrative to the structural reality are in a better position — not because the market is easy, but because they are starting from an accurate picture of it."}</p>
    </PostLayout>
  );
}
