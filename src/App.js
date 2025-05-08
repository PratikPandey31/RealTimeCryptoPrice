// src/App.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Coin from "./Coin";
import "./App.css";
import "./Coin.css";
import {
  fetchInitialCoinsData,
  setSearchTerm,
} from "./redux/coinsSlice";
import useBinanceTicker from "./useBinanceTicker"; // Import the custom hook

function App() {
  const search = useSelector((state) => state.coins.search);
  const coinsList = useSelector((state) => state.coins.coinsList);
  const coinsData = useSelector((state) => state.coins.coinsData);
  const livePrices = useSelector((state) => state.coins.livePrices);
  const dispatch = useDispatch();

  // Fetch CoinGecko data once on mount
  useEffect(() => {
    dispatch(fetchInitialCoinsData());
    const intervalId = setInterval(() => {
      dispatch(fetchInitialCoinsData());
    }, 60000); // Poll every 60 seconds
    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [dispatch]);

  // Use the custom hook to subscribe to Binance ticker data
  useBinanceTicker(coinsList.map(c => c.symbol));

  const handleChange = e => dispatch(setSearchTerm(e.target.value));

  // Build the final list: filter → merge REST + WS data
  const displayCoins = coinsList
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .map(c => {
      const rest = coinsData.find(d => d.id === c.id) || {};
      const wsPrice = livePrices[`${c.symbol}USDT`]?.price; // Access price from livePrices

      return {
        ...c,
        // REST fields (might be undefined until fetched)
        current_price: wsPrice !== undefined ? wsPrice : rest.current_price,
        total_volume: rest.total_volume,
        price_change_percentage_1h_in_currency: rest.price_change_percentage_1h_in_currency,
        price_change_percentage_24h_in_currency: rest.price_change_percentage_24h_in_currency,
        price_change_percentage_7d_in_currency: rest.price_change_percentage_7d_in_currency,
        market_cap: rest.market_cap,
        sparkline_in_7d: rest.sparkline_in_7d
      };
    });

  // Helper to format numbers safely
  const formatNum = num =>
    typeof num === "number" ? num.toLocaleString() : "N/A";

  return (
    <div className="App">
      <h1 className="page-title">Real-Time Crypto Price</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Crypto"
          className="coin-input"
          onChange={handleChange}
          value={search}
        />
      </div>

      <div className="flex justify-between center table-headings ">
        <div className="coin">
          <p className="coin-symbol">Name</p>
          <p className="coin-symbol symbol-header">Symbol</p>
        </div>
        <div className="coin-data">
          <p className="coin-price">Price</p>
          <p className="coin-percent">% Change</p>
          <p className="coin-volume">24h Volume</p>
          <p className="coin-marketcap">Market Cap</p>
          <p className="chart"> 7 days live Chart</p>
        </div>
      </div>

      <div className="coin-data-display">
        {displayCoins.length === 0 ? (
          <div className="no-search-result">
            <h3>No Search Results Found!</h3>
          </div>
        ) : (
          displayCoins.map(coin => (
            <Coin
              key={coin.id}
              name={coin.name}
              image={coin.image}
              price={coin.current_price}
              symbol={coin.symbol}
              volume={coin.total_volume}
              priceChange1h={coin.price_change_percentage_1h_in_currency}
              priceChange24h={coin.price_change_percentage_24h_in_currency}
              priceChange7d={coin.price_change_percentage_7d_in_currency}
              marketCap={coin.market_cap}
              sparkline={coin.sparkline_in_7d?.price || []}
              formatNum={formatNum}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
