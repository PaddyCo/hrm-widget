import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { HeartRateHistory } from "../hooks/heartRateData";
import "./HeartRateHistoryChart.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Chart,
} from "chart.js";
import { useEffect, useRef } from "react";

interface HeartRateHistoryChartProps {
  history: HeartRateHistory;
  getHistory: () => HeartRateHistory;
  min: number;
  max: number;
}

ChartJS.register(StreamingPlugin, LinearScale, LineElement, PointElement);

const HeartRateHistoryChart = ({
  history,
  getHistory,
  min = 60,
  max = 200,
}: HeartRateHistoryChartProps) => {
  const data = {};

  const canvas = useRef<any>();

  useEffect(() => {
    console.log("Render chart");
    const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;

    Chart.register(
      StreamingPlugin,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale,
      LineController
    );

    var chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            data: [],
            borderWidth: 8,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: function ({ chart }) {
              //return "#ff69b4"
              if (chart.ctx) {
                const gradientStroke = chart.ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  chart.height
                );
                gradientStroke.addColorStop(1, "#00ff00");
                gradientStroke.addColorStop(0, "#ff0000");
                return gradientStroke;
              }
            },
            fill: true,
          },
        ],
      },
      options: {
        elements: {
          point: {
            radius: 0,
          },
        },
        tension: 0.4,
        scales: {
          x: {
            type: "realtime",
            display: false,
            realtime: {
              onRefresh: (chart: any) => {
                chart.data.datasets.forEach((dataset: any) => {
                  if (dataset.data.length == 0) {
                    dataset.data = window.heartRateHistory.map((h) => ({
                      x: h.timestamp,
                      y: h.heartRate,
                    }));
                  }

                  const lastEntry = dataset.data[dataset.data.length - 1];
                  const entries = [...window.heartRateHistory].filter(
                    (h) => h.timestamp > lastEntry.x
                  ) as HeartRateHistory;

                  entries.forEach((entry) => {
                    dataset.data.push({
                      x: entry.timestamp,
                      y: entry.heartRate,
                    });
                  });
                });
              },
              refresh: 1000,
              duration: 1000 * 120, // 1 Minute
              delay: 2000,
            },
          },
          y: {
            display: false,
            suggestedMin: min,
            suggestedMax: max,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [canvas]);

  useEffect(() => {
    window.heartRateHistory = history;
  }, [history]);

  return (
    <div className="heart-rate-history-chart__container">
      <canvas ref={canvas} height={200} width={400} />
    </div>
  );
};

export default HeartRateHistoryChart;
