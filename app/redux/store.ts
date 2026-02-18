// src/store/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice"; // example slice
import userSlice from "./userSlice"; // example slice
import notesSlice from "./notesSlice"; // example slice

const rootReducer = combineReducers({
  theme: themeSlice,
  user: userSlice,
  notes: notesSlice,
  // other reducers...
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
