import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: localStorage.getItem("isAuthenticated") || false, // Check localStorage for session
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", true); // Persist login status
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated"); // Clear login status
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
