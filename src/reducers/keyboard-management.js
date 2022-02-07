import { createSlice } from "@reduxjs/toolkit";

export const keyboardSlice = createSlice({
  name: "keyboard",
  initialState: {
    keys: {},
    mouse: {},
  },
  reducers: {
    down: (state, action) => {
      state.keys[action.payload] = true;
    },

    up: (state, action) => {
      state.keys[action.payload] = false;
    },

    mouseDown: (state, action) => {
      state.mouse[action.payload] = true;
    },

    mouseUp: (state, action) => {
      for (const key in state.mouse) {
        if (Object.hasOwnProperty.call(state.mouse, key)) {
          state.mouse[key] = false;
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { up, down, mouseDown, mouseUp } = keyboardSlice.actions;

export default keyboardSlice.reducer;
