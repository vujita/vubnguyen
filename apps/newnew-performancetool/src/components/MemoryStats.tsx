/* eslint-disable react/forbid-dom-props */
import { type FC } from "react";
import { useMemoryStates, type MemorySnapshot } from "newnew-performancetool/src/stores/memory";

const memoryStat = (memoryState: MemorySnapshot): number => ((memoryState.usedJSHeapSize / memoryState.jsHeapSizeLimit) * 100).toFixed(2);

const MEM_STAT_WIDTH = 200;
export const MemoryStats: FC = () => {
  const memoryStates = useMemoryStates();
  const last = memoryStates.at(-1);
  return (
    <div
      style={{
        bottom: 0,
        boxSizing: "border-box",
        left: 0,
        padding: 5,
        position: "fixed",
      }}
    >
      {last ? (
        <div
          style={{
            margin: "auto",
            width: "fit-content",
          }}
        >{`${memoryStat(last)}%`}</div>
      ) : null}
      <div
        style={{
          alignItems: "flex-end",
          backgroundColor: "lightgrey",
          display: "flex",
          flexDirection: "row",
          height: 100,
          opacity: 0.8,
          width: MEM_STAT_WIDTH,
        }}
      >
        {memoryStates.map((memoryState) => (
          <div
            key={memoryState.timestamp}
            style={{
              backgroundColor: "lightgreen",
              height: memoryStat(memoryState) + "%",
              width: MEM_STAT_WIDTH / memoryStates.length,
            }}
          />
        ))}
      </div>
    </div>
  );
};
