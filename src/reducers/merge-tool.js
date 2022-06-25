import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";

import { collisionBox } from "./../helper/detect-collision";

const getMatchedItems = (items, params) => {
  const sources = _.filter(items, (x) => x.layer === params.sourceLayer);
  const destinations = _.filter(
    items,
    (x) => x.layer === params.destinationLayer
  );

  const results = [];

  for (const destination of destinations) {
    const resultsCollision = collisionBox(destination, sources);

    const matcheds = _.filter(
      resultsCollision,
      (item) => item.percentOverlap * 100 >= params.threshold
    );

    const ordered = _.orderBy(matcheds, (item) => item.percentOverlap, "desc");

    if (ordered.length > 0) {
      const matchedSource = ordered[0];

      results.push({ source: matchedSource.id, destination: destination.key });
    }
  }

  return results;
};

export const updateParams = createAsyncThunk(
  "merge-tool/update-params",
  async (params, thunkAPI) => {
    let old = thunkAPI.getState().mergeTool.params;
    return Promise.resolve({ oldParams: old, newParams: params });
  }
);

export const processing = createAsyncThunk(
  "merge-tool/processing",
  async (actions, thunkAPI) => {
    let { params } = thunkAPI.getState().mergeTool;
    let { zones, lanes, slots } = thunkAPI.getState().mapManagement;
    let results = { zones: [], lanes: [], slots: [] };

    if (!params.sourceLayer) {
      return Promise.resolve(results);
    }

    if (!params.destinationLayer) {
      return Promise.resolve(results);
    }

    if (!params.sourceMatchedLayer) {
      return Promise.resolve(results);
    }

    if (params.zone) {
      zones = _.values(zones);
      let resultMatcheds = getMatchedItems(zones, params);
      results.zones = resultMatcheds;
    }

    if (params.lane) {
      lanes = _.values(lanes);
      let resultMatcheds = getMatchedItems(lanes, params);
      results.lanes = resultMatcheds;
    }

    if (params.slot) {
      slots = _.values(slots);
      let resultMatcheds = getMatchedItems(slots, params);
      results.slots = resultMatcheds;
    }

    return Promise.resolve(results);
  }
);

export const merge = createAsyncThunk(
  "merge-tool/merge",
  async (actions, thunkAPI) => {
    let { matching, params } = thunkAPI.getState().mergeTool;
    return Promise.resolve({ matched: matching, params });
  }
);

export const mergeToolSlice = createSlice({
  name: "merge-tool",
  initialState: {
    params: {
      zone: false,
      lane: true,
      slot: false,
      sourceLayer: 1,
      destinationLayer: null,
      sourceMatchedLayer: null,
      threshold: 100,
    },
    matching: {
      zones: [],
      lanes: [],
      slots: [],
    },
  },
  reducers: {
    resetParams: (state, action) => {
      state.params = {
        zone: false,
        lane: true,
        slot: false,
        sourceLayer: 1,
        destinationLayer: null,
        sourceMatchedLayer: null,
        threshold: 100,
      };

      state.matching = {
        zones: [],
        lanes: [],
        slots: [],
      };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(updateParams.fulfilled, (state, action) => {
      state.params = action.payload.newParams;
    });
    builder.addCase(processing.fulfilled, (state, action) => {
      state.matching = action.payload;
    });

    builder.addCase(merge.fulfilled, (state, action) => {
      state.params = {
        zone: false,
        lane: true,
        slot: false,
        sourceLayer: 1,
        destinationLayer: null,
        sourceMatchedLayer: null,
        threshold: 100,
      };

      state.matching = {
        zones: [],
        lanes: [],
        slots: [],
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { resetParams } = mergeToolSlice.actions;

export default mergeToolSlice.reducer;
