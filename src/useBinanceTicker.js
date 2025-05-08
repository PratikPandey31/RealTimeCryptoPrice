import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLivePrice } from "./redux/coinsSlice";
const useBinanceTicker = (symbols = []) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (symbols.length === 0) return;

    const streams = symbols.map(sym => `${sym.toLowerCase()}usdt@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Binance WebSocket sends individual ticker updates wrapped in an array
      const ticker = Array.isArray(data) ? data[0].data : data.data;

      if (ticker && ticker.s && ticker.c) {
        dispatch(setLivePrice({ symbol: ticker.s, price: parseFloat(ticker.c) }));
      }
    };

    ws.onerror = (error) => {
      console.error("Binance WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("Binance WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, [symbols, dispatch]);

  // This hook no longer needs to return the prices.
  // The updated prices are now managed in the Redux store.
  return {};
};

export default useBinanceTicker;