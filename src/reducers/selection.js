import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EditorMode } from "./../helper/constants";
import { System as Collisions, Box, Vector } from "detect-collisions";

import { ContentType } from "./../helper/constants";
import { deleteLayer } from "./map-management";

export const selectionToCurrentLayer = createAsyncThunk(
  "selection/to-current-layer",
  async (key, thunkAPI) => {
    const { selections, currentLayer } = thunkAPI.getState().selection;
    return { selections, layer: currentLayer };
  }
);

export const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    selections: [],
    contents: {
      type: ContentType.Name,
      value: "",
    },
    zoom: { max: 8, min: 0.2, scale: 0.2, percent: 0 },
    currentLayer: 1,
    editor_mode: EditorMode.None,
    isMap: false,
  },
  reducers: {
    updateCurrentLayer: (state, action) => {
      state.currentLayer = action.payload;
    },
    changeEditorMode: (state, action) => {
      state.editor_mode = action.payload;
    },
    updateZoomScale: (state, action) => {
      state.zoom.scale = action.payload;

      state.zoom.percent =
        (action.payload - state.zoom.min) / (state.zoom.max - state.zoom.min);
    },
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
          selecting.push({ id: element.key, type: element.type });
        }
      }

      state.selections = selecting;
    },

    copyLanePriorites: (state, action) => {
      state.contents.type = ContentType.LanePriorites;
      state.contents.value = action.payload;
    },

    copyLaneProperties: (state, action) => {
      state.contents.type = ContentType.LaneProperties;
      state.contents.value = action.payload;
    },

    copyZoneProperties: (state, action) => {
      state.contents.type = ContentType.ZoneProperties;
      state.contents.value = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(deleteLayer.fulfilled, (state, action) => {
      if (action.payload == state.currentLayer) {
        state.currentLayer = 1;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  select,
  selectMap,
  clear,
  addSelect,
  selectWithRect,
  copyLanePriorites,
  copyLaneProperties,
  copyZoneProperties,
  updateZoomScale,
  changeEditorMode,
  updateCurrentLayer,
} = selectionSlice.actions;

export default selectionSlice.reducer;
