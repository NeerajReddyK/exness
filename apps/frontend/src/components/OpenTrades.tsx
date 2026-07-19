import { useState } from "react";
import { ShowOpenTrades } from "./ShowOpenTrades";
import { ShowClosedTrades } from "./ShowClosedTrades";

export const OpenTrades = () => {
  const [selected, setSelected] = useState<"open" | "closed">("open");
  return (
    <div>
      <div className="mt-1 ml-1 flex gap-3 text-gray-400">
        <button
          onClick={() => setSelected("open")}
          className={
            selected === "open"
              ? "cursor-pointer border-solid border-b-3"
              : "cursor-pointer"
          }
        >
          Open
        </button>
        <button
          onClick={() => setSelected("closed")}
          className={
            selected === "closed"
              ? "cursor-pointer border-solid border-b-3"
              : "cursor-pointer"
          }
        >
          Closed
        </button>
      </div>
      <div>
        {selected === "open" && <ShowOpenTrades />}
        {selected === "closed" && <ShowClosedTrades />}
      </div>
    </div>
  );
};
