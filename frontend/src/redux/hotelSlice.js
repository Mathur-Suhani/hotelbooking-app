import { createSlice } from "@reduxjs/toolkit";

const hotelSlice = createSlice({
  name: "hotels",
  initialState: {
    results: [],
    compare: JSON.parse(localStorage.getItem("compare")) || [],
  },
  reducers: {
    setResults(state, action) {
      state.results = action.payload;
    },
    addToCompare(state, action) {
      const exists = state.compare.find(h => h.hotelId === action.payload.hotelId);
      if (!exists) {
        state.compare.push(action.payload);
        localStorage.setItem("compare", JSON.stringify(state.compare));
      }
    },
    removeFromCompare(state, action) {
      state.compare = state.compare.filter(h => h.hotelId !== action.payload);
      localStorage.setItem("compare", JSON.stringify(state.compare));
    },
    clearCompare(state) {
      state.compare = [];
      localStorage.removeItem("compare");
    },
  },
});

export const { setResults, addToCompare, removeFromCompare, clearCompare } = hotelSlice.actions;
export default hotelSlice.reducer;