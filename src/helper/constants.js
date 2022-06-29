import { v4 as uuidv4 } from "uuid";

export const rectBorder = { max: 8, min: 1 };

export const EditorMode = {
  None: "none",
  Layers: "layers",
  ShipToGroup: "ship-to-group",
  Map: "map",
  MergeTool: "merge-tool",
};

export const ContentType = {
  None: "none",
  LanePriorites: "lane-priorites",
  LaneProperties: "lane-properties",
  ZoneProperties: "zone-properties",
};

export const defaultZone = {
  key: uuidv4(),
  id: 1,
  name: null,
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
  layer: 1,
};

export const defaultLane = {
  key: null,
  id: null,
  name: null,
  zone_id: null,
  x: 0,
  y: 0,
  width: 50,
  height: 200,
  slotWidth: 50,
  autoAdjustZone: true,
  autoGenerate: false,
  onlyOneSlot: false,
  capacity: 0,
  localtionType: "storage",
  type: "lane",
  priorites: {},
  layer: 1,
};

export const defaultSlot = {
  key: null,
  id: null,
  name: null,
  zone_id: null,
  lane_id: null,
  x: 0,
  y: 0,
  width: 50,
  height: 200,
  layer: 1,
};

export const defaultMarker = {
  key: null,
  x: 0,
  y: 0,
  type: "marker",
  z: 0,
  product_id: "00445405.01",
  forklift_name: "01",
  // OnBoardLocationX: () => {
  //   return this.x;
  // },
  // OnBoardLocationY: () => {
  //   return this.y;
  // },
};

export const defaultLayer = {
  key: null,
  name: null,
  visible: true,
  editable: true,
  isDefault: false,
  opacity: 1,
};

export const SourceMatchedLayerOptions = {
  NewLayer: "new-layer",
  DeleteSourceElement: "delete-source-element",
};

export const ShipToGroupType = {
  PP: 10,
  PM: 20,
};
