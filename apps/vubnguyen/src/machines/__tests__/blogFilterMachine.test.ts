import { createActor } from "xstate";

import { blogFilterMachine } from "src/machines/blogFilterMachine";

function startActor() {
  return createActor(blogFilterMachine).start();
}

describe("blogFilterMachine", () => {
  describe("initial state", () => {
    it("starts in idle search + empty tagFilter", () => {
      const actor = startActor();
      expect(actor.getSnapshot().value).toEqual({ search: "idle", tagFilter: "empty" });
      actor.stop();
    });

    it("has empty context by default", () => {
      const actor = startActor();
      expect(actor.getSnapshot().context).toEqual({ query: "", selectedTags: [] });
      actor.stop();
    });
  });

  describe("search region", () => {
    it("transitions to active when SET_QUERY receives a non-empty string", () => {
      const actor = startActor();
      actor.send({ query: "ai", type: "SET_QUERY" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ search: "active" });
      expect(snapshot.context.query).toBe("ai");
      actor.stop();
    });

    it("stays idle when SET_QUERY receives an empty string", () => {
      const actor = startActor();
      actor.send({ query: "   ", type: "SET_QUERY" });
      expect(actor.getSnapshot().value).toMatchObject({ search: "idle" });
      actor.stop();
    });

    it("transitions back to idle when SET_QUERY is cleared", () => {
      const actor = startActor();
      actor.send({ query: "ai", type: "SET_QUERY" });
      actor.send({ query: "", type: "SET_QUERY" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ search: "idle" });
      expect(snapshot.context.query).toBe("");
      actor.stop();
    });

    it("updates query while remaining active", () => {
      const actor = startActor();
      actor.send({ query: "ai", type: "SET_QUERY" });
      actor.send({ query: "engineering", type: "SET_QUERY" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ search: "active" });
      expect(snapshot.context.query).toBe("engineering");
      actor.stop();
    });
  });

  describe("tagFilter region", () => {
    it("transitions to filtering when the first tag is toggled", () => {
      const actor = startActor();
      actor.send({ tag: "ai", type: "TOGGLE_TAG" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ tagFilter: "filtering" });
      expect(snapshot.context.selectedTags).toEqual(["ai"]);
      actor.stop();
    });

    it("adds a second tag", () => {
      const actor = startActor();
      actor.send({ tag: "ai", type: "TOGGLE_TAG" });
      actor.send({ tag: "engineering", type: "TOGGLE_TAG" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ tagFilter: "filtering" });
      expect(snapshot.context.selectedTags).toEqual(["ai", "engineering"]);
      actor.stop();
    });

    it("removes one tag when multiple are selected", () => {
      const actor = startActor();
      actor.send({ tag: "ai", type: "TOGGLE_TAG" });
      actor.send({ tag: "engineering", type: "TOGGLE_TAG" });
      actor.send({ tag: "ai", type: "TOGGLE_TAG" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ tagFilter: "filtering" });
      expect(snapshot.context.selectedTags).toEqual(["engineering"]);
      actor.stop();
    });

    it("returns to empty when the last tag is removed", () => {
      const actor = startActor();
      actor.send({ tag: "ai", type: "TOGGLE_TAG" });
      actor.send({ tag: "ai", type: "TOGGLE_TAG" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toMatchObject({ tagFilter: "empty" });
      expect(snapshot.context.selectedTags).toEqual([]);
      actor.stop();
    });
  });

  describe("CLEAR_ALL", () => {
    it("resets both search and tagFilter regions simultaneously", () => {
      const actor = startActor();
      actor.send({ query: "ai", type: "SET_QUERY" });
      actor.send({ tag: "engineering", type: "TOGGLE_TAG" });
      actor.send({ type: "CLEAR_ALL" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toEqual({ search: "idle", tagFilter: "empty" });
      expect(snapshot.context).toEqual({ query: "", selectedTags: [] });
      actor.stop();
    });

    it("is a no-op when already in the initial state", () => {
      const actor = startActor();
      actor.send({ type: "CLEAR_ALL" });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toEqual({ search: "idle", tagFilter: "empty" });
      expect(snapshot.context).toEqual({ query: "", selectedTags: [] });
      actor.stop();
    });
  });
});
