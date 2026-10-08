import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import authreducer from "./slices/authslices";


export const store = configureStore({
  reducer: {
    auth:authreducer,
  },
});