export const ACTION_TYPES = {
  single_coin: "single_coin",
  fetch_coins: "fetch_coins",
  set_currency: "set_currency",
  set_selected_coin: "set_selected_coin",
  set_unselected_coin: "set_unselected_coin",
};

export const initialState = {
  coins: [],
  singleCoin: [],
  currency: JSON.parse(localStorage.getItem("currency")) || [],
  selectedCoin: JSON.parse(localStorage.getItem("selectedCoins")) || [],
};

export default function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.fetch_coins:
      return { ...state, coins: action.payload };

    case ACTION_TYPES.set_currency:
      localStorage.setItem("currency", JSON.stringify(action.payload));
      return { ...state, currency: action.payload };

    case ACTION_TYPES.set_selected_coin:
      return {
        ...state,
        selectedCoin: [...state.selectedCoin, action.payload],
      };

    case ACTION_TYPES.set_unselected_coin:
      return {
        ...state,
        selectedCoin: state.selectedCoin.filter(
          (coin) => coin.id !== action.payload.id
        ),
      };
    case ACTION_TYPES.single_coin:
      return { ...state, singleCoin: action.payload };

    default:
      return state;
  }
}
