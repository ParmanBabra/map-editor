import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import format from "format";
import localStorage from "local-storage";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import { downloadFile } from "./../helper/export-file";
import { collisionBox } from "./../helper/detect-collision";
import {
  exportMapInfo,
  exportTemplateZone,
  generateLaneRectFromTemplateZone,
  generateSlotRectFromTemplateZone,
} from "./../helper/export-zone";

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
        key: 1,
        id: 1,
        name: "A1",
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
        key: 2,
        id: 2,
        name: "A2",
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
        key: 3,
        id: 3,
        name: "A3",
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
    slots: {},
    lanes: {},
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
      freezingZone: false,
      freezingLane: true,
      freezingSlot: true,
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
    updateZone: (state, action) => {
      state.zones[action.payload.id] = action.payload;
    },
    updateLane: (state, action) => {
      state.lanes[action.payload.key] = action.payload;
    },
    updateSlot: (state, action) => {
      state.slots[action.payload.key] = action.payload;
    },
    updateZoneOfLane: (state, action) => {
      let lane = state.lanes[action.payload];

      let zones = _.values(state.zones);
      zones = collisionBox(lane, zones);

      if (zones.length > 0) {
        let zone = zones[0];
        lane.zone_id = zone.id;

        let lanesInZone = _.values(state.lanes).filter(
          (x) => zone.id === x.zone_id
        );

        if (zone.laneDirection === "Vertical") {
          lanesInZone = _.orderBy(lanesInZone, ["x"], ["asc"]);
        } else {
          lanesInZone = _.orderBy(lanesInZone, ["y"], ["asc"]);
        }

        let index = 1;
        for (const lane of lanesInZone) {
          lane.id = index;
          lane.name = format(
            state.default.laneNameFormat,
            state.map.name,
            lane.zone_id,
            lane.id
          );
          index++;
        }
      }
    },
    addZone: (state, action) => {
      state.map.zoneRunning++;
      const id = state.map.zoneRunning;
      const zone = {
        key: id,
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
    addLane: (state, action) => {
      const lane = {
        key: uuidv4(),
        id: null,
        name: format(state.default.laneNameFormat, state.map.name, 0, 0),
        zone_id: null,
        x: 0,
        y: 0,
        width: 50,
        height: 200,
        slotWidth: state.default.slotWidth,
        autoAdjustZone: true,
        autoGenerate: false,
        capacity: 0,
        localtionType: "storage",
        type: "lane",
      };

      state.lanes[lane.key] = lane;

      // const id = state.map.zoneRunning;
      // const lane = {
      //   key: id,
      //   id: id,
      //   name: format(state.default.zoneNameFormat, state.map.name, id),
      //   type: "zone",
      //   x: 0,
      //   y: 0,
      //   width: 320,
      //   height: 200,
      //   laneDirection: "Vertical",
      //   laneWidth: state.default.laneWidth,
      //   slotWidth: state.default.slotWidth,
      //   autoGenerate: false,
      //   capacity: 0,
      //   localtionType: "storage",
      // };
      // state.zones[id] = zone;
    },
    deleteZones: (state, action) => {
      let zoneIds = action.payload;

      for (const zoneId of zoneIds) {
        delete state.zones[zoneId];
      }
    },
    deleteLanes: (state, action) => {
      let lanes = action.payload;

      for (const lane of lanes) {
        delete state.lanes[lane];
      }
    },
    deleteSlots: (state, action) => {
      let slots = action.payload;

      for (const slot of slots) {
        delete state.slots[slot];
      }
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
      console.log("saveLocal");
    },

    loadLocal: (state, action) => {
      let loadKey = action.payload;
      let data = localStorage(loadKey);
      data = { ...state, ...data };

      state.zones = data.zones;
      state.map = data.map;
      state.default = data.default;
    },
    generateByZone: (state, action) => {
      let zoneId = action.payload;
      let zone = state.zones[zoneId];

      let lanes = generateLaneRectFromTemplateZone(zone);
      let slots = generateSlotRectFromTemplateZone(lanes, zone);

      for (const lane of lanes) {
        let key = `${lane.zone_id}_${lane.id}`;
        let name = format(
          state.default.laneNameFormat,
          state.map.name,
          zone.id,
          lane.id
        );

        state.lanes[key] = {
          ...lane,
          ...{ key, name, type: "lane" },
        };
      }

      for (const slot of slots) {
        let key = `${slot.zone_id}_${slot.lane_id}_${slot.id}`;
        let name = format(
          state.default.slotNameFormat,
          state.map.name,
          zone.id,
          slot.lane_id,
          slot.id
        );
        state.slots[key] = {
          ...slot,
          ...{ key, name, type: "slot" },
        };
      }
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
  updateZone,
  updateLane,
  updateSlot,
  addZone,
  addLane,
  deleteZones,
  deleteLanes,
  deleteSlots,
  updateMap,
  updateDefault,
  saveLocal,
  loadLocal,
  exportSQL,
  generateByZone,
  updateZoneOfLane,
} = mapManagementSlice.actions;

export default mapManagementSlice.reducer;
