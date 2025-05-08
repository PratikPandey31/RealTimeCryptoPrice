import React from "react";
import "./App.css";
import "./Coin.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type CoinProps = {
  image: string;
  name: string;
  symbol: string;
  price?: number;
  volume?: number;
  priceChange1h?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  marketCap?: number;
  sparkline?: number[];
  formatNum?: (num: number) => string;
};

const Coin: React.FC<CoinProps> = ({
  image,
  name,
  symbol,
  price,
  volume,
  priceChange1h,
  priceChange24h,
  priceChange7d,
  marketCap,
  sparkline,
  formatNum,
}) => {
  const _format = formatNum || ((num: number) => (typeof num === "number" ? num.toLocaleString() : "N/A"));

  const sampleRate = 3;
  const sampledSparkline = sparkline ? sparkline.filter((_, index) => index % sampleRate === 0) : [];
  const labels = sampledSparkline.map((_, idx) => idx * sampleRate);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: sampledSparkline,
        borderWidth: 1,
        tension: 0.3,
        borderColor: priceChange7d !== undefined && priceChange7d < 0 ? "#f00606" : "#11d11b",
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="coin-container">
      <div className="coin-row">
        <div className="coin">
          <img src={image} alt={`${name} logo`} />
          <h1>{name || "N/A"}</h1>
          <p className="coin-symbol">{symbol || "N/A"}</p>
        </div>
        <div className="coin-data">
          <p className="coin-price">
            {price !== undefined ? `$${_format(price)}` : "N/A"}
          </p>
          <p className={`coin-percent ${priceChange1h !== undefined && priceChange1h < 0 ? "red" : "green"}`}>
            {priceChange1h !== undefined ? `1h: ${priceChange1h.toFixed(2)}%` : "1h: N/A"}
          </p>
          <p className={`coin-percent ${priceChange24h !== undefined && priceChange24h < 0 ? "red" : "green"}`}>
            {priceChange24h !== undefined ? `24h: ${priceChange24h.toFixed(2)}%` : "24h: N/A"}
          </p>
          <p className={`coin-percent ${priceChange7d !== undefined && priceChange7d < 0 ? "red" : "green"}`}>
            {priceChange7d !== undefined ? `7d: ${priceChange7d.toFixed(2)}%` : "7d: N/A"}
          </p>
          <p className="coin-volume">
            {volume !== undefined ? `$${_format(volume)}` : "Volume: N/A"}
          </p>
          <p className="coin-marketcap">
            {marketCap !== undefined ? `$${_format(marketCap)}` : "Market Cap: N/A"}
          </p>
          {sampledSparkline && sampledSparkline.length > 0 && (
            <div className="coin-chart">
              <Line
                data={chartData}
                height={60}
                options={{
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                  elements: {
                    line: {
                      tension: 0.3,
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coin;
