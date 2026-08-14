import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

interface IAuthState {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  expirationTime: number | null;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  userId: null,
  token: null,
  expirationTime: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        userId: string;
        token: string;
        expirationTime: number;
      }>
    ) => {
      const { userId, token, expirationTime } = action.payload;
      state.userId = userId;
      state.token = token;
      state.expirationTime = expirationTime;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.expirationTime = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.sendAuthRequest.matchFulfilled,
      (state, action: PayloadAction<any>) => {
        const { payload } = action;
        state.userId = payload.localId;
        state.token = payload.idToken;
        state.expirationTime = Date.now() + payload.expiresIn * 1000;
        state.isLoggedIn = true;
      }
    );
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
