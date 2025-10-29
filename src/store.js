import { configureStore } from "@reduxjs/toolkit";
import prefReducer from "@/reducers/prefSlice";
import chatReducer from "@/reducers/chatSlice";
import counterReducer from "@/reducers/counterSlice";


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    prefs: prefReducer,
    chat: chatReducer,
  },
});
