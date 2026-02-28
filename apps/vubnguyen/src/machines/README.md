# State Machine Diagrams

> Auto-generated — do not edit directly.
> To regenerate: `pnpm tsx scripts/generate-state-diagrams.ts`
> To add a machine: export it from `apps/vubnguyen/src/machines/index.ts`.
>
> _Last generated: 2026-02-28T07:09:08.038Z_

## Contents

- [blogFilter](#blogfilter)
- [snake](#snake)

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

## snake

**Source:** `apps/vubnguyen/src/machines/snakeMachine.ts`  
**Type:** compound — states: `dead`, `idle`, `paused`, `playing`

```mermaid
stateDiagram-v2
  [*] --> idle
  dead --> idle : RESET
  idle --> playing : START
  paused --> idle : RESET
  paused --> playing : RESUME
  playing --> paused : PAUSE
  playing --> idle : RESET
  playing --> playing : STEER
  playing --> dead : TICK
  playing --> playing : TICK
```
