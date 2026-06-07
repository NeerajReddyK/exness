export const ChartPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-10">navbar</div>
      <div className="flex-1 border-y-2 border-borderColor flex flex-row overflow-hidden">
        <div className="w-64">left pane</div>
        <div className="flex-1 flex flex-col border-x-2 border-borderColor">
          <div className="flex-1">top in middle</div>
          <div className="h-48 border-t-2 border-borderColor">
            bottom in middle
          </div>
        </div>
        <div className="w-56">right pane</div>
      </div>
      <div className="h-8">footer</div>
    </div>
  );
};
