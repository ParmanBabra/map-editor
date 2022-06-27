import moment from "moment-timezone";
import format from "format";
import _ from "lodash";
import { defaultSlot, ShipToGroupType } from "./constants";

function convertOriginXToBottomLeft(y, height, mapHeight) {
  let newY = Math.abs(y - mapHeight);
  let newYBottomLeft = newY - height;

  return [newY, newYBottomLeft];
}

function convertOriginYToOnboardY(y, mapHeight) {
  let newY = Math.abs(y - mapHeight);

  return [newY];
}

export const exportTemplateSlot = (template_slots, template_zones, map) => {
  let sqlSlots = [];

  let { height } = map.size;

  for (const key in template_slots) {
    const slot = template_slots[key];

    if (!slot.zone_id) continue;
    if (!slot.lane_id) continue;

    let zone = template_zones[slot.zone_id];

    if (!zone) continue;

    let [y, bottomLeftY] = convertOriginXToBottomLeft(
      slot.y,
      slot.height,
      height
    );

    let row = {
      id: slot.id,
      name: slot.name,
      available: true,
      createdate: getSQLDate(Date()),
      createby: map.updateBy,
      updatedate: getSQLDate(Date()),
      updateby: map.updateBy,
      warehouse_id: map.warehouseId,
      bound_box: {
        string: `box '((${slot.x}, ${y}),(${
          slot.x + slot.width
        }, ${bottomLeftY}))'`,
      },
      lane_id: slot.lane_id,
      zone_id: slot.zone_id,
      type: zone.localtionType,
      map_id: map.id,
      request_forklift_load: true,
      add_product: false,
      is_conveyor: zone.isConveyor,
      error_message: null,
    };

    let sql = generateSQLPerRow(
      row,
      ["id", "lane_id", "zone_id", "map_id", "warehouse_id"],
      "tbm_slot"
    );

    sqlSlots.push(sql);
  }

  return sqlSlots;
};

export const exportTemplateLane = (
  template_lanes,
  template_zones,
  map,
  defaultValue
) => {
  let sqlLanes = [];
  let sqlSlots = [];
  let { height } = map.size;
  let zones_lanes = {};

  for (const key in template_lanes) {
    let lane = template_lanes[key];

    if (!lane.zone_id) continue;

    let zone = template_zones[lane.zone_id];

    let [y, bottomLeftY] = convertOriginXToBottomLeft(
      lane.y,
      lane.height,
      height
    );

    let slotCount = calculateSlotCountLaneWithAutoGenerate(zone);

    let row = {
      id: lane.id,
      name: lane.name,
      createdate: getSQLDate(Date()),
      createby: map.updateBy,
      updatedate: getSQLDate(Date()),
      updateby: map.updateBy,
      warehouse_id: map.warehouseId,
      bound_box: {
        string: `box '((${lane.x}, ${y}),(${
          lane.x + lane.width
        }, ${bottomLeftY}))'`,
      },
      zone_id: lane.zone_id,
      capacity_count: slotCount / 2,
      slot_count: slotCount,
      map_id: map.id,
      ship_to_group_map_load_type_colour: "#FFF",
    };

    let sql = generateSQLPerRow(
      row,
      ["id", "zone_id", "map_id", "warehouse_id"],
      "tbm_lane"
    );

    sqlLanes.push(sql);

    if (!lane.autoGenerate) {
      continue;
    }

    if (!zones_lanes[lane.zone_id]) zones_lanes[lane.zone_id] = [];

    zones_lanes[lane.zone_id].push(lane);
  }

  for (const zone_id in zones_lanes) {
    let lanes = zones_lanes[zone_id];
    let zone = template_zones[zone_id];

    let rects = generateSlotRectFromTemplateZone(lanes, zone);

    for (const rect of rects) {
      let [y, bottomLeftY] = convertOriginXToBottomLeft(
        rect.y,
        rect.height,
        height
      );

      let row = {
        id: rect.id,
        name: format(
          defaultValue.slotNameFormat,
          map.name,
          zone.id,
          rect.lane_id,
          rect.id
        ),
        available: true,
        createdate: getSQLDate(Date()),
        createby: map.updateBy,
        updatedate: getSQLDate(Date()),
        updateby: map.updateBy,
        warehouse_id: map.warehouseId,
        bound_box: {
          string: `box '((${rect.x}, ${y}),(${
            rect.x + rect.width
          }, ${bottomLeftY}))'`,
        },
        lane_id: rect.lane_id,
        zone_id: zone.id,
        type: zone.localtionType,
        map_id: map.id,
        request_forklift_load: true,
        add_product: false,
        is_conveyor: zone.isConveyor,
        error_message: null,
      };

      let sql = generateSQLPerRow(
        row,
        ["id", "lane_id", "zone_id", "map_id", "warehouse_id"],
        "tbm_slot"
      );

      sqlSlots.push(sql);
    }
  }

  return [...sqlLanes, ...sqlSlots];
};

export const exportTemplateZone = (template_zones, map, defaultValue) => {
  let sqlZones = [];
  let sqlLanes = [];
  let sqlSlots = [];
  let { height } = map.size;

  for (const key in template_zones) {
    let zone = template_zones[key];
    let [y, bottomLeftY] = convertOriginXToBottomLeft(
      zone.y,
      zone.height,
      height
    );

    let row = {
      id: zone.id,
      name: zone.name,
      createdate: getSQLDate(Date()),
      createby: map.updateBy,
      updatedate: getSQLDate(Date()),
      updateby: map.updateBy,
      warehouse_id: map.warehouseId,
      map_id: map.id,
      capacity: zone.capacity,
      geom: {
        string: `box '((${zone.x}, ${y}),(${
          zone.x + zone.width
        }, ${bottomLeftY}))'::polygon`,
      },
      type: zone.localtionType,
      label_location: {
        string: `point '(${
          zone.x + zone.labelLocationX
        }, ${convertOriginYToOnboardY(zone.y + zone.labelLocationY, height)})'`,
      },
      progress_bar_rect: {
        string: `box '((${zone.x + zone.progressX}, ${convertOriginYToOnboardY(
          zone.y + zone.progressY,
          height
        )}),(${
          zone.x + zone.progressX + zone.progressWidth
        }, ${convertOriginYToOnboardY(
          zone.y + zone.progressY + zone.progressHeight,
          height
        )}))'`,
      },
      mark_location: {
        string: `point '(${
          zone.x + zone.markLocationX
        }, ${convertOriginYToOnboardY(zone.y + zone.markLocationY, height)})'`,
      },
      colour: zone.color,
      colour_text: zone.labelColor,
    };

    let sql = generateSQLPerRow(
      row,
      ["id", "map_id", "warehouse_id"],
      "tbm_zone"
    );

    sqlZones.push(sql);

    if (!zone.autoGenerate) continue;

    let rects = generateLaneRectFromTemplateZone(zone);

    for (const rect of rects) {
      let [y, bottomLeftY] = convertOriginXToBottomLeft(
        rect.y,
        rect.height,
        height
      );

      let slotCount = calculateSlotCountLaneWithAutoGenerate(zone);

      let row = {
        id: rect.id,
        name: format(defaultValue.laneNameFormat, map.name, zone.id, rect.id),
        createdate: getSQLDate(Date()),
        createby: map.updateBy,
        updatedate: getSQLDate(Date()),
        updateby: map.updateBy,
        warehouse_id: map.warehouseId,
        bound_box: {
          string: `box '((${rect.x}, ${y}),(${
            rect.x + rect.width
          }, ${bottomLeftY}))'`,
        },
        zone_id: zone.id,
        capacity_count: slotCount / 2,
        slot_count: slotCount,
        map_id: map.id,
        ship_to_group_map_load_type_colour: "#FFF",
      };

      let sql = generateSQLPerRow(
        row,
        ["id", "zone_id", "map_id", "warehouse_id"],
        "tbm_lane"
      );

      sqlLanes.push(sql);
    }
    rects = generateSlotRectFromTemplateZone(rects, zone);

    // index = 1;
    for (const rect of rects) {
      let [y, bottomLeftY] = convertOriginXToBottomLeft(
        rect.y,
        rect.height,
        height
      );

      let row = {
        id: rect.id,
        name: format(
          defaultValue.slotNameFormat,
          map.name,
          zone.id,
          rect.lane_id,
          rect.id
        ),
        available: true,
        createdate: getSQLDate(Date()),
        createby: map.updateBy,
        updatedate: getSQLDate(Date()),
        updateby: map.updateBy,
        warehouse_id: map.warehouseId,
        bound_box: {
          string: `box '((${rect.x}, ${y}),(${
            rect.x + rect.width
          }, ${bottomLeftY}))'`,
        },
        lane_id: rect.lane_id,
        zone_id: zone.id,
        type: zone.localtionType,
        map_id: map.id,
        request_forklift_load: true,
        add_product: false,
        is_conveyor: zone.isConveyor,
        error_message: null,
      };

      let sql = generateSQLPerRow(
        row,
        ["id", "lane_id", "zone_id", "map_id", "warehouse_id"],
        "tbm_slot"
      );

      sqlSlots.push(sql);
    }
  }

  return [...sqlZones, ...sqlLanes, ...sqlSlots];
};

export const exportMapInfo = (map) => {
  let row = {
    id: map.id,
    name: map.name,
    createdate: getSQLDate(Date()),
    createby: map.updateBy,
    updatedate: getSQLDate(Date()),
    updateby: map.updateBy,
    isactive: true,
    warehouse_id: map.warehouseId,
    is_putaway_default: false,
    view_box_map: {
      string: `box '((0, 0),(-${map.size.width}, -${map.size.height}))'`,
    },
    background_map: {
      string: `box '((0, 0),(-${map.size.width}, -${map.size.height}))'`,
    },
    is_request_forklift_gr_production: map.isRequestForkliftGRProduction,
    is_request_forklift_gr_sto_po: map.isRequestForkliftGRStoPo,
    is_request_forklift_gi: map.isRequestForkliftGI,
    is_tracking_location: map.isTrackingLocation,
    label_font_size: map.zoneTextSize,
    mark_size: map.makerSize,
  };

  let sql = generateSQLPerRow(row, ["id", "warehouse_id"], "tbm_map");
  return sql;
};

export const generateLaneRectFromTemplateZone = (zone) => {
  let maxI = zone.laneDirection === "Vertical" ? zone.width : zone.height;
  let lanes = [];
  let index = 1;
  let laneCount = Math.floor(maxI / zone.laneWidth);

  if (!zone.onlyOneSlot) {
    for (let i = 0; i <= maxI - zone.laneWidth; i += zone.laneWidth) {
      if (zone.laneDirection === "Vertical") {
        lanes.push({
          id: zone.wallHorizontal === "left" ? index : laneCount - index + 1,
          zone_id: zone.id,
          x: zone.x + i,
          y: zone.y,
          width: zone.laneWidth,
          height: zone.height,
        });
      } else {
        lanes.push({
          id: zone.wallVertical === "top" ? index : laneCount - index + 1,
          zone_id: zone.id,
          x: zone.x,
          y: zone.y + i,
          width: zone.width,
          height: zone.laneWidth,
        });
      }

      index++;
    }
  } else {
    lanes.push({
      id: index,
      zone_id: zone.id,
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height,
    });
  }

  return lanes;
};

export const generateSlotRectFromTemplateZone = (lanes, zone) => {
  let slots = [];

  if (!zone.onlyOneSlot) {
    for (const lane of lanes) {
      let index = 1;
      if (zone.laneDirection === "Vertical") {
        let slotCount = Math.floor(lane.height / zone.slotWidth);
        for (
          let i = 0;
          i <= lane.height - zone.slotWidth;
          i += zone.slotWidth
        ) {
          slots.push({
            ...defaultSlot,
            ...{
              id: zone.wallVertical === "top" ? index : slotCount - index + 1,
              lane_id: lane.id,
              zone_id: zone.id,
              x: lane.x + 0.25,
              y: zone.y + i + 0.25,
              width: lane.width - 0.5,
              height: zone.slotWidth - 0.5,
            },
          });

          index++;
        }
      } else {
        let slotCount = Math.floor(lane.width / zone.slotWidth);
        for (let i = 0; i <= lane.width - zone.slotWidth; i += zone.slotWidth) {
          slots.push({
            ...defaultSlot,
            ...{
              id:
                zone.wallHorizontal === "left" ? index : slotCount - index + 1,
              lane_id: lane.id,
              zone_id: zone.id,
              x: zone.x + i + 0.25,
              y: lane.y + 0.25,
              width: zone.slotWidth - 0.5,
              height: lane.height - 0.5,
            },
          });

          index++;
        }
      }
    }
  } else {
    slots.push({
      ...defaultSlot,
      ...{
        id: 1,
        zone_id: zone.id,
        lane_id: 1,
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
      },
    });
  }

  return slots;
};

export const generateSlotRectFromTemplateLane = (lane, zone) => {
  let slots = [];

  if (!lane.onlyOneSlot) {
    // for (const lane of lanes) {
    let index = 1;
    if (zone.laneDirection === "Vertical") {
      let slotCount = Math.floor(lane.height / zone.slotWidth);
      for (let i = 0; i <= lane.height - zone.slotWidth; i += zone.slotWidth) {
        slots.push({
          ...defaultSlot,
          ...{
            id: zone.wallVertical === "top" ? index : slotCount - index + 1,
            lane_id: lane.id,
            zone_id: zone.id,
            x: lane.x + 0.25,
            y: lane.y + i + 0.25,
            width: lane.width - 0.5,
            height: zone.slotWidth - 0.5,
          },
        });

        index++;
      }
    } else {
      let slotCount = Math.floor(lane.width / zone.slotWidth);
      for (let i = 0; i <= lane.width - zone.slotWidth; i += zone.slotWidth) {
        slots.push({
          ...defaultSlot,
          ...{
            id: zone.wallHorizontal === "left" ? index : slotCount - index + 1,
            lane_id: lane.id,
            zone_id: zone.id,
            x: lane.x + i + 0.25,
            y: lane.y + 0.25,
            width: zone.slotWidth - 0.5,
            height: lane.height - 0.5,
          },
        });

        index++;
      }
    }
    // }
  } else {
    slots.push({
      ...defaultSlot,
      ...{
        id: 1,
        zone_id: zone.id,
        lane_id: lane.id,
        x: lane.x,
        y: lane.y,
        width: lane.width,
        height: lane.height,
      },
    });
  }

  return slots;
};

function getSQLDate(date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss.000 Z");
}

function generateSQLPerRow(row, keyNames, tableName) {
  let fields = [];
  let values = [];
  let updateFields = [];

  for (let key in row) {
    const value = row[key];
    fields.push(key);

    if (typeof value == "number") {
      values.push(`${value}`);
    } else if (typeof value == "string") {
      values.push(`'${value}'`);
    } else if (typeof value == "boolean") {
      values.push(`${value}`);
    } else if (value == null) {
      values.push(`null`);
    } else if (typeof value == "object") {
      values.push(`${value.string}`);
    }

    updateFields.push(`${key} = EXCLUDED.${key}`);
  }

  return `INSERT INTO ${tableName} (${fields.join(", ")})
  VALUES (${values.join(", ")})
  ON CONFLICT (${keyNames.join(", ")}) DO UPDATE SET ${updateFields.join(
    ", "
  )};`;
}

export const calculateSlotCountZone = (zone, all_lanes, all_slots) => {
  let results = 0;
  if (zone.autoGenerate) {
    if (zone.laneDirection === "Vertical") {
      let laneCount = Math.floor(zone.width / zone.laneWidth);
      let slotCount = Math.floor(zone.height / zone.slotWidth);

      results += laneCount * slotCount;
    } else {
      let laneCount = Math.floor(zone.height / zone.laneWidth);
      let slotCount = Math.floor(zone.width / zone.slotWidth);

      results += laneCount * slotCount;
    }
  }

  let lanesInZone = _.values(all_lanes).filter((x) => x.zone_id === zone.id);

  for (const lane of lanesInZone) {
    results += calculateSlotCountLane(zone, lane, all_slots);
  }

  return results;
};

function calculateSlotCountLaneWithAutoGenerate(zone) {
  let results = 0;
  if (zone.laneDirection === "Vertical") {
    let laneCount = Math.floor(zone.width / zone.laneWidth);
    results += laneCount;
  } else {
    let laneCount = Math.floor(zone.height / zone.laneWidth);
    results += laneCount;
  }

  return results;
}

export const calculateSlotCountLane = (zone, lane, all_slots) => {
  let results = 0;
  if (lane.autoGenerate) {
    if (zone.laneDirection === "Vertical") {
      let slotCount = Math.floor(lane.height / zone.slotWidth);
      results += slotCount;
    } else {
      let slotCount = Math.floor(lane.width / zone.slotWidth);
      results += slotCount;
    }
  }

  let slotsInLane = _.values(all_slots).filter(
    (x) => x.zone_id === zone.id && x.lane_id === lane.id
  );

  results += slotsInLane.length;

  return results;
};

export const exportPriorites = (all_lanes, all_shipToGroups, map) => {
  const rows = [];
  const lanes = _.values(all_lanes);
  const shipToGroups = _.values(all_shipToGroups);
  const priorityTypes = ["10", "20"];

  for (const lane of lanes) {
    let priorites = _.orderBy(_.values(lane.priorites), (x) => x.key);
    let priorityIndex = 1;

    let shipToGroupAndPriorityType = [];

    for (const priority of priorites) {
      if (!priority.shipToGroup || priority.shipToGroup === "") {
        continue;
      }

      let row = {
        zone_id: lane.zone_id,
        ship_to_group: priority.shipToGroup,
        priority: priorityIndex,
        map_id: map.id,
        warehouse_id: map.warehouseId,
        load_type: priority.type,
        lane_id: lane.id,
      };

      let sql = generateSQLPerRow(
        row,
        [
          "zone_id",
          "ship_to_group",
          "map_id",
          "warehouse_id",
          "load_type",
          "lane_id",
        ],
        "cip_tbm_ship_to_group_map_zone"
      );
      rows.push(sql);
      shipToGroupAndPriorityType.push(
        `${priority.shipToGroup}_${priority.type}`
      );

      priorityIndex++;
    }

    for (const shipToGroup of shipToGroups) {
      for (const priorityType of priorityTypes) {
        let shipToGroupAndPriorityTypeKey = `${shipToGroup.id}_${priorityType}`;

        if (shipToGroupAndPriorityType.includes(shipToGroupAndPriorityTypeKey))
          continue;

        let row = {
          zone_id: lane.zone_id,
          ship_to_group: shipToGroup.id,
          priority: 99,
          map_id: map.id,
          warehouse_id: map.warehouseId,
          load_type: priorityType,
          lane_id: lane.id,
        };

        let sql = generateSQLPerRow(
          row,
          [
            "zone_id",
            "ship_to_group",
            "map_id",
            "warehouse_id",
            "load_type",
            "lane_id",
          ],
          "cip_tbm_ship_to_group_map_zone"
        );
        rows.push(sql);
      }
    }
  }
  return rows;
};

export const exportShipToGroups = (all_shipToGroups, map) => {
  const rows = [];
  const shipToGroups = _.values(all_shipToGroups);

  for (const shipToGroup of shipToGroups) {
    let row = {
      id: shipToGroup.id,
      description: shipToGroup.name,
      createdate: getSQLDate(Date()),
      createby: map.updateBy,
      updatedate: getSQLDate(Date()),
      updateby: map.updateBy,
      is_active: true,
      warehouse_id: map.warehouseId,
    };

    let sql = generateSQLPerRow(
      row,
      ["id", "warehouse_id"],
      "tbm_ship_to_group"
    );
    rows.push(sql);
  }

  for (const shipToGroup of shipToGroups) {
    let row = {
      ship_to_group: shipToGroup.id,
      load_type: ShipToGroupType.PP,
      createdate: getSQLDate(Date()),
      createby: map.updateBy,
      updatedate: getSQLDate(Date()),
      updateby: map.updateBy,
      colour_product: shipToGroup.ppColor,
      colour_lane: shipToGroup.ppColor,
      warehouse_id: map.warehouseId,
    };

    let sql = generateSQLPerRow(
      row,
      ["ship_to_group", "load_type", "warehouse_id"],
      "cip_tbt_ship_to_group_map_type"
    );
    rows.push(sql);

    let row2 = {
      ship_to_group: shipToGroup.id,
      load_type: ShipToGroupType.PM,
      createdate: getSQLDate(Date()),
      createby: map.updateBy,
      updatedate: getSQLDate(Date()),
      updateby: map.updateBy,
      colour_product: shipToGroup.pmColor,
      colour_lane: shipToGroup.pmColor,
      warehouse_id: map.warehouseId,
    };

    let sql2 = generateSQLPerRow(
      row2,
      ["ship_to_group", "load_type", "warehouse_id"],
      "cip_tbt_ship_to_group_map_type"
    );
    rows.push(sql2);
  }

  return rows;
};
