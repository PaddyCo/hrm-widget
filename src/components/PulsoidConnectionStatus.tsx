import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import { PulsoidConnectionState } from "../hooks/usePulsoidData";

interface PulsoidConnectionStatusProps {
  state: PulsoidConnectionState;
}

import "./PulsoidConnectionStatus.css";

const PulsoidConnectionStatus = ({ state }: PulsoidConnectionStatusProps) => {
  if (state == PulsoidConnectionState.CONNECTED) {
    return (
      <div className="pulsoid-connection-status__icon pulsoid-connection-status__icon--connected">
        <FiCheck />
      </div>
    );
  }

  if (state == PulsoidConnectionState.CONNECTION_FAILED) {
    return (
      <div className="pulsoid-connection-status__icon pulsoid-connection-status__icon--failed">
        <FiX />
      </div>
    );
  }

  return (
    <div className="pulsoid-connection-status__icon pulsoid-connection-status__icon--no-connection">
      <FiLoader />
    </div>
  );
};

export default PulsoidConnectionStatus;
