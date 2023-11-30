const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  function returnAllPoints(startX, startY, endX, endY) {
    if (startX - endX > 0) {
      return new Array(startX - endX + 1)
        .fill(1)
        .map((_, index) => [startY, endX + index]);
    } else if (startX - endX < 0) {
      return new Array(endX - startX + 1)
        .fill(1)
        .map((_, index) => [startY, startX + index]);
    } else if (startY - endY > 0) {
      return new Array(startY - endY + 1)
        .fill(1)
        .map((_, index) => [endY + index, startX]);
    } else if (startY - endY < 0) {
      return new Array(endY - startY + 1)
        .fill(1)
        .map((_, index) => [startY + index, startX]);
    } else {
      return [];
    }
  }

  const rockGraph = data
    .split(/\r?\n/)
    .map((line) => {
      const coordinates = line.split(/ -> /);
      let output = [];
      for (let index = 1; index < coordinates.length; index++) {
        const currentCoordinate = coordinates[index];
        const previousCoordinate = coordinates[index - 1];
        const [currentX, currentY] = currentCoordinate.split(",").map(Number);
        const [previousX, previousY] = previousCoordinate
          .split(",")
          .map(Number);
        output = [
          ...output,
          ...returnAllPoints(previousX, previousY, currentX, currentY),
        ];
      }
      return output;
    })
    .flat();

  const { minX, minY, maxX, maxY } = rockGraph.reduce(
    (prevState, current) => {
      const [x, y] = current;
      const newState = { ...prevState };
      if (x > newState.maxX) {
        newState.maxX = x;
      }
      if (y < newState.minY) {
        newState.minY = y;
      }
      if (y > newState.maxY) {
        newState.maxY = y;
      }
      return newState;
    },
    {
      minX: 0,
      minY: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    }
  );

  const graph = new Array(maxX - minX + 1)
    .fill(".")
    .map(() => new Array(maxY - minY + 1).fill("."));

  const GROUND_FACTOR = 1000;

  const graphWithFloor = new Array(maxX - minX + 3)
    .fill(".")
    .map(() => new Array(maxY - minY + GROUND_FACTOR).fill("."));

  for (const point of rockGraph) {
    const [pointX, pointY] = point;
    const x = pointX - minX;
    const y = pointY - minY;
    graph[x][y] = "#";
    graphWithFloor[x][y + GROUND_FACTOR / 2] = "#";
  }

  for (const index in new Array(maxY - minY + GROUND_FACTOR).fill(1)) {
    graphWithFloor[graphWithFloor.length - 1][index] = "#";
  }

  const arrayOfObstracles = ["#", "o"];

  function addSand(graph, positionModifier = 0) {
    const sandLocation = [0, 500 - minY + positionModifier];
    let blockAtRest = false;

    if(arrayOfObstracles.indexOf(
      graph[sandLocation[0] + 1][sandLocation[1] + 1]
    ) !== -1){
      return !blockAtRest;
    }

    while (
      !blockAtRest &&
      sandLocation[0] <= graph.length &&
      sandLocation[0] >= 0 &&
      sandLocation[1] <= graph[0].length &&
      sandLocation[1] >= 0
    ) {
      // If the sand falls on the right side
      if (sandLocation[0] + 1 >= graph.length) {
        break;
      }

      // Try to move one step down - Increase x by one
      if (
        arrayOfObstracles.indexOf(
          graph[sandLocation[0] + 1][sandLocation[1]]
        ) === -1
      ) {
        sandLocation[0] = sandLocation[0] + 1;
        // Try to move one step down and left - Increase x by one and Decrease y by one
      } else if (
        arrayOfObstracles.indexOf(
          graph[sandLocation[0] + 1][sandLocation[1] - 1]
        ) === -1
      ) {
        if (sandLocation[1] - 1 < 0) {
          break;
        }
        sandLocation[0] = sandLocation[0] + 1;
        sandLocation[1] = sandLocation[1] - 1;
        // Try to move one step down and right - Increase x by one and Increase y by one
      } else if (
        arrayOfObstracles.indexOf(
          graph[sandLocation[0] + 1][sandLocation[1] + 1]
        ) === -1
      ) {
        if (sandLocation[1] + 1 > graph[0].length) {
          break;
        }
        sandLocation[0] = sandLocation[0] + 1;
        sandLocation[1] = sandLocation[1] + 1;
      } else {
        blockAtRest = true;
        graph[sandLocation[0]][sandLocation[1]] = arrayOfObstracles[1];
      }
    }
    return !blockAtRest;
  }

  // Part 1
  let count = 0;
  while (!addSand(graph)) {
    count++;
  }
  console.log("Count : ", count);
  
  // Part 2
  count = 0;
  while (!addSand(graphWithFloor, GROUND_FACTOR/2)) {
    count++;
  }
  console.log("Count (with floor) : ", count+1);

} catch (err) {
  console.error(err);
}
