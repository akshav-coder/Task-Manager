import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../redux/reducers/taskSlice";
import authReducer from "../redux/reducers/authSlice";
import snackbarReducer from "../redux/reducers/snackbarSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    tasks: taskReducer,
    auth: authReducer,
    snackbar: snackbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
