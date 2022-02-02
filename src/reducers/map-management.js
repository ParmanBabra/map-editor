import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import format from "format";
import localStorage from "local-storage";

import { downloadFile } from "./../helper/export-file";
import { exportMapInfo, exportTemplateZone } from "./../helper/export-zone";

let keyList = "MAP_LIST";
let mapList = localStorage(keyList);

export const saveJson = createAsyncThunk(
  "map-management/save-json",
  async (_, thunkAPI) => {
    let state = thunkAPI.getState().mapManagement;
    let { map } = state;
    await downloadFile(state, `WH_${map.warehouseId}-MAP_${map.name}`);
  }
);

export const exportSql = createAsyncThunk(
  "map-management/export-sql",
  async (_, thunkAPI) => {
    let state = thunkAPI.getState().mapManagement;
    let { map, zones } = state;
    let sql = exportMapInfo(map);
    let sql2 = exportTemplateZone(zones, map, state.default);
    sql2 = [...[sql], ...sql2];

    console.log(sql2);

    return Promise.resolve(sql2);
  }
);

// type ZoneProps = {
//   id: number,
//   name: string,
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   laneDirection: string, //vertical, horizontal
//   laneWidth: number,
// };

// type SelectionProps = {
//   id: number,
//   type: string,
// };

export const mapManagementSlice = createSlice({
  name: "mapManagement",
  initialState: {
    zones: {
      1: {
        id: "1",
        name: "1",
        type: "zone",
        x: 0,
        y: 0,
        width: 320,
        height: 200,
        laneDirection: "Vertical",
        laneWidth: 50,
        slotWidth: 50,
        autoGenerate: false,
        capacity: 0,
        localtionType: "storage",
      },
      2: {
        id: "2",
        name: "2",
        type: "zone",
        x: 0,
        y: 0,
        width: 320,
        height: 200,
        laneDirection: "Vertical",
        laneWidth: 50,
        slotWidth: 50,
        autoGenerate: false,
        capacity: 0,
        localtionType: "storage",
      },
      3: {
        id: "3",
        name: "3",
        type: "zone",
        x: 0,
        y: 0,
        width: 320,
        height: 200,
        laneDirection: "Horizontal",
        laneWidth: 50,
        slotWidth: 50,
        autoGenerate: false,
        capacity: 0,
        localtionType: "storage",
      },
    },
    map: {
      id: "A",
      name: "A",
      warehouseId: 2,
      zoneRunning: 3,
      snapGrid: [10, 10],
      size: {
        width: 1000,
        height: 1000,
      },
      showGrid: true,
      showLane: true,
      showSlot: true,
      updateBy: "nakarsat",
    },

    default: {
      laneWidth: 50,
      slotWidth: 50,
      zoneNameFormat: "%s%s",
      laneNameFormat: "%s%s-%03d",
      slotNameFormat: "%s%s-%03d-%s",
    },

    mapList: mapList,
  },

  reducers: {
    update: (state, action) => {
      state.zones[action.payload.id] = action.payload;
    },
    add: (state, action) => {
      state.map.zoneRunning++;
      const id = state.map.zoneRunning;
      const zone = {
        id: id,
        name: format(state.default.zoneNameFormat, state.map.name, id),
        type: "zone",
        x: 0,
        y: 0,
        width: 320,
        height: 200,
        laneDirection: "Vertical",
        laneWidth: state.default.laneWidth,
        slotWidth: state.default.slotWidth,
        autoGenerate: false,
        capacity: 0,
        localtionType: "storage",
      };
      state.zones[id] = zone;
    },
    updateMap: (state, action) => {
      state.map = action.payload;
    },
    updateDefault: (state, action) => {
      state.default = action.payload;
    },

    saveLocal: (state, action) => {
      let saveKey = `WH_${state.map.warehouseId}_MAP_${state.map.name}`;
      let mapList = localStorage(keyList);
      let data = { ...state };
      delete data.mapList;

      if (!mapList) {
        mapList = [];
      }

      if (!mapList.includes(saveKey)) mapList.push(saveKey);

      localStorage(keyList, mapList);
      localStorage(saveKey, data);
    },

    loadLocal: (state, action) => {
      let loadKey = action.payload;
      let data = localStorage(loadKey);
      data = { ...state, ...data };

      state.zones = data.zones;
      state.map = data.map;
      state.default = data.default;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(saveJson.fulfilled, (state, action) => {});
    builder.addCase(exportSql.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const {
  update,
  add,
  updateMap,
  updateDefault,
  saveLocal,
  loadLocal,
  exportSQL,
} = mapManagementSlice.actions;

export default mapManagementSlice.reducer;
