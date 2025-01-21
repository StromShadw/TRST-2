import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: null,
  accessToken: null,
  error: null,
  loading: false,
  isUserLogout: false,
  errorMsg: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message || "Login failed";
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload.data.user;  // Store just the user object
      state.accessToken = action.payload.data.accessToken;
      state.loading = false;
      state.errorMsg = false;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_login_flag(state) {
      state.error = null
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  loginSuccess,
  loginRequest,
  logoutUserSuccess,
  reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;