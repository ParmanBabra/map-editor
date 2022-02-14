import { createSlice } from "@reduxjs/toolkit";
import { System as Collisions, Box, Vector } from "detect-collisions";

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

    addSelect: (state, action) => {
      if (action.payload.key) {
        state.selections.push({
          id: action.payload.key,
          type: action.payload.type,
        });
        console.log(action);
      } else {
        state.selections.push({
          id: action.payload.id,
          type: action.payload.type,
        });
      }

      state.isMap = false;
    },

    selectWithRect: (state, action) => {
      let { elements, rect } = action.payload;

      let boxRect = new Box({ x: rect.x, y: rect.y }, rect.width, rect.height);
      let collisions = new Collisions();
      let selecting = [];

      for (const element of elements) {
        let elementRect = new Box(
          { x: element.x, y: element.y },
          element.width,
          element.height
        );

        if (collisions.checkCollision(boxRect, elementRect)) {
          selecting.push({ id: element.key, type: element.type })
        }
      }

      state.selections = selecting;
    },
  },
});

// Action creators are generated for each case reducer function
export const { select, selectMap, clear, addSelect, selectWithRect } =
  selectionSlice.actions;

export default selectionSlice.reducer;
