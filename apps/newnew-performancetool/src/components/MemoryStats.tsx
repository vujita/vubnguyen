import { type FC } from "react";

import { MemorySnapshot, useMemoryStates } from "../stores/memory";

const memoryStat = (memoryState: MemorySnapshot): number => ((memoryState.usedJSHeapSize / memoryState.jsHeapSizeLimit) * 100).toFixed(2);

const MEM_STAT_WIDTH = 200;
export const MemoryStats: FC = () => {
  const memoryStates = useMemoryStates();
  const last = memoryStates.at(-1);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        padding: 5,
        boxSizing: "border-box",
      }}
    >
      {last && (
        <div
          style={{
            margin: "auto",
            width: "fit-content",
          }}
        >{`${memoryStat(last)}%`}</div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "lightgrey",
          opacity: 0.8,
          alignItems: "flex-end",
          height: 100,
          width: MEM_STAT_WIDTH,
        }}
      >
        {memoryStates.map((memoryState) => (
          <div
            style={{
              backgroundColor: "lightgreen",
              width: MEM_STAT_WIDTH / memoryStates.length,
              height: memoryStat(memoryState) + "%",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
