import { assign, setup } from "xstate";

export interface BlogFilterContext {
  query: string;
  selectedTags: string[];
}

export type BlogFilterEvent =
  | { query: string; type: "SET_QUERY" }
  | { tag: string; type: "TOGGLE_TAG" }
  | { type: "CLEAR_ALL" };

/**
 * Parent parallel machine for the blog filter feature.
 *
 * Parallel regions:
 *  - search: manages the text search query (idle | active)
 *  - tagFilter: manages the selected tag set (empty | filtering)
 *
 * CLEAR_ALL is handled by both regions simultaneously, resetting all state.
 */
export const blogFilterMachine = setup({
  types: {
    context: {} as BlogFilterContext,
    events: {} as BlogFilterEvent,
  },
}).createMachine({
  context: {
    query: "",
    selectedTags: [],
  },
  id: "blogFilter",
  states: {
    search: {
      initial: "idle",
      states: {
        active: {
          on: {
            CLEAR_ALL: {
              actions: assign({ query: "" }),
              target: "idle",
            },
            SET_QUERY: [
              {
                actions: assign({ query: "" }),
                guard: ({ event }) => event.query.trim() === "",
                target: "idle",
              },
              {
                actions: assign({ query: ({ event }) => event.query }),
              },
            ],
          },
        },
        idle: {
          on: {
            SET_QUERY: {
              actions: assign({ query: ({ event }) => event.query }),
              guard: ({ event }) => event.query.trim() !== "",
              target: "active",
            },
          },
        },
      },
    },
    tagFilter: {
      initial: "empty",
      states: {
        empty: {
          on: {
            TOGGLE_TAG: {
              actions: assign({ selectedTags: ({ event }) => [event.tag] }),
              target: "filtering",
            },
          },
        },
        filtering: {
          on: {
            CLEAR_ALL: {
              actions: assign({ query: "", selectedTags: [] }),
              target: "empty",
            },
            TOGGLE_TAG: [
              {
                // Last remaining tag is being removed — go back to empty
                actions: assign({ selectedTags: [] }),
                guard: ({ context, event }) =>
                  context.selectedTags.includes(event.tag) && context.selectedTags.length === 1,
                target: "empty",
              },
              {
                // Toggle tag in or out of the selection
                actions: assign({
                  selectedTags: ({ context, event }) =>
                    context.selectedTags.includes(event.tag)
                      ? context.selectedTags.filter((t) => t !== event.tag)
                      : [...context.selectedTags, event.tag],
                }),
              },
            ],
          },
        },
      },
    },
  },
  type: "parallel",
});
