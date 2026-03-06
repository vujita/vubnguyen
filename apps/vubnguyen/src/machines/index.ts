// Register machines here to have them automatically diagrammed and documented.
// The diagram generator (scripts/generate-state-diagrams.ts) imports from this
// file — adding an export is all it takes to include a new machine.
export { blogFilterMachine } from "./blogFilterMachine";
export { snakeMachine } from "../app/games/snake/snakeMachine";
export { spaceInvadersMachine } from "../app/games/space-invaders/spaceInvadersMachine";
export { gameMachine as marioGameMachine } from "../app/games/mario/gameMachine";
export { levelMachine as marioLevelMachine } from "../app/games/mario/levelMachine";
export { playerMachine as marioPlayerMachine } from "../app/games/mario/playerMachine";
export { enemyMachine as marioEnemyMachine } from "../app/games/mario/enemyMachine";
