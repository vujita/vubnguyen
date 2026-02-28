import { assign, setup } from "xstate";

export const CELL_SIZE = 24;
export const GRID_COLS = 20;
export const GRID_ROWS = 20;

export const DIFFICULTY_SPEEDS = {
  easy: 200,
  hard: 80,
  medium: 130,
} as const;

export type Difficulty = keyof typeof DIFFICULTY_SPEEDS;
export type Direction = "down" | "left" | "right" | "up";

export interface Point {
  x: number;
  y: number;
}

export interface SnakeContext {
  difficulty: Difficulty;
  direction: Direction;
  food: Point;
  pendingDirection: Direction;
  score: number;
  snake: Point[];
}

export type SnakeEvent = { type: "PAUSE" } | { type: "RESET" } | { type: "RESUME" } | { type: "TICK" } | { difficulty: Difficulty; type: "START" } | { direction: Direction; type: "STEER" };

function nextHead(head: Point, dir: Direction): Point {
  const moves: Record<Direction, Point> = {
    down: { x: head.x, y: head.y + 1 },
    left: { x: head.x - 1, y: head.y },
    right: { x: head.x + 1, y: head.y },
    up: { x: head.x, y: head.y - 1 },
  };
  return moves[dir];
}

function isOutOfBounds(p: Point): boolean {
  return p.x < 0 || p.x >= GRID_COLS || p.y < 0 || p.y >= GRID_ROWS;
}

function snakeOccupies(body: Point[], p: Point): boolean {
  return body.some((seg) => seg.x === p.x && seg.y === p.y);
}

function areOpposite(a: Direction, b: Direction): boolean {
  return (a === "left" && b === "right") || (a === "right" && b === "left") || (a === "up" && b === "down") || (a === "down" && b === "up");
}

function randomFood(snake: Point[]): Point {
  let candidate: Point;
  do {
    candidate = {
      x: Math.floor(Math.random() * GRID_COLS),
      y: Math.floor(Math.random() * GRID_ROWS),
    };
  } while (snakeOccupies(snake, candidate));
  return candidate;
}

export const snakeMachine = setup({
  guards: {
    willCollide: ({ context }: { context: SnakeContext }) => {
      const head = context.snake[0];
      if (!head) return true;
      const next = nextHead(head, context.pendingDirection);
      return isOutOfBounds(next) || snakeOccupies(context.snake.slice(1), next);
    },
  },
  types: {
    context: {} as SnakeContext,
    events: {} as SnakeEvent,
  },
}).createMachine({
  context: {
    difficulty: "medium",
    direction: "right",
    food: { x: 15, y: 10 },
    pendingDirection: "right",
    score: 0,
    snake: [],
  },
  id: "snake",
  initial: "idle",
  states: {
    dead: {
      on: {
        RESET: { target: "idle" },
      },
    },
    idle: {
      on: {
        START: {
          actions: assign(({ event }) => {
            const snake: Point[] = [
              { x: 10, y: 10 },
              { x: 9, y: 10 },
              { x: 8, y: 10 },
            ];
            return {
              difficulty: event.difficulty,
              direction: "right" as Direction,
              food: randomFood(snake),
              pendingDirection: "right" as Direction,
              score: 0,
              snake,
            };
          }),
          target: "playing",
        },
      },
    },
    paused: {
      on: {
        RESET: { target: "idle" },
        RESUME: { target: "playing" },
      },
    },
    playing: {
      on: {
        PAUSE: { target: "paused" },
        RESET: { target: "idle" },
        STEER: {
          actions: assign({
            pendingDirection: ({ context, event }: { context: SnakeContext; event: SnakeEvent }) => {
              if (event.type !== "STEER") return context.pendingDirection;
              if (areOpposite(context.direction, event.direction)) return context.pendingDirection;
              return event.direction;
            },
          }),
        },
        TICK: [
          { guard: "willCollide", target: "dead" },
          {
            actions: assign(({ context }: { context: SnakeContext }) => {
              const dir = context.pendingDirection;
              const head = context.snake[0];
              if (!head) return {};
              const newHead = nextHead(head, dir);
              const ateFood = newHead.x === context.food.x && newHead.y === context.food.y;
              const newSnake = ateFood ? [newHead, ...context.snake] : [newHead, ...context.snake.slice(0, -1)];
              return {
                direction: dir,
                food: ateFood ? randomFood(newSnake) : context.food,
                score: ateFood ? context.score + 1 : context.score,
                snake: newSnake,
              };
            }),
          },
        ],
      },
    },
  },
});
