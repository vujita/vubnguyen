/**
 * generate-state-diagrams.ts
 *
 * Traverses the blogFilterMachine config, emits Mermaid stateDiagram-v2 text
 * for each logical machine, then writes docs/state-machines/README.md with
 * fenced ```mermaid blocks that GitHub renders natively — no browser required.
 *
 * Usage: pnpm tsx scripts/generate-state-diagrams.ts
 */

import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { blogFilterMachine } from "../apps/vubnguyen/src/machines/blogFilterMachine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const outputDir = join(rootDir, "docs/state-machines");

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

function compoundStateLines(statesObj: Record<string, StateNodeConfig>, initial: string | undefined, indent: string): string[] {
  const lines: string[] = [];

  if (initial) {
    lines.push(`${indent}[*] --> ${initial}`);
  }

  for (const [stateName, stateConfig] of Object.entries(statesObj)) {
    if (stateConfig.states && Object.keys(stateConfig.states).length > 0) {
      lines.push(`${indent}state ${stateName} {`);
      lines.push(...compoundStateLines(stateConfig.states, stateConfig.initial, indent + "  "));
      lines.push(`${indent}}`);
    }

    for (const [eventName, raw] of Object.entries(stateConfig.on ?? {})) {
      const transitions = Array.isArray(raw) ? raw : [raw];
      for (const t of transitions) {
        const target = typeof t === "string" ? t : t.target;
        const to = target ?? stateName;
        lines.push(`${indent}${stateName} --> ${to} : ${eventName}`);
      }
    }
  }

  return lines;
}

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

function subMachineDiagram(regionConfig: StateNodeConfig): string {
  const lines = ["stateDiagram-v2"];
  lines.push(...compoundStateLines(regionConfig.states ?? {}, regionConfig.initial, "  "));
  return lines.join("\n");
}

// ─── Output ────────────────────────────────────────────────────────────────

function main(): void {
  const config = blogFilterMachine.config as MachineConfig;

  console.log(`\nGenerating state diagrams for: ${config.id}\n`);

  const diagrams: Array<{ name: string; mmd: string }> = [{ mmd: parallelMachineDiagram(config), name: config.id }];

  for (const [regionName, regionConfig] of Object.entries(config.states ?? {})) {
    diagrams.push({ mmd: subMachineDiagram(regionConfig), name: regionName });
  }

  // Write individual .mmd files
  for (const { name, mmd } of diagrams) {
    const mmdPath = join(outputDir, `${name}.mmd`);
    writeFileSync(mmdPath, mmd + "\n", "utf-8");
    console.log(`  wrote  ${name}.mmd`);
  }

  // Write README.md with fenced mermaid blocks — rendered natively by GitHub
  const readmeSections = diagrams.map(({ name, mmd }) => `## ${name}\n\n\`\`\`mermaid\n${mmd}\n\`\`\``);

  const readme = ["# State Machine Diagrams", "", "Auto-generated from XState machine configurations via `pnpm tsx scripts/generate-state-diagrams.ts`.", "GitHub renders these diagrams natively — no build step needed.", "", `<!-- generated: ${new Date().toISOString()} -->`, "", ...readmeSections.flatMap((s) => [s, ""])].join("\n");

  const readmePath = join(outputDir, "README.md");
  writeFileSync(readmePath, readme, "utf-8");
  console.log(`  wrote  README.md`);

  console.log("\nDone.\n");
}

main();
