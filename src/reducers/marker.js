import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { convertOriginYToOnboardY } from "./../helper/export-zone";
import { defaultMarker } from "./../helper/constants";

export const moveProduct = createAsyncThunk(
  "marker/send-move-product",
  async ({ key }, thunkAPI) => {
    let server =
      thunkAPI.getState().marker.servers[
        thunkAPI.getState().marker.currentServer
      ];

    let { apiKey, id, size } = thunkAPI.getState().mapManagement.map;
    let marker = thunkAPI.getState().marker.markers[key];

    if (!server) throw new Error("Server not found");
    if (!marker) throw new Error("Marker not found");

    let { product_id, forklift_name } = marker;
    let [y] = convertOriginYToOnboardY(marker.y, size.height);

    await axios({
      url: `${server.OnBoardAPI}/cip/Folklift/UpdateMovement`,
      method: "post",
      headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
      data: {
        movementType: "Move",
        mapId: id,
        palletId: product_id,
        palletNumber: 1,
        location: `${marker.x},${y},${marker.z}`,
        jobName: null,
        folkliftId: forklift_name,
        shipmentID: null,
        locationName: null,
      },
    });

    return true;
  }
);

export const popConveyor = createAsyncThunk(
  "marker/send-pop-conveyor",
  async ({ key }, thunkAPI) => {
    return null;
  }
);

export const markerSlice = createSlice({
  name: "markers",
  initialState: {
    markers: {},
    folklifts: {
      "01": { key: "01", name: "TCCB-01" },
      10: { key: "10", name: "TCCB-02" },
      12: { key: "12", name: "TCCB-03" },
      13: { key: "13", name: "TCCB-04" },
      "05": { key: "05", name: "TCCB-05" },
    },
    servers: {
      localhost: { OnBoardAPI: "http://192.168.148.237:8006", key: "localhost" },
      stragging: { OnBoardAPI: "", key: "stragging" },
      production: { OnBoardAPI: "", key: "production" },
    },
    currentServer: "localhost",
  },
  reducers: {
    updateServer: (state, action) => {
      state.currentServer = action.payload;
    },
    addMarker: (state, action) => {
      const marker = {
        ...defaultMarker,
        ...{
          key: uuidv4(),
        },
      };

      state.markers[marker.key] = marker;
    },
    updateMarker: (state, action) => {
      const marker = action.payload;

      state.markers[marker.key] = marker;
    },
    deleteMarkers: (state, action) => {
      for (const key of action.payload) {
        delete state.markers[key];
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(moveProduct.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const { addMarker, updateMarker, deleteMarkers, updateServer } =
  markerSlice.actions;

export default markerSlice.reducer;
