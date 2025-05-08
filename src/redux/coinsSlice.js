import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const coinsList = [
  { id: "bitcoin",       name: "Bitcoin",     symbol: "BTC", image: "https://logospng.org/download/bitcoin/logo-bitcoin-4096.png" },
  { id: "ethereum",      name: "Ethereum",    symbol: "ETH", image: "https://th.bing.com/th/id/R.2cf1f96d55872b6b6af5417d618e4010?rik=A36G%2bIIjrTUGDw&riu=http%3a%2f%2ficons.iconarchive.com%2ficons%2fcjdowner%2fcryptocurrency-flat%2f1024%2fEthereum-ETH-icon.png&ehk=1D6qzc4MjsPm6w9g6sozGFmgFpmNVMl773D8lZe5%2b6g%3d&risl=&pid=ImgRaw&r=0" },
  { id: "solana",        name: "Solana",      symbol: "SOL",image: "https://img.freepik.com/premium-vector/solana-coin_48203-257.jpg?w=2000" },
  { id: "binancecoin",   name: "Binance Coin", symbol: "BNB", image: "https://static.vecteezy.com/system/resources/previews/013/373/690/non_2x/binance-coin-bnb-3d-rendering-isometric-icon-free-png.png" },
  { id: "ripple",        name: "Ripple",      symbol: "XRP", image: "https://th.bing.com/th/id/OIP.YR8lO09o3t_7mI7mzNQQrQHaHa?rs=1&pid=ImgDetMain" }
];

// Async thunk to fetch initial coin data
export const fetchInitialCoinsData = createAsyncThunk(
  'coins/fetchInitialData',
  async (_, { dispatch }) => {
    const ids = coinsList.map(c => c.id).join(",");
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets` +
        `?vs_currency=usd&ids=${ids}` +
        `&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      dispatch(setCoinsData(res.data));
    } catch (err) {
      console.error("CoinGecko fetch failed:", err);
    }
  }
);

const initialState = {
  coinsList: coinsList,
  coinsData: [],
  livePrices: {},
  search: "",
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoinsData: (state, action) => {
      state.coinsData = action.payload;
    },
    setLivePrice: (state, action) => {
      state.livePrices[action.payload.symbol] = action.payload.price;
    },
    setSearchTerm: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialCoinsData.fulfilled, (state, action) => {
      // While the reducer in createAsyncThunk already handles this,
      // you might have additional logic here if needed.
    });
  },
});

export const { setCoinsData, setLivePrice, setSearchTerm } = coinsSlice.actions;

export default coinsSlice.reducer;