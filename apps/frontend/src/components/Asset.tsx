export const Asset = ({
  symbol,
  bid,
  ask,
}: {
  symbol: string;
  bid: number;
  ask: number;
}) => {
  return (
    <div className="flex">
      <div className="flex-2">{symbol}</div>
      <div className="flex-1">{bid}</div>
      <div className="flex-1">{ask}</div>
    </div>
  );
};
