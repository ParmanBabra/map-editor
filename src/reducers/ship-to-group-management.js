import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Papa from "papaparse";
import localStorage from "local-storage";

import { loadJson } from "./map-management";

import { exportPriorites, exportShipToGroups } from "./../helper/export-zone";

export const importShipToGroup = createAsyncThunk(
  "ship-to-group-management/import",
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

export const exportSql = createAsyncThunk(
  "ship-to-group-management/export-sql",
  async (_, thunkAPI) => {
    let { shipToGroups } = thunkAPI.getState().shipToGroupsManagement;
    let { lanes, map } = thunkAPI.getState().mapManagement;

    let sql = exportShipToGroups(shipToGroups, map);
    let sql2 = exportPriorites(lanes, shipToGroups, map);

    let resultSql = [...sql, ...sql2];

    console.log(resultSql);
    return Promise.resolve(resultSql);
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
    builder.addCase(loadJson.fulfilled, (state, action) => {
      let { ship_to_groups } = action.payload;
      if (!ship_to_groups) ship_to_groups = {};

      state.shipToGroups = ship_to_groups;
    });
    builder.addCase(importShipToGroup.fulfilled, (state, action) => {
      for (const shipToGroupInfo of action.payload) {
        if (!shipToGroupInfo.id) continue;

        const shipToGroup = {
          id: shipToGroupInfo.id,
          name: shipToGroupInfo.description,
          color: shipToGroupInfo.color,
        };

        state.shipToGroups[shipToGroup.id] = shipToGroup;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const { update, save, load } = shipToGroupsSlice.actions;

export default shipToGroupsSlice.reducer;
