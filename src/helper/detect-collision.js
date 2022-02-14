import { System as Collisions, Box } from "detect-collisions";

export const collisionBox = (box, elements) => {
  let boxRect = new Box({ x: box.x, y: box.y }, box.width, box.height);
  let collisions = new Collisions();

  let coll = [];

  for (const element of elements) {
    let elementRect = new Box(
      { x: element.x, y: element.y },
      element.width,
      element.height
    );

    if (collisions.checkCollision(boxRect, elementRect)) {
      coll.push({ id: element.key, type: element.type });
    }
  }

  return coll;
};
