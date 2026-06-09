import { Chart } from "../components/Chart";
import { LeftPane } from "../components/LeftPane";

export const TradePage = () => {
  return (
    <div className="h-screen flex flex-col ">
      <div className="h-16 bg-componentBgColor">navbar</div>

      <div className="flex-1 flex flex-row overflow-hidden gap-1 mt-1">
        <div className="w-64 bg-componentBgColor rounded-r-md">
          <LeftPane />
        </div>

        <div className="flex-1 flex flex-col gap-1 rounded-md ">
          <div className="flex-1 bg-componentBgColor rounded-sm">
            <Chart />
          </div>
          <div className="h-48 bg-componentBgColor rounded-sm">
            bottom in middle
          </div>
        </div>

        <div className="w-56 bg-componentBgColor rounded-l-sm">right pane</div>
      </div>
      <div className="h-8 bg-componentBgColor mt-1">footer</div>
    </div>
  );
};
