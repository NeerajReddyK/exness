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
          className={`cursor-pointer ${selected === "open" && ` border-b-3`}`}
        >
          Open
        </button>
        <button
          onClick={() => setSelected("closed")}
          className={`cursor-pointer ${selected === "closed" && ` border-b-3`}`}
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
