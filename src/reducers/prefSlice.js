import { createSlice } from "@reduxjs/toolkit";

export const prefSlice = createSlice({
  name: "prefs",
  initialState: {
    theme: "light",
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = prefSlice.actions;

export default prefSlice.reducer;
