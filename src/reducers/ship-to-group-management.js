import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Papa from "papaparse";
import localStorage from "local-storage";

export const importShipToGroup = createAsyncThunk(
  "ship-to-Group-management/import",
  async (file, thunkAPI) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
      });
    });
  }
);

export const shipToGroupsSlice = createSlice({
  name: "shipToGroups",
  initialState: {
    shipToGroups: {},
  },
  reducers: {
    save: (state, action) => {
      let key = `SHIP_GROUP_WH_${action.payload}`;
      let data = { ...state };
      localStorage(key, data);
    },
    load: (state, action) => {
      let key = `SHIP_GROUP_WH_${action.payload}`;

      let data = localStorage(key);
      state.shipToGroups = {};

      if (!data) return;
      state.shipToGroups = data.shipToGroups;
    },
    update: (state, action) => {
      let shipToGroup = action.payload;
      state.shipToGroups[shipToGroup.id] = shipToGroup;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(importShipToGroup.fulfilled, (state, action) => {
      for (const shipToGroupInfo of action.payload) {
        if (!shipToGroupInfo.id) continue;

        const shipToGroup = {
          id: shipToGroupInfo.id,
          name: shipToGroupInfo.description,
          color: "#FFFFFF",
        };

        state.shipToGroups[shipToGroup.id] = shipToGroup;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const { update, save, load } = shipToGroupsSlice.actions;

export default shipToGroupsSlice.reducer;
