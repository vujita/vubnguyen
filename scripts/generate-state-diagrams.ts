/**
 * generate-state-diagrams.ts
 *
 * Completely browser-free PNG generation:
 *   1. Imports all machines from apps/vubnguyen/src/machines/index.ts
 *   2. XState machine config → Graphviz DOT language
 *   3. @viz-js/viz  (Graphviz compiled to WebAssembly) renders DOT → SVG
 *   4. @resvg/resvg-js (Rust SVG renderer, pre-built binary) converts SVG → PNG
 *
 * Also writes .mmd files + docs/state-machines/README.md with per-machine
 * documentation and mermaid blocks that GitHub renders natively.
 *
 * To add a new machine: export it from apps/vubnguyen/src/machines/index.ts.
 *
 * Usage: pnpm tsx scripts/generate-state-diagrams.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  initial?: string;
  type?: string;
  context?: unknown;
  states?: Record<string, StateNodeConfig>;
};

// ─── Machine discovery ─────────────────────────────────────────────────────

function isMachineConfig(value: unknown): value is { config: MachineConfig } {
  return value !== null && typeof value === "object" && "config" in value && typeof (value as Record<string, unknown>).config === "object" && (value as { config: MachineConfig }).config !== null && "id" in (value as { config: MachineConfig }).config;
}

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

function machineToDot(config: MachineConfig): string {
  const lines = [`digraph "${config.id}" {`, `  ${DOT_GRAPH_ATTRS}`];

  if (config.type === "parallel") {
    for (const [regionName, regionConfig] of Object.entries(config.states ?? {})) {
      lines.push(`  subgraph "cluster_${regionName}" {`);
      lines.push(`    label="${regionName}" fontname="monospace" fontsize=14 style=rounded color="#aaaaaa"`);
      lines.push(...compoundToDotLines(regionConfig.states ?? {}, regionConfig.initial, `${regionName}_`, "    "));
      lines.push("  }");
    }
  } else {
    lines.push(...compoundToDotLines(config.states ?? {}, config.initial, "", "  "));
  }

  lines.push("}");
  return lines.join("\n");
}

function regionToDot(name: string, regionConfig: StateNodeConfig): string {
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

function machineToMmd(config: MachineConfig): string {
  const lines = ["stateDiagram-v2"];

  if (config.type === "parallel") {
    lines.push(`  state ${config.id} {`);
    const regions = Object.entries(config.states ?? {});
    regions.forEach(([regionName, regionConfig], i) => {
      lines.push(`    state ${regionName} {`);
      lines.push(...compoundMmdLines(regionConfig.states ?? {}, regionConfig.initial, "      "));
      lines.push("    }");
      if (i < regions.length - 1) lines.push("    --");
    });
    lines.push("  }");
  } else {
    lines.push(...compoundMmdLines(config.states ?? {}, config.initial, "  "));
  }

  return lines.join("\n");
}

function regionToMmd(regionConfig: StateNodeConfig): string {
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

// ─── README generation ─────────────────────────────────────────────────────

type DiagramEntry = { slug: string; mmd: string };
type MachineEntry = { config: MachineConfig; diagrams: DiagramEntry[] };

function buildReadme(machines: MachineEntry[]): string {
  const toc = machines.map(({ config }) => `- [${config.id}](#${config.id.toLowerCase()})`).join("\n");

  const sections = machines.map(({ config, diagrams }) => {
    const sourceFile = `apps/vubnguyen/src/machines/${config.id}Machine.ts`;
    const isParallel = config.type === "parallel";
    const regionNames = isParallel ? Object.keys(config.states ?? {}) : [];

    const lines: string[] = [
      `## ${config.id}`,
      "",
      `**Source:** \`${sourceFile}\`  `,
      isParallel
        ? `**Type:** parallel — regions: ${regionNames.map((r) => `\`${r}\``).join(", ")}`
        : `**Type:** compound — states: ${Object.keys(config.states ?? {})
            .map((s) => `\`${s}\``)
            .join(", ")}`,
      "",
    ];

    if (isParallel) {
      const [full, ...regions] = diagrams;
      lines.push("### Full machine", "", "```mermaid", full.mmd, "```", "");
      for (const { slug, mmd } of regions) {
        lines.push(`### \`${slug}\` region`, "", "```mermaid", mmd, "```", "");
      }
    } else {
      lines.push("```mermaid", diagrams[0].mmd, "```", "");
    }

    return lines.join("\n");
  });

  return ["# State Machine Diagrams", "", "> Auto-generated — do not edit directly.", "> To regenerate: `pnpm tsx scripts/generate-state-diagrams.ts`", "> To add a machine: export it from `apps/vubnguyen/src/machines/index.ts`.", ">", `> _Last generated: ${new Date().toISOString()}_`, "", "## Contents", "", toc, "", "---", "", ...sections].join("\n");
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Import all registered machines from the barrel file.
  // Adding a new export there is all it takes to include a new machine.
  const barrel = await import("../apps/vubnguyen/src/machines/index");

  const discovered = Object.entries(barrel).filter(([, v]) => isMachineConfig(v)) as Array<[string, { config: MachineConfig }]>;

  console.log(`\nFound ${discovered.length} machine(s): ${discovered.map(([k]) => k).join(", ")}\n`);

  const machineEntries: MachineEntry[] = [];

  for (const [, machine] of discovered) {
    const config = machine.config;
    const isParallel = config.type === "parallel";
    const diagrams: DiagramEntry[] = [];

    console.log(`Processing: ${config.id}${isParallel ? " (parallel)" : ""}`);

    // Full machine diagram
    diagrams.push({ slug: config.id, mmd: machineToMmd(config) });
    const fullPng = await dotToPng(machineToDot(config));
    writeFileSync(join(outputDir, `${config.id}.mmd`), machineToMmd(config) + "\n", "utf-8");
    writeFileSync(join(outputDir, `${config.id}.png`), fullPng);
    console.log(`  rendered ${config.id}.png`);

    // Sub-diagrams for each parallel region
    if (isParallel) {
      for (const [regionName, regionConfig] of Object.entries(config.states ?? {})) {
        const mmd = regionToMmd(regionConfig);
        diagrams.push({ slug: regionName, mmd });
        const png = await dotToPng(regionToDot(regionName, regionConfig));
        writeFileSync(join(outputDir, `${regionName}.mmd`), mmd + "\n", "utf-8");
        writeFileSync(join(outputDir, `${regionName}.png`), png);
        console.log(`  rendered ${regionName}.png`);
      }
    }

    machineEntries.push({ config, diagrams });
    console.log();
  }

  // Write README.md
  writeFileSync(join(outputDir, "README.md"), buildReadme(machineEntries), "utf-8");
  console.log("  wrote  README.md");

  console.log("\nDone.\n");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
