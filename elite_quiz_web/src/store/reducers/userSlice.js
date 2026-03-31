import { createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

// state
const initialState = {
  data: null,
  isLogin: false,
  token: null,
};

// slice
export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    loginSuccess: (user, action) => {
      let { data } = action.payload;
      user.data = data;
      user.token = data?.api_token;
      user.isLogin = true;

      user.data.userStatics = {};

      user.data.userProfileStatics = {};

      user.data.name = data?.name.charAt(0).toUpperCase() + data?.name.slice(1);

      return user;
    },
    logoutSuccess: (user) => {
      user = initialState;
      return user;
    },
    imageUploadSuccess: (user, action) => {
      user.data.profile = action.payload;
    },
    profileUpdateDataSuccess: (user, action) => {
      let data = action.payload;
      user.data.name = data?.name ?? user.data?.name;
      user.data.mobile = data?.mobile ?? user.data?.mobile;
      if (user.data.type == "mobile") {
        user.data.email = data?.email ?? user.data?.email;
      }
    },
    userStatictisDataSuccess: (user, action) => {
      let { data } = action.payload;
      user.data.userStatics = data ?? user.data;
    },
    userprofileStatictisDataSuccess: (user, action) => {
      let { data } = action.payload;
      user.data.userProfileStatics = data ?? user.data?.userProfileStatics;
    },
    updateUserDatainfo: (user, action) => {
      // Handle both formats: { data: {...} } and direct {...}
      let data = action.payload.data || action.payload;

      // Update 'coins' if present in data
      user.data.userProfileStatics.coins =
        data?.coins ?? user.data?.userProfileStatics.coins;

      // Update 'score' if present in data
      user.data.userProfileStatics.all_time_score =
        data?.score ?? user.data?.userProfileStatics.all_time_score;

      // Update 'coins' if present in data
      user.data.coins = data?.coins ?? user.data?.coins;

      // Update 'email' if present in data - using direct assignment and ensuring immutability
      if (data && data.email) {
        // Create a new data object to ensure Redux immutability
        user.data = {
          ...user.data,
          email: data?.email,
        };
      }
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  imageUploadSuccess,
  profileUpdateDataSuccess,
  userStatictisDataSuccess,
  userprofileStatictisDataSuccess,
  updateUserDatainfo,
} = userSlice.actions;
export default userSlice.reducer;

// selectors
export const selectUser = (state) => state.User;

// logout
export const logout = () => {
  store.dispatch(logoutSuccess());
};

// update user data
export const updateUserDataInfo = (data) => {
  store.dispatch(updateUserDatainfo({ data }));
};
