import { createSlice } from "@reduxjs/toolkit";

export const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    selections: [],
    isMap: false,
  },
  reducers: {
    select: (state, action) => {
      state.selections = [{ id: action.payload.id, type: action.payload.type }];
      state.isMap = false;
    },
    selectMap: (state, action) => {
      state.isMap = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { select, selectMap } = selectionSlice.actions;

export default selectionSlice.reducer;
