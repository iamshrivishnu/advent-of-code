const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  // const data = fs.readFileSync("testData.txt", "UTF-8");

  const [mapBlock, directionsBlock] = data.split(/\r?\n\r?\n/);
  const mapWidth = Math.max(
    ...mapBlock.split(/\r?\n/).map((line) => line.length)
  );

  const startIndex = [];

  const map = mapBlock.split(/\r?\n/).map((line, lineIndex) => {
    const row = new Array(mapWidth).fill(-1);
    const lineSplit = line.split("");
    for (const index in lineSplit) {
      const value = lineSplit[index];
      if (value === ".") {
        if (lineIndex === 0 && startIndex.length === 0) {
          startIndex.push(lineIndex, Number(index));
        }
        row[index] = 1;
      } else if (value === "#") {
        row[index] = 0;
      }
    }
    return row;
  });

  const DIRECTION = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0], // Up
  ];

  let currentDirection = 0;
  const currentPosition = [...startIndex];

  function turn(towards) {
    const towardsValue = towards === "R" ? 1 : -1;
    currentDirection =
      (currentDirection + towardsValue + DIRECTION.length) % DIRECTION.length;
  }

  function addValues(array1, array2) {
    return [array1[0] + array2[0], array1[1] + array2[1]];
  }

  function moveSteps(steps) {
    let newPosition = [...currentPosition];
    for (let i = 0; i < steps; i++) {
      const resultPosition = addValues(
        newPosition,
        DIRECTION[currentDirection]
      );
      // console.log(newPosition)

      // If result is open tile
      if (map[resultPosition[0]]?.[resultPosition[1]] === 1) {
        newPosition = [...resultPosition];
        // console.log("Tile so updated new position ", newPosition)
        continue;
      }

      // If result is in wall
      if (map[resultPosition[0]]?.[resultPosition[1]] === 0) {
        // console.log("Wall so not updating new position ", newPosition)
        break;
      }

      // If the next position is to be rolled over
      if (
        map[resultPosition[0]]?.[resultPosition[1]] === -1 ||
        !map[resultPosition[0]]?.[resultPosition[1]]
      ) {
        if (currentDirection === 0) {
          // The current direction is right
          for (let j = 0; j < resultPosition[1]; j++) {
            if (map[resultPosition[0]]?.[j] === 1) {
              newPosition[1] = j;
              // console.log("Found tile at ",newPosition)
              break;
            } else if (map[resultPosition[0]]?.[j] === 0) {
              break;
            }
          }
          if (newPosition[1] + 1 === resultPosition[1]) {
            break;
          }
        } else if (currentDirection === 1) {
          // The current direction is down
          for (let j = 0; j < resultPosition[0]; j++) {
            if (map[j]?.[resultPosition[1]] === 1) {
              newPosition = [j, resultPosition[1]];
              break;
            } else if (map[j]?.[resultPosition[1]] === 0) {
              break;
            }
          }
          if (newPosition[0] + 1 === resultPosition[0]) {
            break;
          }
        } else if (currentDirection === 2) {
          // The current direction is left
          for (let j = mapWidth; j >= resultPosition[1]; j--) {
            if (map[resultPosition[0]]?.[j] === 1) {
              newPosition = [resultPosition[0], j];
              break;
            } else if (map[resultPosition[0]]?.[j] === 0) {
              break;
            }
          }
          if (newPosition[1] - 1 === resultPosition[1]) {
            break;
          }
        } else if (currentDirection === 3) {
          // The current direction is up
          for (let j = map.length; j >= resultPosition[0]; j--) {
            if (map[j]?.[resultPosition[1]] === 1) {
              newPosition = [j, resultPosition[1]];
              break;
            } else if (map[j]?.[resultPosition[1]] === 0) {
              break;
            }
          }
          if (newPosition[0] - 1 === resultPosition[0]) {
            break;
          }
        }
      }
    }
    // console.log("New Position: ",newPosition)
    currentPosition[0] = newPosition[0];
    currentPosition[1] = newPosition[1];
  }

  const directions = directionsBlock.split("").reduce((prevState, current) => {
    const lastValue = prevState[prevState.length - 1];
    if (/(R|L)/.test(current)) {
      return [...prevState, current];
    } else if (!lastValue) {
      return [...prevState, Number(current)];
    } else {
      if (/(R|L)/.test(lastValue)) {
        return [...prevState, Number(current)];
      } else {
        return [...prevState.slice(0, -1), lastValue * 10 + Number(current)];
      }
    }
  }, []);

  directions.forEach((value) => {
    if (/(R|L)/.test(value)) {
      turn(value);
    } else {
      moveSteps(value);
    }
    // console.log(currentPosition," ",currentDirection," ",value)
  });

  // console.log(directions)

  // Part 1
  console.log(
    "Score: ",
    1000 * (currentPosition[0] + 1) +
      4 * (currentPosition[1] + 1) +
      currentDirection
  );
  // console.log("Root: ",numericValue.get('root'))

  // Part 2
} catch (err) {
  console.error(err);
}
