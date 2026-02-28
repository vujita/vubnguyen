# State Machine Diagrams

> Auto-generated — do not edit directly.
> To regenerate: `pnpm tsx scripts/generate-state-diagrams.ts`
> To add a machine: export it from `apps/vubnguyen/src/machines/index.ts`.
>
> _Last generated: 2026-02-28T01:52:25.661Z_

## Contents

- [blogFilter](#blogfilter)

---

## blogFilter

**Source:** `apps/vubnguyen/src/machines/blogFilterMachine.ts`  
**Type:** parallel — regions: `search`, `tagFilter`

### Full machine

```mermaid
stateDiagram-v2
  state blogFilter {
    state search {
      [*] --> idle
      active --> idle : CLEAR_ALL
      active --> idle : SET_QUERY
      active --> active : SET_QUERY
      idle --> active : SET_QUERY
    }
    --
    state tagFilter {
      [*] --> empty
      empty --> filtering : TOGGLE_TAG
      filtering --> empty : CLEAR_ALL
      filtering --> empty : TOGGLE_TAG
      filtering --> filtering : TOGGLE_TAG
    }
  }
```

### `search` region

```mermaid
stateDiagram-v2
  [*] --> idle
  active --> idle : CLEAR_ALL
  active --> idle : SET_QUERY
  active --> active : SET_QUERY
  idle --> active : SET_QUERY
```

### `tagFilter` region

```mermaid
stateDiagram-v2
  [*] --> empty
  empty --> filtering : TOGGLE_TAG
  filtering --> empty : CLEAR_ALL
  filtering --> empty : TOGGLE_TAG
  filtering --> filtering : TOGGLE_TAG
```
