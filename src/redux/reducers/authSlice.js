import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Check localStorage for user data
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true" || false, // Check localStorage for session
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", true); // Persist login status
      localStorage.setItem("user", JSON.stringify(action.payload)); // Persist user data
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated"); // Clear login status
      localStorage.removeItem("user"); // Clear user data
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
