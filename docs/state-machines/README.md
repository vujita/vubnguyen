# State Machine Diagrams

Auto-generated from XState machine configurations via `pnpm tsx scripts/generate-state-diagrams.ts`.
GitHub renders these diagrams natively — no build step needed.

<!-- generated: 2026-02-27T02:42:01.114Z -->

## blogFilter

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

## search

```mermaid
stateDiagram-v2
  [*] --> idle
  active --> idle : CLEAR_ALL
  active --> idle : SET_QUERY
  active --> active : SET_QUERY
  idle --> active : SET_QUERY
```

## tagFilter

```mermaid
stateDiagram-v2
  [*] --> empty
  empty --> filtering : TOGGLE_TAG
  filtering --> empty : CLEAR_ALL
  filtering --> empty : TOGGLE_TAG
  filtering --> filtering : TOGGLE_TAG
```
