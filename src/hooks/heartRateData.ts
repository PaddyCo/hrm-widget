export interface HeartRateState {
  current: number;
  average: number;
  peak: number;
}

export interface HeartRateHistoryEntry {
  timestamp: number;
  heartRate: number;
}

export type HeartRateHistory = Array<HeartRateHistoryEntry>;

export interface HeartRateData {
  heartRate: HeartRateState;
  history: HeartRateHistory; // 0 = timestamp, 1 = heartrate
}
