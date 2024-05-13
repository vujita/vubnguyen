import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

export interface MemoryState {
  /** The maximum size of the heap, in bytes, that is available to the context. */
  jsHeapSizeLimit: number;
  /** The total allocated heap size, in bytes. */
  totalJSHeapSize: number;
  /** The currently active segment of JS heap, in bytes. */
  usedJSHeapSize: number;
}
declare global {
  interface Performance {
    memory?: MemoryState;
  }
}

export type MemorySnapshot = MemoryState & {
  timestamp: number;
};
export const memoryStore = createStore<{
  memory: MemorySnapshot[];
}>((setState, getState) => {
  const MEMORY_SIZE = 100;
  const INTTERVAL_IN_MS = 200;
  setInterval(() => {
    const currentMemory = getState();
    const memory = window.performance.memory;
    if (!memory) {
      return;
    }
    console.log({
      currentMemory,
      memory,
    });
    const newMemory: MemorySnapshot[] = [
      ...currentMemory.memory,
      {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: performance.now(),
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize,
      },
    ];
    if (newMemory.length > MEMORY_SIZE) {
      newMemory.shift();
    }
    setState({
      memory: newMemory,
    });
  }, INTTERVAL_IN_MS);
  return {
    memory: [],
  };
});

export const useMemoryStates = useStore(memoryStore, (s) => s.memory);
