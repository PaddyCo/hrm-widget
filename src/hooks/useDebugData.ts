import { useEffect, useState } from "react";
import { HeartRateData, HeartRateHistory } from "./heartRateData";

interface DebugData {
  setDebugHeartRate: (heartRate: number) => void;
  debugHeartRate: number;
}

export default function useDebugData(): HeartRateData & DebugData {
  const [debugHeartRate, setDebugHeartRate] = useState<number>(60);
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateHistory>(
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRateHistory((oldHistory) => [
        ...oldHistory,
        { timestamp: Date.now(), heartRate: debugHeartRate },
      ]);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [debugHeartRate]);

  const heartRates = heartRateHistory.map((h) => h.heartRate);

  return {
    heartRate: {
      current: heartRates[heartRateHistory.length - 1],
      average:
        heartRates.length > 0
          ? [...heartRates].reduce((a, b) => a + b) / heartRateHistory.length
          : 0,
      peak:
        heartRates.length > 0
          ? [...heartRates].sort((a, b) => a - b).pop() ?? 0
          : 0,
    },
    history: heartRateHistory,
    setDebugHeartRate: (heartRate) => {
      setDebugHeartRate(heartRate);
    },
    debugHeartRate,
  };
}
