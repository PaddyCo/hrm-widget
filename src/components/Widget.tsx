import { BpmRange } from "../App";
import { HeartRateHistory, HeartRateState } from "../hooks/heartRateData";
import HeartRateHistoryChart from "./HeartRateHistoryChart";
import HeartRateMonitor from "./HeartRateMonitor";
import "./Widget.css";

interface WidgetProps {
  heartRate: HeartRateState;
  history: HeartRateHistory;
  bpmRange: BpmRange;
}

const Widget = ({ heartRate, history, bpmRange }: WidgetProps) => {
  return (
    <div className="widget__container">
      {heartRate && heartRate.current > 0 ? (
        <HeartRateMonitor heartRate={heartRate} />
      ) : null}
      {history && history.length > 0 ? (
        <HeartRateHistoryChart
          history={history}
          getHistory={() => {
            return [...history];
          }}
          min={bpmRange[0]}
          max={bpmRange[1]}
        />
      ) : null}
    </div>
  );
};

export default Widget;
