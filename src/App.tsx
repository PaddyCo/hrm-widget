import { useEffect, useState } from "react";
import "./App.css";
import Settings, { SettingsData } from "./components/Settings";

import { FiSettings } from "react-icons/fi";
import Cookies from "js-cookie";
import PulsoidConnectionStatus from "./components/PulsoidConnectionStatus";
import HeartRateMonitor from "./components/HeartRateMonitor";
import useDebugData from "./hooks/useDebugData";
import Widget from "./components/Widget";
import usePulsoidData, { PulsoidConnectionState } from "./hooks/usePulsoidData";

export interface SocketSettings {
  token: string;
  ws: WebSocket | undefined;
}

const COOKIE_NAME = "hrm-widget-settings";

export type BpmRange = [number, number];

function App() {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pulsoidToken, setPulsoidToken] = useState<string>();
  const [bpmRange, setBpmRange] = useState<BpmRange>([80, 200]);
  const [debugEnabled, setDebugEnabled] = useState<boolean>(false);
  const {
    heartRate: debugHeartRateState,
    history: debugHistory,
    setDebugHeartRate,
    debugHeartRate,
  } = useDebugData();
  const { heartRate, history, connectionState } = usePulsoidData(
    pulsoidToken ?? ""
  );

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME);
    if (cookie) {
      const data = JSON.parse(cookie) as SettingsData;
      updateSettings(data);
    } else {
      setSettingsOpen(true);
    }
  }, []);

  function updateSettings(data: SettingsData) {
    Cookies.set(COOKIE_NAME, JSON.stringify(data));
    setBpmRange([data.minBpm, data.maxBpm]);
    setDebugEnabled(data.debugEnabled);
    setPulsoidToken(data.pulsoidToken);
  }

  if (settingsOpen) {
    return (
      <div className="app">
        <Settings
          initialPulsoidToken={pulsoidToken}
          initialBpmRange={bpmRange}
          initialDebugEnabled={debugEnabled}
          onSubmit={(data) => {
            setSettingsOpen(false);
            updateSettings(data);
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <button
        className="app__settings-button"
        onClick={() => setSettingsOpen(true)}
      >
        <FiSettings />
      </button>

      <Widget
        heartRate={debugEnabled ? debugHeartRateState : heartRate}
        history={debugEnabled ? debugHistory : history}
        bpmRange={bpmRange}
      />

      {debugEnabled ? (
        <input
          type="number"
          className="app__debug-hr"
          value={debugHeartRate}
          min={1}
          onChange={(e) =>
            setDebugHeartRate(e.target.value ? parseInt(e.target.value) : 1)
          }
        />
      ) : null}

      <PulsoidConnectionStatus state={connectionState} />
    </div>
  );
}

export default App;
