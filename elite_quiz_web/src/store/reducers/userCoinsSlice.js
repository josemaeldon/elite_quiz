// userCoinsSlice.js
import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  lastFetch: null,
  loading: false,
  error: null,
};

export const userCoinsSlice = createSlice({
  name: "UserCoins",
  initialState,
  reducers: {
    userCoinsRequested: (usercoins, action) => {
      usercoins.loading = true;
    },
    userCoinsSuccess: (usercoins, action) => {
      usercoins.data = action.payload.data;
      usercoins.loading = false;
      usercoins.lastFetch = Date.now();
    },
    userCoinsFailure: (usercoins, action) => {
      usercoins.loading = false;
      usercoins.error = action.payload; // Store the error message
    },
    resetUserCoins: (usercoins) => {
      usercoins.data = null;
      usercoins.loading = false;
      usercoins.lastFetch = null;
      usercoins.error = null; // Reset error state
    },
    clearReloadFlag: () => {
      sessionStorage.removeItem("firstLoad_Coins");
    },
  },
});

export const {
  userCoinsRequested,
  userCoinsSuccess,
  userCoinsFailure,
  resetUserCoins,
  clearReloadFlag,
} = userCoinsSlice.actions;
export default userCoinsSlice.reducer;

// Selectors
export const userCoinsData = createSelector(
  (state) => state.UserCoins,
  (usercoins) => usercoins?.data
);
