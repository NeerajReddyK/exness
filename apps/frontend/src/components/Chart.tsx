import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  createChart,
  type UTCTimestamp,
} from "lightweight-charts";
import axios from "axios";
import useAssetStore from "../store/assetStore";

const beUrl = import.meta.env.VITE_BE_URL;
interface KlineDataType {
  time: string;
  open: string;
  high: string;
  close: string;
  low: string;
}
export const Chart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<KlineDataType[]>([]);
  const selectedAsset = useAssetStore((state) => state.selectedAsset);
  const [startTime, setStartTime] = useState(
    Math.floor(Date.now() / 1000) - 18000,
  );
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const klineData = await axios.get(`${beUrl}/klines/api/v1/klines?`, {
        params: {
          symbol: `${selectedAsset}`,
          interval: "5m",
          startTime: startTime,
        },
      });
      // klineData.data.data is the array that consists of required klinedata
      const res = klineData.data.data;
      const formattedData = res.map((kline: any) => ({
        time: Math.floor(
          new Date(kline.start.replace(" ", "T") + "Z").getTime() / 1000,
        ) as UTCTimestamp,
        open: Number(kline.open),
        high: Number(kline.high),
        close: Number(kline.close),
        low: Number(kline.low),
      }));
      setData(formattedData);
    };
    fetchData();
  }, [selectedAsset]);

  // useEffect(() => {
  //   console.log("data: ", data);
  // }, [data]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) {
      console.log("useRef not populated yet");
      return;
    }

    const chart = createChart(element, {
      layout: { background: { color: "black" }, textColor: "grey" },
      grid: {
        vertLines: { color: "#141d22" },
        horzLines: { color: "#141d22" },
      },
    });

    const candleStick = chart.addSeries(CandlestickSeries);

    if (data.length > 0) {
      candleStick.setData(data);
    }

    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (!range) return;
      const info = candleStick.barsInLogicalRange(range);

      console.log("info: ", info);
      if (info && info.barsBefore < 20) {
        // fetch older records.
        // update new records at start or end. figure out
      }
    });

    chart.timeScale().fitContent();
  }, [data]);

  return (
    <div className="rounded-lg overflow-hidden w-full h-full">
      <div ref={chartRef} className="w-full h-full"></div>
    </div>
  );
};
