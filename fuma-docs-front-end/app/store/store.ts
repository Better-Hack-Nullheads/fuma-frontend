
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import docsReducer from "./slices/docsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    docs: docsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
