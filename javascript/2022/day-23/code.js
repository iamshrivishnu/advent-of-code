const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const map = data.split(/\r?\n/).map((line) => line.trim().split(""));
  const elfs = [];

  for (let iIndex = 0; iIndex < map.length; iIndex++) {
    for (let jIndex = 0; jIndex < map[0].length; jIndex++) {
      if (map[iIndex][jIndex] === "#") {
        elfs.push([iIndex + 1, jIndex + 1]);
      }
    }
  }

  const directions = ["N", "S", "W", "E"];

  function rotateDirection() {
    directions.push(directions.shift());
  }

  function convertToString(param) {
    return param.join(",");
  }

  function hasIntersection(array1, array2) {
    const newArray1 = array1.map(convertToString);
    const newArray2 = array2.map(convertToString);
    return (
      Array.from(new Set([...newArray1, ...newArray2])).length !==
      [...newArray1, ...newArray2].length
    );
  }

  function isSameArray(array1, array2) {
    const newArray1 = array1.map(convertToString);
    const newArray2 = array2.map(convertToString);
    const combinedArray = Array.from(new Set([...newArray1, ...newArray2]));
    return (
      combinedArray.length === newArray1.length &&
      combinedArray.length === newArray2.length
    );
  }

  function getPossibleLocations(x, y, direction, otherPoints) {
    if (direction === "W") {
      const positions = [];
      for (let j = x - 1; j <= x + 1; j++) {
        positions.push([j, y - 1]);
      }
      if (!hasIntersection(positions, otherPoints)) {
        return [x, y - 1];
      }
    } else if (direction === "E") {
      const positions = [];
      for (let j = x - 1; j <= x + 1; j++) {
        positions.push([j, y + 1]);
      }
      if (!hasIntersection(positions, otherPoints)) {
        return [x, y + 1];
      }
    } else if (direction === "N") {
      const positions = [];
      for (let j = y - 1; j <= y + 1; j++) {
        positions.push([x - 1, j]);
      }
      if (!hasIntersection(positions, otherPoints)) {
        return [x - 1, y];
      }
    } else if (direction === "S") {
      const positions = [];
      for (let j = y - 1; j <= y + 1; j++) {
        positions.push([x + 1, j]);
      }
      if (!hasIntersection(positions, otherPoints)) {
        return [x + 1, y];
      }
    }
    return null;
  }

  function getNextLocation(index) {
    const [x, y] = elfs[index];
    const otherPoints = elfs.filter((_, currentIndex) => currentIndex != index);
    const possibleLocations = [];
    for (const direction of directions) {
      const position = getPossibleLocations(x, y, direction, otherPoints);
      possibleLocations.push(position);
    }

    const filteredLocations = possibleLocations.filter((item) => item);
    if (
      filteredLocations.length === directions.length ||
      filteredLocations.length === 0
    ) {
      return [x, y];
    } else {
      return filteredLocations[0];
    }
  }

  function moveElfs() {
    const nextMove = [];
    const count = {};
    for (let i = 0; i < elfs.length; i++) {
      const nextLocation = getNextLocation(i);
      nextMove.push(nextLocation);
      const key = nextLocation.join(",");
      count[key] = (count[key] || 0) + 1;
    }

    for (let i = 0; i < elfs.length; i++) {
      const countForKey = count[nextMove[i].join(",")];
      if (countForKey === 1) {
        elfs[i] = nextMove[i];
      }
    }
  }

  function getEmptySpots() {
    return elfs.reduce(
      (prevState, current) => {
        const [x, y] = current;
        return {
          minX: Math.min(x, prevState.minX),
          maxX: Math.max(x, prevState.maxX),
          minY: Math.min(y, prevState.minY),
          maxY: Math.max(y, prevState.maxY),
        };
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
      }
    );
  }

  let stepWithNoChange = -1;
  let freeSpots = 0;
  // Puzzle One
  for (let i = 0; stepWithNoChange === -1; i++) {
    console.log("Index: ", i + 1);
    const oldElfs = elfs.map((entry) => [...entry]);
    moveElfs();
    rotateDirection();
    if (i === 9) {
      const { minX, maxX, minY, maxY } = getEmptySpots();
      const totalSpots = (maxX - minX + 1) * (maxY - minY + 1);
      freeSpots = totalSpots - elfs.length;
    }
    if (isSameArray(elfs, oldElfs)) {
      stepWithNoChange = i + 1;
      break;
    }
  }
  console.log("Free Spots: ", freeSpots);

  //  Puzzle Two
  console.log("Total Steps: ", stepWithNoChange);
} catch (err) {
  console.error(err);
}
