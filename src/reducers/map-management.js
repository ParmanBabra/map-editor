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
  exportTemplateLane,
  exportTemplateSlot,
  generateLaneRectFromTemplateZone,
  generateSlotRectFromTemplateZone,
  generateSlotRectFromTemplateLane,
  calculateSlotCountZone,
  calculateSlotCountLane,
} from "./../helper/export-zone";
import { TxtReader } from "txt-reader";
import Papa from "papaparse";

let keyList = "MAP_LIST";
let mapList = localStorage(keyList);

export const loadLocal = createAsyncThunk(
  "map-management/load-local",
  async (key, thunkAPI) => {
    let data = localStorage(key);

    return data;
  }
);

export const saveJson = createAsyncThunk(
  "map-management/save-json",
  async (_, thunkAPI) => {
    let data = { ...thunkAPI.getState().mapManagement };
    delete data.mapList;

    let shipToGroups = thunkAPI.getState().shipToGroupsManagement.shipToGroups;
    data.shipToGroups = shipToGroups;

    await downloadFile(data, `WH_${data.map.warehouseId}-MAP_${data.map.name}`);
  }
);

export const loadJson = createAsyncThunk(
  "map-management/load-json",
  async (file, thunkAPI) => {
    let text = await file.text();
    return JSON.parse(text);
  }
);

export const exportSql = createAsyncThunk(
  "map-management/export-sql",
  async (_, thunkAPI) => {
    let state = thunkAPI.getState().mapManagement;
    let { map, zones, lanes, slots } = state;
    let sql = exportMapInfo(map);
    let sql2 = exportTemplateZone(zones, map, state.default);
    let sql3 = exportTemplateLane(lanes, zones, map, state.default);
    let sql4 = exportTemplateSlot(slots, zones, map);

    let resultSql = [...[sql], ...sql2, ...sql3, ...sql4];

    console.log(resultSql);
    return Promise.resolve(resultSql);
  }
);

export const importLanes = createAsyncThunk(
  "map-management/import-lanes",
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

export const pasteLanePriorites = createAsyncThunk(
  "map-management/paste-lanes-priorites",
  async (destinationKey, thunkAPI) => {
    let { contents, selections } = thunkAPI.getState().selection;

    if (selections.length < 1) return;
    if (contents.type !== "LanePriorites") return;

    return { source: contents.value, destination: destinationKey };
  }
);

const loadData = (data, state) => {
  for (const key in data.zones) {
    let zone = data.zones[key];
    zone = {
      ...{
        color: "#FFFFFF",
        labelLocationX: 10,
        labelLocationY: 20,
        labelColor: "#000000",
        markLocationX: 0,
        markLocationY: 0,
        progressX: 0,
        progressY: 0,
        progressWidth: 0,
        progressHeight: 0,
        wallHorizontal: "left",
        wallVertical: "top",
      },
      ...zone,
    };
    data.zones[key] = zone;
  }

  for (const key in data.lanes) {
    let lane = data.lanes[key];
    lane = {
      ...{
        priorites: {},
        autoAdjustZone: true,
        autoGenerate: false,
        onlyOneSlot: false,
        localtionType: "storage",
        slotWidth: data.default.slotWidth,
        capacity: 0,
      },
      ...lane,
    };
    data.lanes[key] = lane;
  }

  state.map = { ...state.map, ...data.map };
  state.default = { ...state.default, ...data.default };
  state.zones = data.zones;
  state.lanes = data.lanes;

  return state;
};

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
        onlyOneSlot: false,
        isConveyor: false,
        capacity: 0,
        localtionType: "storage",
        color: "#FFFFFF",
        labelLocationX: 0,
        labelLocationY: 0,
        labelColor: "#000000",
        markLocationX: 0,
        markLocationY: 0,
        progressX: 0,
        progressY: 0,
        progressWidth: 0,
        progressHeight: 0,
        wallHorizontal: "left",
        wallVertical: "top",
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
        onlyOneSlot: false,
        isConveyor: false,
        capacity: 0,
        localtionType: "storage",
        color: "#FFFFFF",
        labelLocationX: 0,
        labelLocationY: 0,
        labelColor: "#000000",
        markLocationX: 0,
        markLocationY: 0,
        progressX: 0,
        progressY: 0,
        progressWidth: 0,
        progressHeight: 0,
        wallHorizontal: "left",
        wallVertical: "top",
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
        onlyOneSlot: false,
        isConveyor: false,
        capacity: 0,
        localtionType: "storage",
        color: "#FFFFFF",
        labelLocationX: 0,
        labelLocationY: 0,
        labelColor: "#000000",
        markLocationX: 0,
        markLocationY: 0,
        progressX: 0,
        progressY: 0,
        progressWidth: 0,
        progressHeight: 0,
        wallHorizontal: "left",
        wallVertical: "top",
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
      showZone: true,
      showLane: true,
      showSlot: true,
      showMaker: true,
      showProgress: true,
      freezingZone: false,
      freezingLane: true,
      freezingSlot: true,
      enableMove: true,
      showZoneRealColor: true,
      showLaneRealColor: true,
      zoneTextSize: 20,
      makerSize: 60,
      updateBy: "nakarsat",
      isRequestForkliftGRProduction: false,
      isRequestForkliftGRStoPo: false,
      isRequestForkliftGI: false,
      isTrackingLocation: false,
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
      const zone = action.payload;
      zone.capacity = Math.floor(
        calculateSlotCountZone(zone, state.lanes, state.slots) / 2
      );

      state.zones[action.payload.id] = zone;
    },
    updateLane: (state, action) => {
      const lane = action.payload;
      if (lane.zone_id) {
        const zone = { ...state.zones[lane.zone_id] };

        zone.capacity = Math.floor(
          calculateSlotCountZone(zone, state.lanes, state.slots) / 2
        );
        lane.capacity = Math.floor(
          calculateSlotCountLane(zone, lane, state.slots) / 2
        );

        state.zones[zone.id] = zone;
      }

      state.lanes[action.payload.key] = lane;
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
          lanesInZone = _.orderBy(
            lanesInZone,
            ["x"],
            [zone.wallHorizontal === "left" ? "asc" : "desc"]
          );
        } else {
          lanesInZone = _.orderBy(
            lanesInZone,
            ["y"],
            [zone.wallVertical === "top" ? "asc" : "desc"]
          );
        }

        let index = 1;
        for (const lane of lanesInZone) {
          lane.id = index;
          lane.zone_id = zone.id;
          lane.name = format(
            state.default.laneNameFormat,
            state.map.name,
            lane.zone_id,
            lane.id
          );
          index++;
        }
      } else {
        lane.zone_id = null;
        lane.id = null;
        lane.name = format(state.default.laneNameFormat, state.map.name, 0, 0);
      }
    },
    updateLanesOfZone: (state, action) => {
      let zone = state.zones[action.payload];
      let lanes = _.values(state.lanes);
      let laneInZoneOld = _.filter(lanes, (item) => item.zone_id === zone.id);
      let lanesInZone = collisionBox(zone, lanes);

      for (const lane of laneInZoneOld) {
        if (!lane.autoAdjustZone) continue;

        lane.id = null;
        lane.zone_id = null;
        lane.name = format(state.default.laneNameFormat, state.map.name, 0, 0);
      }

      let collisionLane = [];

      for (const laneInfo of lanesInZone) {
        let lane = state.lanes[laneInfo.id];
        collisionLane.push(lane);
      }

      if (collisionLane.length > 0) {
        if (zone.laneDirection === "Vertical") {
          collisionLane = _.orderBy(
            collisionLane,
            ["x"],
            [zone.wallHorizontal === "left" ? "asc" : "desc"]
          );
        } else {
          collisionLane = _.orderBy(
            collisionLane,
            ["y"],
            [zone.wallVertical === "top" ? "asc" : "desc"]
          );
        }

        let index = 1;
        for (const lane of collisionLane) {
          if (!lane.autoAdjustZone) continue;

          lane.id = index;
          lane.zone_id = zone.id;
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
        onlyOneSlot: false,
        isConveyor: false,
        capacity: 0,
        localtionType: "storage",
        color: "#FFFFFF",
        labelLocationX: 0,
        labelLocationY: 0,
        labelColor: "#000000",
        markLocationX: 0,
        markLocationY: 0,
        progressX: 0,
        progressY: 0,
        progressWidth: 0,
        progressHeight: 0,
        wallHorizontal: "left",
        wallVertical: "top",
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
        onlyOneSlot: false,
        capacity: 0,
        localtionType: "storage",
        type: "lane",
        priorites: {},
      };

      state.lanes[lane.key] = lane;
    },
    addPriority: (state, action) => {
      let lane = state.lanes[action.payload];
      let key = (new Date()).getTime();

      lane.priorites[key] = { key: key, shipToGroup: null, type: null };
    },
    updatePriority: (state, action) => {
      state.lanes[action.payload.id].priorites[action.payload.key] =
        action.payload.data;
    },
    deletePriority: (state, action) => {
      delete state.lanes[action.payload.id].priorites[action.payload.key];
    },
    deleteZones: (state, action) => {
      let zoneIds = action.payload;

      for (const zoneId of zoneIds) {
        delete state.zones[zoneId];
      }

      let zoneRunning = 0;
      for (const zone_id in state.zones) {
        let zone = state.zones[zone_id];
        zoneRunning = Math.max(zone.id, zoneRunning);
      }
      state.map.zoneRunning = zoneRunning;
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

    addZoneWithSelections: (state, action) => {
      if (action.payload.length === 0) return;

      let mapState = state;
      let p1 = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
      let p2 = { x: 0, y: 0 };
      let laneDirection = "";
      let maxSize = { width: 0, height: 0 };
      let lanesInZone = [];

      mapState.map.zoneRunning++;
      const zoneId = mapState.map.zoneRunning;
      for (const selection of action.payload) {
        switch (selection.type) {
          case "slot":
            // const slot = state.slots[selection.id];
            // p1.x = Math.min(p1.x, slot.x);
            // p1.y = Math.min(p1.y, slot.y);
            // p2.x = Math.max(p2.x, slot.x + slot.width);
            // p2.y = Math.max(p2.y, slot.y + slot.height);
            // slot.zone_id = zoneId;
            // state.slots[selection.id] = slot;
            break;
          case "lane":
            const lane = state.lanes[selection.id];
            p1.x = Math.min(p1.x, lane.x);
            p1.y = Math.min(p1.y, lane.y);
            p2.x = Math.max(p2.x, lane.x + lane.width);
            p2.y = Math.max(p2.y, lane.y + lane.height);
            lane.zone_id = zoneId;
            maxSize.width = Math.max(maxSize.width, lane.width);
            maxSize.height = Math.max(maxSize.height, lane.height);
            lanesInZone.push(lane);
            break;
          default:
            // const zone = state.zones[selection.id];
            // p1.x = Math.min(p1.x, zone.x);
            // p1.y = Math.min(p1.y, zone.y);
            // p2.x = Math.max(p2.x, zone.x + zone.width);
            // p2.y = Math.max(p2.y, zone.y + zone.height);
            break;
        }
      }

      const size = {
        x: p1.x,
        y: p1.y,
        width: p2.x - p1.x,
        height: p2.y - p1.y,
      };

      laneDirection =
        maxSize.width > maxSize.height ? "Horizontal" : "Vertical";

      const zone = {
        key: zoneId,
        id: zoneId,
        name: format(
          mapState.default.zoneNameFormat,
          mapState.map.name,
          zoneId
        ),
        type: "zone",
        x: size.x,
        y: size.y,
        width: size.width,
        height: size.height,
        laneDirection: laneDirection,
        laneWidth:
          laneDirection === "Horizontal" ? maxSize.height : maxSize.width,
        slotWidth: mapState.default.slotWidth,
        autoGenerate: false,
        onlyOneSlot: false,
        isConveyor: false,
        capacity: 0,
        localtionType: "storage",
        color: "#FFFFFF",
        labelLocationX: 0,
        labelLocationY: 0,
        labelColor: "#000000",
        markLocationX: 0,
        markLocationY: 0,
        progressX: 0,
        progressY: 0,
        progressWidth: 0,
        progressHeight: 0,
        wallHorizontal: "left",
        wallVertical: "top",
      };

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

        state.lanes[lane.key] = lane;
        index++;
      }

      state.zones[zone.key] = zone;
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
    makerToCenter: (state, action) => {
      let zoneId = action.payload;
      let zone = state.zones[zoneId];
      zone.markLocationX = zone.width / 2;
      zone.markLocationY = zone.height / 2;
    },

    progressAdjust: (state, action) => {
      let zoneId = action.payload;
      let zone = state.zones[zoneId];

      let height = zone.height * 0.1;
      let width = zone.width * 0.8;

      zone.progressX = zone.width * 0.1;
      zone.progressY = zone.height - height - zone.height * 0.1;
      zone.progressWidth = width;
      zone.progressHeight = height;
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
    generateByLane: (state, action) => {
      let laneId = action.payload;
      let lane = state.lanes[laneId];
      let zone = state.zones[lane.zone_id];

      let slots = generateSlotRectFromTemplateLane(lane, zone);

      for (const slot of slots) {
        let key = `${slot.zone_id}_${slot.lane_id}_${slot.id}`;
        let name = format(
          state.default.slotNameFormat,
          state.map.name,
          slot.zone_id,
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
    builder.addCase(loadLocal.fulfilled, (state, action) => {
      state.zones = {};
      state.lanes = {};
      state.slots = {};

      let data = { ...state, ...action.payload };

      state = loadData(data, state);
    });
    builder.addCase(importLanes.fulfilled, (state, action) => {
      let mapSize = {
        width: Math.max(
          state.map.size.width,
          _.maxBy(action.payload, (item) => parseFloat(item.tX)).tX
        ),
        height: Math.max(
          state.map.size.height,
          _.maxBy(action.payload, (item) => parseFloat(item.tY)).tY
        ),
      };

      for (const laneInfo of action.payload) {
        if (!laneInfo.tX || !laneInfo.tY || !laneInfo.width || !laneInfo.height)
          continue;

        const lane = {
          key: uuidv4(),
          id: null,
          name: format(state.default.laneNameFormat, state.map.name, 0, 0),
          zone_id: null,
          x: parseFloat(laneInfo.bX),
          y: parseFloat(laneInfo.tY) * -1 + mapSize.height,
          width: parseFloat(laneInfo.width),
          height: parseFloat(laneInfo.height),
          slotWidth: state.default.slotWidth,
          autoAdjustZone: true,
          autoGenerate: false,
          onlyOneSlot: false,
          capacity: 0,
          localtionType: "storage",
          type: "lane",
          priorites: {},
        };
        state.lanes[lane.key] = lane;
      }

      // console.log(mapSize);

      state.map = { ...state.map, ...{ size: mapSize } };
    });
    builder.addCase(loadJson.fulfilled, (state, action) => {
      state.zones = {};
      state.lanes = {};
      state.slots = {};

      delete action.payload.shipToGroups;
      let data = { ...state, ...action.payload };

      state = loadData(data, state);
    });

    builder.addCase(pasteLanePriorites.fulfilled, (state, action) => {
      let sourceKey = action.payload.source;
      let destinationKey = action.payload.destination;
      console.log(action.payload);

      state.lanes[destinationKey].priorites = state.lanes[sourceKey].priorites;
    });
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
  exportSQL,
  generateByZone,
  generateByLane,
  updateZoneOfLane,
  updateLanesOfZone,
  addZoneWithSelections,
  makerToCenter,
  progressAdjust,
  addPriority,
  deletePriority,
  updatePriority,
} = mapManagementSlice.actions;

export default mapManagementSlice.reducer;
