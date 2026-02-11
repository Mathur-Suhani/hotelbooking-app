import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import hotelReducer from "./hotelSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotels: hotelReducer,
  },
});
