import moment from "moment-timezone";
import format from "format";

export const exportTemplateZone = (template_zones, map, defaultValue) => {
  let sqlZones = [];
  let sqlLanes = [];
  let sqlSlots = [];
  let { width, height } = map.size;

  console.log(template_zones);

  function convertOriginXToBottomLeft(y, height, mapHeight) {
    let newY = Math.abs(y - mapHeight);
    let newYBottomLeft = newY - height;

    return [newY, newYBottomLeft];
  }

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
      label_location: null,
      progress_bar_rect: null,
      mark_location: null,
      colour: null,
      colour_text: null,
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
        capacity_count: 0,
        slot_count: 0,
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
        is_conveyor: false,
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
  };

  let sql = generateSQLPerRow(row, ["id", "warehouse_id"], "tbm_map");
  return sql;
};

export const generateLaneRectFromTemplateZone = (zone) => {
  let maxI = zone.laneDirection === "Vertical" ? zone.width : zone.height;
  let lanes = [];
  let index = 1;
  for (let i = 0; i <= maxI - zone.laneWidth; i += zone.laneWidth) {
    if (zone.laneDirection === "Vertical") {
      lanes.push({
        id: index,
        zone_id: zone.id,
        x: zone.x + i,
        y: zone.y,
        width: zone.laneWidth,
        height: zone.height,
      });
    } else {
      lanes.push({
        id: index,
        zone_id: zone.id,
        x: zone.x,
        y: zone.y + i,
        width: zone.width,
        height: zone.laneWidth,
      });
    }

    index++;
  }

  return lanes;
};

export const generateSlotRectFromTemplateZone = (lanes, zone) => {
  let slots = [];

  for (const lane of lanes) {
    let index = 1;
    if (zone.laneDirection === "Vertical") {
      for (let i = 0; i <= zone.height - zone.slotWidth; i += zone.slotWidth) {
        slots.push({
          id: index,
          lane_id: lane.id,
          zone_id: zone.id,
          x: lane.x + 0.25,
          y: zone.y + i + 0.25,
          width: zone.laneWidth - 0.5,
          height: zone.slotWidth - 0.5,
        });

        index++;
      }
    } else {
      for (let i = 0; i <= zone.width - zone.slotWidth; i += zone.slotWidth) {
        slots.push({
          id: index,
          lane_id: lane.id,
          zone_id: zone.id,
          x: zone.x + i + 0.25,
          y: lane.y + 0.25,
          width: zone.slotWidth - 0.5,
          height: zone.laneWidth - 0.5,
        });

        index++;
      }
    }
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
