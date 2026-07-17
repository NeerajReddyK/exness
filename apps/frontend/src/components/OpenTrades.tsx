import { useState } from "react"

export const OpenTrades = () => {
    const [selected, setSelected] = useState<"open" | "closed">("open");
    return(
        <div className="mt-1 ml-1 flex gap-3 text-gray-400">
            <div onClick={() => setSelected("open")}>Open</div>
            <div onClick={() => setSelected("closed")}>Closed</div>
        </div>
    )
}