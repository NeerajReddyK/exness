import type { assetType } from "../store/assetStore";
import useAssetStore from "../store/assetStore";

export const AssetPrice = ({ asset }: { asset: assetType }) => {
  const assetPrice = useAssetStore((state) => state[asset]);
  return (
    <button className="bg-gray-300 rounded-sm text-black py-2 px-4 mt-2">
      {assetPrice}
    </button>
  );
};
