/**
 * generate-state-diagrams.ts
 *
 * Traverses the blogFilterMachine config, emits Mermaid stateDiagram-v2 text
 * for each logical machine, then renders each .mmd to a .png via mmdc.
 *
 * Usage: pnpm tsx scripts/generate-state-diagrams.ts
 */

import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { blogFilterMachine } from "../apps/vubnguyen/src/machines/blogFilterMachine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const outputDir = join(rootDir, "docs/state-machines");
const mmdc = join(rootDir, "node_modules/.bin/mmdc");
const puppeteerConfig = join(rootDir, "scripts/puppeteer-config.json");

mkdirSync(outputDir, { recursive: true });

// ─── Types (mirrors XState v5 config shape) ────────────────────────────────

type TransitionDef = { target?: string; guard?: unknown; actions?: unknown } | string;

type StateNodeConfig = {
  initial?: string;
  type?: string;
  states?: Record<string, StateNodeConfig>;
  on?: Record<string, TransitionDef | TransitionDef[]>;
};

type MachineConfig = {
  id: string;
  type?: string;
  context?: unknown;
  states?: Record<string, StateNodeConfig>;
};

// ─── Mermaid helpers ───────────────────────────────────────────────────────

/**
 * Build the inner lines for a flat compound state (no parallel regions).
 * Adds the initial [*] marker and all transitions from each child state.
 */
function compoundStateLines(statesObj: Record<string, StateNodeConfig>, initial: string | undefined, indent: string): string[] {
  const lines: string[] = [];

  if (initial) {
    lines.push(`${indent}[*] --> ${initial}`);
  }

  for (const [stateName, stateConfig] of Object.entries(statesObj)) {
    if (stateConfig.states && Object.keys(stateConfig.states).length > 0) {
      // Nested compound state — recurse
      lines.push(`${indent}state ${stateName} {`);
      lines.push(...compoundStateLines(stateConfig.states, stateConfig.initial, indent + "  "));
      lines.push(`${indent}}`);
    }

    // Transitions from this state
    for (const [eventName, raw] of Object.entries(stateConfig.on ?? {})) {
      const transitions = Array.isArray(raw) ? raw : [raw];
      for (const t of transitions) {
        const target = typeof t === "string" ? t : t.target;
        // No target → self-transition
        const to = target ?? stateName;
        lines.push(`${indent}${stateName} --> ${to} : ${eventName}`);
      }
    }
  }

  return lines;
}

/**
 * Generate the full diagram for a parallel parent machine.
 * Regions are separated with `--` inside a named state block.
 */
function parallelMachineDiagram(config: MachineConfig): string {
  const lines = ["stateDiagram-v2"];
  lines.push(`  state ${config.id} {`);

  const regions = Object.entries(config.states ?? {});
  regions.forEach(([regionName, regionConfig], i) => {
    lines.push(`    state ${regionName} {`);
    lines.push(...compoundStateLines(regionConfig.states ?? {}, regionConfig.initial, "      "));
    lines.push(`    }`);
    if (i < regions.length - 1) {
      lines.push("    --");
    }
  });

  lines.push("  }");
  return lines.join("\n");
}

/**
 * Generate a simple compound-state diagram for a single region.
 */
function subMachineDiagram(regionConfig: StateNodeConfig): string {
  const lines = ["stateDiagram-v2"];
  lines.push(...compoundStateLines(regionConfig.states ?? {}, regionConfig.initial, "  "));
  return lines.join("\n");
}

// ─── Render pipeline ───────────────────────────────────────────────────────

function writeDiagram(name: string, mmd: string): void {
  const mmdPath = join(outputDir, `${name}.mmd`);
  const pngPath = join(outputDir, `${name}.png`);

  writeFileSync(mmdPath, mmd, "utf-8");
  console.log(`  wrote  ${mmdPath}`);

  execSync(`"${mmdc}" -i "${mmdPath}" -o "${pngPath}" -b white -p "${puppeteerConfig}"`, {
    env: { ...process.env, PUPPETEER_SKIP_DOWNLOAD: "true" },
    stdio: "inherit",
  });
  console.log(`  rendered ${pngPath}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main(): void {
  const config = blogFilterMachine.config as MachineConfig;

  console.log(`\nGenerating state diagrams for: ${config.id}\n`);

  // 1. Full parallel parent machine
  writeDiagram(config.id, parallelMachineDiagram(config));

  // 2. One diagram per parallel region (sub-machine)
  for (const [regionName, regionConfig] of Object.entries(config.states ?? {})) {
    writeDiagram(regionName, subMachineDiagram(regionConfig));
  }

  console.log("\nDone.\n");
}

main();
