const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const partOneY = 2000000;
  const partTwoMax = partOneY * 2;

  const sensorsAndBeacons = data.split(/\r?\n/).map((line) => {
    const [sensor, beacon] = line
      .replace(
        /^.*x=(\-?\d+)\, y=(\-?\d+).*x=(\-?\d+)\, y=(\-?\d+)/,
        "[$1,$2]to[$3,$4]"
      )
      .split(/to/)
      .map(eval);
    return {
      sensor,
      beacon,
    };
  });

  function distanceBetweenPoints(pointA, pointB) {
    const [aX, aY] = pointA;
    const [bX, bY] = pointB;
    return Math.abs(aX - bX) + Math.abs(aY - bY);
  }

  const partOneSet = new Set();
  const sensorsAndBeaconsSet = new Set();
  const sensorsDistance = new Set();
  const positiveLines = new Set();
  const negativeLines = new Set();

  // Marking all the Sensors, Beacons and range of values for given line
  for (const entry of sensorsAndBeacons) {
    const { sensor, beacon } = entry;
    const [sensorX, sensorY] = sensor;

    sensorsAndBeaconsSet.add(JSON.stringify(sensor));
    sensorsAndBeaconsSet.add(JSON.stringify(beacon));

    const distance = distanceBetweenPoints(sensor, beacon);

    sensorsDistance.add(JSON.stringify([sensor, distance]));

    const yMin = sensorY - distance,
      yMax = sensorY + distance;

    if (partOneY >= yMin && partOneY <= yMax) {
      const xDiff = distance - Math.abs(partOneY - sensorY);
      partOneSet.add([sensorX - xDiff, sensorX + xDiff]);
    }

    positiveLines.add(sensorX - sensorY - distance);
    positiveLines.add(sensorX - sensorY + distance);
    negativeLines.add(sensorX + sensorY - distance);
    negativeLines.add(sensorX + sensorY + distance);
  }
  const sensorAndBeaconArray = Array.from(sensorsAndBeaconsSet).map(JSON.parse);
  const beacons = new Set(
    sensorAndBeaconArray.filter(([_, y]) => y === partOneY).map(([x]) => x)
  );

  // Part 1
  const uniqueSet = new Set();
  partOneSet.forEach((set) => {
    const [setMinX, setMaxX] = set;
    new Array(setMaxX - setMinX + 1).fill(1).forEach((_, index) => {
      const value = setMinX + index;
      if (!beacons.has(value)) {
        uniqueSet.add(value);
      }
    });
  });
  console.log("Unique Set : ", uniqueSet.size);

  // Part 2
  const equationSum = { positive: new Set(), negative: new Set() };

  const positiveLinesArray = Array.from(positiveLines);
  const negativeLinesArray = Array.from(negativeLines);

  for (let index = 0; index < positiveLinesArray.length; index++) {
    for (
      let innerIndex = index + 1;
      innerIndex < negativeLinesArray.length;
      innerIndex++
    ) {
      if (
        Math.abs(positiveLinesArray[index] - positiveLinesArray[innerIndex]) ===
        2
      ) {
        equationSum.positive.add(
          Math.min(positiveLinesArray[index], positiveLinesArray[innerIndex]) +
            1
        );
      }
      if (
        Math.abs(negativeLinesArray[index] - negativeLinesArray[innerIndex]) ===
        2
      ) {
        equationSum.negative.add(
          Math.min(negativeLinesArray[index], negativeLinesArray[innerIndex]) +
            1
        );
      }
    }
  }

  const possibleValue = {};
 
  equationSum.positive.forEach((possiblePositive) => {
    equationSum.negative.forEach((possibleNegative) => {
      const [x, y] = [
        (possiblePositive + possibleNegative) / 2,
        (possibleNegative - possiblePositive) / 2,
      ];
      if (x >= 0 && x <= partTwoMax && y >= 0 && y <= partTwoMax) {
        let isInRegion = false;
        sensorsDistance.forEach((entry) => {
          const [sensor, distance] = JSON.parse(entry);
          if (distanceBetweenPoints([x, y], sensor) < distance) {
            isInRegion = true;
          }
        });
        if (!isInRegion) {
          possibleValue.x = x;
          possibleValue.y = y;
        }
      }
    });
  });

  const {x, y} = possibleValue;
  const score = x * 4000000 + y;
  console.log("Score : ", score);
} catch (err) {
  console.error(err);
}
