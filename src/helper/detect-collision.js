import { System as Collisions, Box } from "detect-collisions";
import { getOverlapSize, getAreaSize } from "overlap-area";

export const collisionBox = (box, elements) => {
  let boxRect = new Box({ x: box.x, y: box.y }, box.width, box.height);
  let boxPoints = boxRect.calcPoints.map((v) => [
    boxRect.pos.x + v.x,
    boxRect.pos.y + v.y,
  ]);
  let collisions = new Collisions();
  let coll = [];
  let boxArea = getAreaSize(boxPoints);

  for (const element of elements) {
    let elementRect = new Box(
      { x: element.x, y: element.y },
      element.width,
      element.height
    );

    let elementPoints = elementRect.calcPoints.map((v) => [
      elementRect.pos.x + v.x,
      elementRect.pos.y + v.y,
    ]);

    let minArea = Math.min(getAreaSize(elementPoints), boxArea);
    let overlapArea = getOverlapSize(boxPoints, elementPoints);

    if (collisions.checkCollision(boxRect, elementRect)) {
      coll.push({
        id: element.key,
        type: element.type,
        area: overlapArea,
        percentOverlap: overlapArea / minArea,
      });
    }
  }

  return coll;
};
