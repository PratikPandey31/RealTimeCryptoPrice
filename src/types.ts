export interface CoinType {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price?: number;
  total_volume?: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CoinDataType {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: {
    price: number[];
  };
}


export interface LivePrice {
  symbol: string;
  price: number;
}
