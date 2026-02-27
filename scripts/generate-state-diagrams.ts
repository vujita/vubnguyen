/**
 * generate-state-diagrams.ts
 *
 * Completely browser-free PNG generation:
 *   1. XState machine config → Graphviz DOT language
 *   2. @viz-js/viz  (Graphviz compiled to WebAssembly) renders DOT → SVG
 *   3. @resvg/resvg-js (Rust SVG renderer, pre-built binary) converts SVG → PNG
 *
 * Also writes .mmd files + docs/state-machines/README.md for GitHub's
 * native mermaid renderer (no extra tooling needed in CI).
 *
 * Usage: pnpm tsx scripts/generate-state-diagrams.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

// ─── DOT language generation ───────────────────────────────────────────────

const DOT_GRAPH_ATTRS = ["rankdir=LR", 'bgcolor="white"', 'node [fontname="monospace" fontsize=13 margin="0.2,0.12" shape=box style="rounded,filled" fillcolor="#ECECFF" color="#9370DB"]', 'edge [fontname="monospace" fontsize=10 color="#555555"]'].join("\n  ");

function compoundToDotLines(states: Record<string, StateNodeConfig>, initial: string | undefined, prefix: string, indent: string): string[] {
  const lines: string[] = [];
  const q = (s: string) => `"${prefix}${s}"`;

  if (initial) {
    lines.push(`${indent}"${prefix}__start" [shape=point width=0.2 fillcolor=black color=black style=filled label=""];`);
    lines.push(`${indent}"${prefix}__start" -> ${q(initial)};`);
  }

  for (const [stateName, stateConfig] of Object.entries(states)) {
    lines.push(`${indent}${q(stateName)} [label="${stateName}"];`);
    for (const [event, raw] of Object.entries(stateConfig.on ?? {})) {
      const arr = Array.isArray(raw) ? raw : [raw];
      for (const t of arr) {
        const target = typeof t === "string" ? t : (t as { target?: string }).target ?? stateName;
        lines.push(`${indent}${q(stateName)} -> ${q(target)} [label="${event}"];`);
      }
    }
  }

  return lines;
}

function parallelMachineToDot(config: MachineConfig): string {
  const lines = [`digraph "${config.id}" {`, `  ${DOT_GRAPH_ATTRS}`];
  for (const [regionName, regionConfig] of Object.entries(config.states ?? {})) {
    lines.push(`  subgraph "cluster_${regionName}" {`);
    lines.push(`    label="${regionName}" fontname="monospace" fontsize=14 style=rounded color="#aaaaaa"`);
    lines.push(...compoundToDotLines(regionConfig.states ?? {}, regionConfig.initial, `${regionName}_`, "    "));
    lines.push("  }");
  }
  lines.push("}");
  return lines.join("\n");
}

function subMachineToDot(name: string, regionConfig: StateNodeConfig): string {
  const lines = [`digraph "${name}" {`, `  ${DOT_GRAPH_ATTRS}`];
  lines.push(...compoundToDotLines(regionConfig.states ?? {}, regionConfig.initial, "", "  "));
  lines.push("}");
  return lines.join("\n");
}

// ─── Mermaid text (for GitHub README native rendering) ────────────────────

function compoundMmdLines(states: Record<string, StateNodeConfig>, initial: string | undefined, indent: string): string[] {
  const lines: string[] = [];
  if (initial) lines.push(`${indent}[*] --> ${initial}`);
  for (const [stateName, stateConfig] of Object.entries(states)) {
    if (stateConfig.states && Object.keys(stateConfig.states).length > 0) {
      lines.push(`${indent}state ${stateName} {`);
      lines.push(...compoundMmdLines(stateConfig.states, stateConfig.initial, indent + "  "));
      lines.push(`${indent}}`);
    }
    for (const [event, raw] of Object.entries(stateConfig.on ?? {})) {
      const arr = Array.isArray(raw) ? raw : [raw];
      for (const t of arr) {
        const target = typeof t === "string" ? t : (t as { target?: string }).target ?? stateName;
        lines.push(`${indent}${stateName} --> ${target} : ${event}`);
      }
    }
  }
  return lines;
}

function parallelMachineMmd(config: MachineConfig): string {
  const lines = ["stateDiagram-v2", `  state ${config.id} {`];
  const regions = Object.entries(config.states ?? {});
  regions.forEach(([regionName, regionConfig], i) => {
    lines.push(`    state ${regionName} {`);
    lines.push(...compoundMmdLines(regionConfig.states ?? {}, regionConfig.initial, "      "));
    lines.push("    }");
    if (i < regions.length - 1) lines.push("    --");
  });
  lines.push("  }");
  return lines.join("\n");
}

function subMachineMmd(regionConfig: StateNodeConfig): string {
  const lines = ["stateDiagram-v2"];
  lines.push(...compoundMmdLines(regionConfig.states ?? {}, regionConfig.initial, "  "));
  return lines.join("\n");
}

// ─── Render pipeline ───────────────────────────────────────────────────────

async function dotToPng(dot: string): Promise<Buffer> {
  const { instance } = await import("@viz-js/viz");
  const { Resvg } = await import("@resvg/resvg-js");

  const viz = await instance();
  const svg = viz.renderString(dot, { format: "svg" });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 900 },
    font: { loadSystemFonts: true },
  });
  return Buffer.from(resvg.render().asPng());
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const config = blogFilterMachine.config as MachineConfig;
  console.log(`\nGenerating state diagrams for: ${config.id}\n`);

  const diagrams: Array<{ name: string; dot: string; mmd: string }> = [{ name: config.id, dot: parallelMachineToDot(config), mmd: parallelMachineMmd(config) }];

  for (const [regionName, regionConfig] of Object.entries(config.states ?? {})) {
    diagrams.push({ name: regionName, dot: subMachineToDot(regionName, regionConfig), mmd: subMachineMmd(regionConfig) });
  }

  for (const { name, dot, mmd } of diagrams) {
    writeFileSync(join(outputDir, `${name}.mmd`), mmd + "\n", "utf-8");
    console.log(`  wrote  ${name}.mmd`);

    const png = await dotToPng(dot);
    writeFileSync(join(outputDir, `${name}.png`), png);
    console.log(`  rendered ${name}.png`);
  }

  // README.md with mermaid blocks for GitHub native rendering
  const readmeSections = diagrams.map(({ name, mmd }) => `## ${name}\n\n\`\`\`mermaid\n${mmd}\n\`\`\``);
  const readme = ["# State Machine Diagrams", "", "Auto-generated from XState machine configurations via `pnpm tsx scripts/generate-state-diagrams.ts`.", "GitHub renders these diagrams natively — no build step needed.", "", `<!-- generated: ${new Date().toISOString()} -->`, "", ...readmeSections.flatMap((s) => [s, ""])].join("\n");

  writeFileSync(join(outputDir, "README.md"), readme, "utf-8");
  console.log(`  wrote  README.md`);

  console.log("\nDone.\n");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
