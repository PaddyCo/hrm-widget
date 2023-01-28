import { useEffect, useState } from "react";
import { HeartRateData, HeartRateHistory } from "./heartRateData";

export interface PulsoidMessage {
  timestamp: number;
  data: {
    heartRate: number;
  };
}

export enum PulsoidConnectionState {
  NOT_CONNECTED,
  CONNECTION_FAILED,
  CONNECTED,
}

interface PulsoidData {
  connectionState: PulsoidConnectionState;
}

export default function usePulsoidData(
  token: string
): HeartRateData & PulsoidData {
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateHistory>(
    []
  );
  const [socket, setSocket] = useState<WebSocket>();
  const [connectionState, setConnectionState] =
    useState<PulsoidConnectionState>(PulsoidConnectionState.NOT_CONNECTED);

  function onPulsoidMessage(event: MessageEvent<string>) {
    const data = JSON.parse(event.data) as PulsoidMessage;
    setHeartRateHistory((oldHistory) => [
      ...oldHistory,
      { timestamp: data.timestamp, heartRate: data.data.heartRate },
    ]);
  }

  useEffect(() => {
    if (socket) {
      console.log("Closing old WS socket");
      socket.close();
      setConnectionState(PulsoidConnectionState.NOT_CONNECTED);
    }

    console.log("Opening Pulsoid WS socket...");
    const ws = new WebSocket(`wss://ramiel.pulsoid.net/listen/${token}`);
    setSocket(ws);

    ws.addEventListener("message", onPulsoidMessage);

    ws.addEventListener("open", () => {
      console.log("Pulsoid WS socket connected successfully!");
      setConnectionState(PulsoidConnectionState.CONNECTED);
    });

    ws.addEventListener("error", () => {
      setConnectionState(PulsoidConnectionState.CONNECTION_FAILED);
    });

    return () => {
      ws.close();
      ws.removeEventListener("message", onPulsoidMessage);
    };
  }, [token]);

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
    connectionState,
  };
}

/*
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [pulsoidToken, setPulsoidToken] = useState<string>();
  const [pulsoidSocket, setPulsoidSocket] = useState<WebSocket>();
  const [bpmRange, setBpmRange] = useState<BpmRange>([80, 200]);
  const [heartRate, setHeartRate] = useState<HeartRateState>();
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateHistory>(
    []
  );
  const [pulsoidConnectionState, setPulsoidConnectionState] =
    useState<PulsoidConnectionState>(PulsoidConnectionState.NOT_CONNECTED);
  const [debugEnabled, setDebugEnabled] = useState<boolean>(false);
  const [debugHr, setDebugHr] = useState<number>(60);

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME);
    if (cookie) {
      const data = JSON.parse(cookie) as SettingsData;
      updateSettings(data);
    } else {
      setSettingsOpen(true);
    }

    return () => {
      console.log("Closing socket");
      pulsoidSocket?.removeEventListener("message", onPulsoidMessage);
      pulsoidSocket?.close();
    };
  }, []);

  useEffect(() => {
    if (!debugEnabled) {
      return;
    }

    const interval = setInterval(() => {
      pushHeartRate(Date.now(), debugHr);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [debugEnabled]);

  useEffect(() => {
    const heartRates = heartRateHistory.map((h) => h[1]);

    if (heartRateHistory.length == 0) {
      return;
    }

    setHeartRate({
      current: heartRates[heartRateHistory.length - 1],
      average: heartRates.reduce((a, b) => a + b) / heartRateHistory.length,
      peak: heartRates.sort()[heartRateHistory.length - 1],
    });
  }, [heartRateHistory]);

  function pushHeartRate(timestamp: number, heartRate: number) {
    setHeartRateHistory((oldHistory) => [
      ...oldHistory,
      [timestamp, heartRate],
    ]);
  }

  function onPulsoidMessage(event: MessageEvent<string>) {
    const data = JSON.parse(event.data) as PulsoidMessage;
    pushHeartRate(data.timestamp, data.data.heartRate);
  }

  function updateSettings(data: SettingsData) {
    Cookies.set(COOKIE_NAME, JSON.stringify(data));
    setBpmRange([data.minBpm, data.maxBpm]);
    console.log(data.debugEnabled);
    setDebugEnabled(data.debugEnabled);
    setPulsoidToken(data.pulsoidToken);
  }

  function connectPulsoidSocket() {
    if (pulsoidSocket) {
      console.log("Closing old WS socket");
      pulsoidSocket.close();
      setPulsoidConnectionState(PulsoidConnectionState.NOT_CONNECTED);
    }

    console.log("Opening Pulsoid WS socket...");
    const ws = new WebSocket(`wss://ramiel.pulsoid.net/listen/${pulsoidToken}`);

    setPulsoidSocket(ws);

    ws.addEventListener("message", onPulsoidMessage);

    ws.addEventListener("open", () => {
      console.log("Pulsoid WS socket connected successfully!");
      setPulsoidConnectionState(PulsoidConnectionState.CONNECTED);
    });

    ws.addEventListener("error", () => {
      setPulsoidConnectionState(PulsoidConnectionState.CONNECTION_FAILED);
    });
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

      {heartRate && heartRate.current > 0 ? (
        <HeartRateMonitor
          heartRate={heartRate.current}
          peakHeartRate={heartRate.peak}
          avgHeartRate={heartRate.average}
        />
      ) : null}

      {debugEnabled ? (
        <input
          type="number"
          value={debugHr}
          onChange={(e) => setDebugHr(parseInt(e.target.value))}
        />
      ) : null}

      <PulsoidConnectionStatus state={pulsoidConnectionState} />
    </div>
  );
}

export default App;

*/
