import { createSlice } from "@reduxjs/toolkit";

export const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    selections: [],
    isMap: false,
  },
  reducers: {
    select: (state, action) => {
      if (action.payload.key) {
        state.selections = [
          { id: action.payload.key, type: action.payload.type },
        ];
      } else {
        state.selections = [
          { id: action.payload.id, type: action.payload.type },
        ];
      }

      state.isMap = false;
    },
    selectMap: (state, action) => {
      state.isMap = true;
    },
    clear: (state, action) => {
      state.selections = [];
      state.isMap = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { select, selectMap, clear } = selectionSlice.actions;

export default selectionSlice.reducer;
