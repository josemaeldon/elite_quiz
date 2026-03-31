import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

// initial state
const initialState = {
  data: null,
  loading: false,
  lastFetch: null,
  syslastFetch: null,
  systemConfig: {}, //immutable data
  fcmToken: null,
};

// slice
export const settingsSlice = createSlice({
  name: "Settings",
  initialState,
  reducers: {
    settingsRequested: (settings, action) => {
      settings.loading = true;
    },
    settingsSucess: (settings, action) => {
      settings.data = action.payload.data;
      settings.loading = false;
      settings.lastFetch = Date.now();
    },
    settingsFailure: (settings, action) => {
      settings.loading = false;
    },
    settingsConfigurationSucess: (settings, action) => {
      let { data } = action.payload;
      settings.systemConfig = data;
      settings.loading = false;
      settings.syslastFetch = Date.now();
    },
    clearReloadFlag: () => {
      sessionStorage.removeItem("firstLoad_Settings");
    },
    setFcmToken: (settings, action) => {
      settings.fcmToken = action.payload;
    },
  },
});

export const {
  settingsRequested,
  settingsSucess,
  settingsFailure,
  settingsConfigurationSucess,
  clearReloadFlag,
  setFcmToken,
} = settingsSlice.actions;
export default settingsSlice.reducer;

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("manualRefresh_Settings", "true");
  });

  window.addEventListener("load", () => {
    // Check if this is a manual refresh by checking if lastFetch is set
    if (!sessionStorage.getItem("lastFetch_Settings")) {
      sessionStorage.setItem("manualRefresh_Settings", "true");
    }
  });
}

// Event listener to set manualRefresh flag when page is manually refreshed
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("manualRefresh_Settings_Config", "true");
  });

  window.addEventListener("load", () => {
    // Check if this is a manual refresh by checking if lastFetch is set
    if (!sessionStorage.getItem("lastFetch_Settings_Config")) {
      sessionStorage.setItem("manualRefresh_Settings_Config", "true");
    }
  });
}
export const setFcmId = (token) => {
  store.dispatch(setFcmToken(token));
};

// selectors
export const settingsData = createSelector(
  (state) => state.Settings,
  (Settings) => Settings.data
);

export const sysConfigdata = createSelector(
  (state) => state.Settings,
  (Settings) => Settings?.systemConfig
);

export const fcmToken = createSelector(
  (state) => state.Settings,
  (Settings) => Settings.fcmToken
);
