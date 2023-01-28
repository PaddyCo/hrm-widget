import "./HeartRateMonitor.css";

import HeartBeat from "./HeartBeat";
import { HeartRateState } from "../hooks/heartRateData";

interface HeartRateMonitorProps {
  heartRate: HeartRateState;
}

const HeartRateMonitor = ({ heartRate }: HeartRateMonitorProps) => {
  return (
    <div className="heart-rate-monitor">
      <HeartBeat heartRate={heartRate.current} />
      <div className="heart-rate-monitor__current">
        {Math.round(heartRate.current)}
      </div>
      <div className="heart-rate-monitor__average">
        Average: {Math.round(heartRate.average)}
      </div>
      <div className="heart-rate-monitor__peak">
        Peak: {Math.round(heartRate.peak)}
      </div>
    </div>
  );
};

export default HeartRateMonitor;
