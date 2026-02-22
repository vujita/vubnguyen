"use client";

import { useCallback, useState } from "react";

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

type HandType = "point" | "straight" | "triple";

interface HandResult {
  type: HandType;
  score: number;
  label: string;
}

type GamePhase = "idle" | "dealt" | "result";
type Outcome = "player" | "computer" | "tie";

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

// A=1, 2–9 face value, 10/J/Q/K contribute 0 to point total
const POINT_VALUES: Record<Rank, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 0,
  J: 0,
  Q: 0,
  K: 0,
};

// Rank order for straight detection (A = 1 or 14)
const RANK_ORDER: Record<Rank, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
};

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j]!, d[i]!];
  }
  return d;
}

function isRed(suit: Suit): boolean {
  return suit === "♥" || suit === "♦";
}

function evaluateHand(cards: Card[]): HandResult {
  const [a, b, c] = cards as [Card, Card, Card];

  // Triple: all same rank
  if (a.rank === b.rank && b.rank === c.rank) {
    return {
      type: "triple",
      score: RANK_ORDER[a.rank],
      label: `Triple ${a.rank}s`,
    };
  }

  // Straight: 3 consecutive ranks (A can be low or high)
  const rankNums = cards
    .map((card) => RANK_ORDER[card.rank])
    .sort((x, y) => x - y) as [number, number, number];
  const [r1, r2, r3] = rankNums;

  const isNormal = r3 - r1 === 2 && r2 - r1 === 1;
  // Ace-high straight: Q(12)-K(13)-A(1 treated as 14)
  const isAceHigh = r1 === 1 && r2 === 12 && r3 === 13;

  if (isNormal || isAceHigh) {
    const highRank = isAceHigh ? 14 : r3;
    const sorted = [...cards].sort((x, y) => {
      let rx = RANK_ORDER[x.rank];
      let ry = RANK_ORDER[y.rank];
      if (isAceHigh) {
        if (rx === 1) rx = 14;
        if (ry === 1) ry = 14;
      }
      return rx - ry;
    });
    const rankLabel = sorted.map((card) => card.rank).join("-");
    return {
      type: "straight",
      score: highRank,
      label: `Straight (${rankLabel})`,
    };
  }

  // Point hand: sum mod 10
  const total = cards.reduce(
    (sum, card) => sum + POINT_VALUES[card.rank],
    0,
  );
  const point = total % 10;
  return {
    type: "point",
    score: point,
    label: point === 9 ? "Nine — Best Point!" : `${point} Points`,
  };
}

function compareHands(player: HandResult, computer: HandResult): Outcome {
  const typeOrder: Record<HandType, number> = {
    point: 0,
    straight: 1,
    triple: 2,
  };
  const pr = typeOrder[player.type];
  const cr = typeOrder[computer.type];
  if (pr > cr) return "player";
  if (cr > pr) return "computer";
  if (player.score > computer.score) return "player";
  if (computer.score > player.score) return "computer";
  return "tie";
}

const BET = 10;

function PlayingCard({
  card,
  faceDown = false,
}: {
  card: Card;
  faceDown?: boolean;
}) {
  if (faceDown) {
    return (
      <div className="flex h-24 w-16 flex-col items-center justify-center rounded-lg border-2 border-[var(--site-border)] bg-[var(--site-surface)] sm:h-32 sm:w-20">
        <div className="font-display text-3xl text-[var(--site-muted)] sm:text-4xl">
          {"?"}
        </div>
      </div>
    );
  }

  const red = isRed(card.suit);
  const textColor = red ? "text-red-500" : "text-[var(--site-text)]";

  return (
    <div
      className={`flex h-24 w-16 flex-col justify-between rounded-lg border-2 border-[var(--site-border)] bg-white p-1.5 shadow-sm dark:bg-zinc-900 sm:h-32 sm:w-20 sm:p-2 ${textColor}`}
    >
      <div className="leading-none">
        <div className="text-xs font-bold sm:text-sm">{card.rank}</div>
        <div className="text-xs sm:text-sm">{card.suit}</div>
      </div>
      <div className="self-center text-xl sm:text-2xl">{card.suit}</div>
      <div className="rotate-180 leading-none">
        <div className="text-xs font-bold sm:text-sm">{card.rank}</div>
        <div className="text-xs sm:text-sm">{card.suit}</div>
      </div>
    </div>
  );
}

function HandLabel({ result }: { result: HandResult | null }) {
  if (!result) return null;
  const colors: Record<HandType, string> = {
    triple: "text-[var(--site-accent)] font-bold",
    straight: "text-[var(--site-accent)]",
    point: "text-[var(--site-muted)]",
  };
  return (
    <p className={`font-code mt-2 text-center text-xs ${colors[result.type]}`}>
      {result.label}
    </p>
  );
}

export function LiengGame() {
  const [chips, setChips] = useState(100);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [computerHand, setComputerHand] = useState<Card[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [playerResult, setPlayerResult] = useState<HandResult | null>(null);
  const [computerResult, setComputerResult] = useState<HandResult | null>(null);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const deal = useCallback(() => {
    if (chips < BET) return;
    const deck = shuffle(createDeck());
    setPlayerHand(deck.slice(0, 3));
    setComputerHand(deck.slice(3, 6));
    setChips((prev) => prev - BET);
    setPhase("dealt");
    setOutcome(null);
    setPlayerResult(null);
    setComputerResult(null);
    setMessage("");
  }, [chips]);

  const play = useCallback(() => {
    const pH = evaluateHand(playerHand);
    const cH = evaluateHand(computerHand);
    const result = compareHands(pH, cH);

    setPlayerResult(pH);
    setComputerResult(cH);
    setOutcome(result);
    setPhase("result");

    if (result === "player") {
      setChips((prev) => prev + BET * 2);
      setMessage("You win! +10 chips");
    } else if (result === "tie") {
      setChips((prev) => prev + BET);
      setMessage("Tie — bet returned.");
    } else {
      setMessage("Computer wins. Better luck next hand.");
    }
  }, [playerHand, computerHand]);

  const fold = useCallback(() => {
    const cH = evaluateHand(computerHand);
    setComputerResult(cH);
    setPlayerResult(null);
    setOutcome("computer");
    setPhase("result");
    const refund = Math.floor(BET / 2);
    setChips((prev) => prev + refund);
    setMessage(`You folded. -${BET - refund} chips`);
  }, [computerHand]);

  const nextHand = useCallback(() => {
    if (chips < BET) {
      setGameOver(true);
    } else {
      setPhase("idle");
    }
  }, [chips]);

  const restart = useCallback(() => {
    setChips(100);
    setPhase("idle");
    setGameOver(false);
    setOutcome(null);
    setPlayerResult(null);
    setComputerResult(null);
    setMessage("");
  }, []);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <p className="font-display text-4xl italic text-[var(--site-text)]">
          {"Game Over"}
        </p>
        <p className="font-code text-sm text-[var(--site-muted)]">
          {"You ran out of chips."}
        </p>
        <button
          onClick={restart}
          className="font-code rounded-lg border border-[var(--site-accent)] px-6 py-2 text-sm text-[var(--site-accent)] transition-colors duration-200 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]"
        >
          {"Play Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Chip counter */}
      <div className="flex items-center gap-2">
        <span className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)]">
          {"Chips"}
        </span>
        <span className="font-display text-2xl italic text-[var(--site-accent)]">
          {chips}
        </span>
      </div>

      {/* Computer hand */}
      <div className="flex flex-col items-center gap-3">
        <p className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)]">
          {"Dealer"}
        </p>
        <div className="flex gap-3">
          {phase === "idle"
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-16 rounded-lg border-2 border-dashed border-[var(--site-border)] sm:h-32 sm:w-20"
                />
              ))
            : computerHand.map((card, i) => (
                <PlayingCard
                  key={i}
                  card={card}
                  faceDown={phase === "dealt"}
                />
              ))}
        </div>
        {phase === "result" && <HandLabel result={computerResult} />}
      </div>

      {/* Outcome banner */}
      {phase === "result" && outcome && (
        <div
          className={`font-code rounded-lg border px-6 py-3 text-center text-sm ${
            outcome === "player"
              ? "border-emerald-500 text-emerald-500"
              : outcome === "tie"
                ? "border-[var(--site-muted)] text-[var(--site-muted)]"
                : "border-red-500 text-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* Player hand */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          {phase === "idle"
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-16 rounded-lg border-2 border-dashed border-[var(--site-border)] sm:h-32 sm:w-20"
                />
              ))
            : playerHand.map((card, i) => (
                <PlayingCard key={i} card={card} faceDown={false} />
              ))}
        </div>
        {(phase === "dealt" || phase === "result") && (
          <HandLabel
            result={phase === "result" ? playerResult : evaluateHand(playerHand)}
          />
        )}
        <p className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)]">
          {"You"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {phase === "idle" && (
          <button
            onClick={deal}
            disabled={chips < BET}
            className="font-code rounded-lg border border-[var(--site-accent)] px-6 py-2 text-sm text-[var(--site-accent)] transition-colors duration-200 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {`Deal (${BET} chips)`}
          </button>
        )}
        {phase === "dealt" && (
          <>
            <button
              onClick={play}
              className="font-code rounded-lg border border-emerald-500 px-6 py-2 text-sm text-emerald-500 transition-colors duration-200 hover:bg-emerald-500 hover:text-white"
            >
              {"Play"}
            </button>
            <button
              onClick={fold}
              className="font-code rounded-lg border border-[var(--site-border)] px-6 py-2 text-sm text-[var(--site-muted)] transition-colors duration-200 hover:border-red-500 hover:text-red-500"
            >
              {"Fold (−5)"}
            </button>
          </>
        )}
        {phase === "result" && (
          <button
            onClick={nextHand}
            className="font-code rounded-lg border border-[var(--site-accent)] px-6 py-2 text-sm text-[var(--site-accent)] transition-colors duration-200 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]"
          >
            {"Next Hand"}
          </button>
        )}
      </div>

      {/* Rules reference */}
      <details className="w-full max-w-sm">
        <summary className="font-code cursor-pointer text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-text)]">
          {"How to Play"}
        </summary>
        <div className="mt-3 space-y-2 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] p-4 text-xs text-[var(--site-muted)]">
          <p>
            <span className="font-code text-[var(--site-accent)]">
              {"Hand Rankings"}
            </span>{" "}
            {"(lowest → highest)"}
          </p>
          <ul className="space-y-1 pl-3">
            <li>
              {"1. "}
              <strong className="text-[var(--site-text)]">{"Point"}</strong>
              {
                " — sum the card values, last digit wins. Best is 9. (A=1, 2–9 face, 10/J/Q/K=0)"
              }
            </li>
            <li>
              {"2. "}
              <strong className="text-[var(--site-text)]">{"Straight"}</strong>
              {
                " — any 3 consecutive ranks (e.g. 4-5-6, J-Q-K, Q-K-A). Beats any point hand."
              }
            </li>
            <li>
              {"3. "}
              <strong className="text-[var(--site-text)]">{"Triple"}</strong>
              {
                " — three of the same rank (e.g. three Queens). Beats everything."
              }
            </li>
          </ul>
          <p className="pt-1">
            {
              "Ties return your bet. Folding returns half your bet. You start with 100 chips."
            }
          </p>
        </div>
      </details>
    </div>
  );
}
