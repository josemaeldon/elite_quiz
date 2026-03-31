import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./reducers/userSlice";
import languageReducer from "./reducers/languageSlice";
import settingsReducer from "./reducers/settingsSlice";
import tempdataReducer from "./reducers/tempDataSlice";
import bookmarkReducer from "./reducers/bookmarkSlice";
import groupbattleReducer from "./reducers/groupbattleSlice";
import badgeReducer from "./reducers/badgesSlice";
import webSettingsReducer from "./reducers/webSettings";
import homeReducer from "./reducers/homeSlice";
import notificationReducer from "./reducers/notificationSlice";
import userCoinsSlice from "./reducers/userCoinsSlice";
import showSeconds from "./reducers/showRemainingSeconds";
import messageSlice from "./reducers/messageSlice";
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  User: userReducer,
  Languages: languageReducer,
  Settings: settingsReducer,
  Tempdata: tempdataReducer,
  Bookmark: bookmarkReducer,
  GroupBattle: groupbattleReducer,
  Badges: badgeReducer,
  WebSettings: webSettingsReducer,
  Home: homeReducer,
  Notification: notificationReducer,
  UserCoins: userCoinsSlice,
  showSeconds: showSeconds,
  message: messageSlice,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// export const store = configureStore({
//   reducer: persistReducer(persistConfig, rootReducer),
//   middleware: [api]
// })

export const persistor = persistStore(store);
