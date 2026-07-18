import { useState } from "react";
import { ShowOpenTrades } from "./ShowOpenTrades";

export const OpenTrades = () => {
  const [selected, setSelected] = useState<"open" | "closed">("open");
  return (
    <div>
      <div className="mt-1 ml-1 flex gap-3 text-gray-400">
        <button
          onClick={() => setSelected("open")}
          className={`cursor-pointer ${selected === "open" && `text-red-500`}`}
        >
          Open
        </button>
        <button
          onClick={() => setSelected("closed")}
          className="cursor-pointer"
        >
          Closed
        </button>
      </div>
      <div>{selected === "open" && <ShowOpenTrades />}</div>
    </div>
  );
};
