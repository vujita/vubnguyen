import { assign, setup } from "xstate";

export interface BlogFilterContext {
  query: string;
  selectedTags: string[];
}

export type BlogFilterEvent = { type: "SET_QUERY"; query: string } | { type: "TOGGLE_TAG"; tag: string } | { type: "CLEAR_ALL" };

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
  id: "blogFilter",
  type: "parallel",
  context: {
    query: "",
    selectedTags: [],
  },
  states: {
    search: {
      initial: "idle",
      states: {
        idle: {
          on: {
            SET_QUERY: {
              guard: ({ event }) => event.query.trim() !== "",
              target: "active",
              actions: assign({ query: ({ event }) => event.query }),
            },
          },
        },
        active: {
          on: {
            SET_QUERY: [
              {
                guard: ({ event }) => event.query.trim() === "",
                target: "idle",
                actions: assign({ query: "" }),
              },
              {
                actions: assign({ query: ({ event }) => event.query }),
              },
            ],
            CLEAR_ALL: {
              target: "idle",
              actions: assign({ query: "" }),
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
              target: "filtering",
              actions: assign({ selectedTags: ({ event }) => [event.tag] }),
            },
          },
        },
        filtering: {
          on: {
            TOGGLE_TAG: [
              {
                // Last remaining tag is being removed — go back to empty
                guard: ({ context, event }) => context.selectedTags.includes(event.tag) && context.selectedTags.length === 1,
                target: "empty",
                actions: assign({ selectedTags: [] }),
              },
              {
                // Toggle tag in or out of the selection
                actions: assign({
                  selectedTags: ({ context, event }) => (context.selectedTags.includes(event.tag) ? context.selectedTags.filter((t) => t !== event.tag) : [...context.selectedTags, event.tag]),
                }),
              },
            ],
            CLEAR_ALL: {
              target: "empty",
              actions: assign({ query: "", selectedTags: [] }),
            },
          },
        },
      },
    },
  },
});
