const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const jets = data.split("").map((direction) => (direction === ">" ? 1 : -1));

  const rocks = [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ];

  const solidState = new Array(7).fill(1).map((_, index) => [index, -1]);
  const solidStateCopy = solidState.map(item=>[...item]);

  const visitedState = [];
  const heightState = [];

  let rockIndex = 0,
    jetIndex = 0,
    height = 0;

  function ifHitsWall(rock) {
    const { min, max } = rock.reduce(
      ({ min, max }, [x]) => ({ min: Math.min(min, x), max: Math.max(max, x) }),
      { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
    );
    return min < 0 || max >= 7;
  }

  function ifCollideWithSolid(rock) {
    const solidSet = new Set(solidState.map(([x, y]) => `${x},${y}`));
    for (const [x, y] of rock) {
      if (solidSet.has(`${x},${y}`)) {
        return true;
      }
    }
    return false;
  }

  function summarize(){
    let array = new Array(7).fill(1);
    
    for(const [x,y] of solidState){
      if(array[x] < y){
        array[x] = y
      }
    }

    const max = Math.max(...array);
    array = array.map(value=>value-max);
    return array.join("|")
  }

  function dropRock(shouldCheckVisited) {
    if(shouldCheckVisited){
      const topValues = summarize()
      const key = `${rockIndex},${jetIndex},${topValues}`;
      const foundIndex = visitedState.indexOf(key);
      if (foundIndex !== -1) {
        return foundIndex;
      }else{
        visitedState.push(key);
      }
    }
    const rock = rocks[rockIndex].map((array) => {
      const updatedArray = [...array];
      updatedArray[0] += 2;
      updatedArray[1] += height + 3;
      return updatedArray;
    });
    let isSolid = false;
    while (!isSolid) {
      // Try to move based on jet
      const jetMovedRockLocation = rock.map((point) => [
        point[0] + jets[jetIndex],
        point[1],
      ]);
      if (
        !ifHitsWall(jetMovedRockLocation) &&
        !ifCollideWithSolid(jetMovedRockLocation)
      ) {
        for (const point of rock) {
          point[0] += jets[jetIndex];
        }
      }
      jetIndex = (jetIndex + 1) % jets.length;

      // Move one step down
      const gravityMovedRockLocation = rock.map((point) => [
        point[0],
        point[1] - 1,
      ]);
      if (!ifCollideWithSolid(gravityMovedRockLocation)) {
        for (const point of rock) {
          point[1]--;
        }
      } else {
        for (const point of rock) {
          solidState.push(point);
          if(shouldCheckVisited){
            solidStateCopy.push(point);
          }
        }
        isSolid = true;
      }
    }
    const max = solidState.reduce(
      (max, [_, y]) => Math.max(max, y),
      Number.MIN_SAFE_INTEGER
    );
    height = max + 1;
    if(shouldCheckVisited){
      heightState.push(height);
    }
    rockIndex = (rockIndex + 1) % rocks.length;
  }

  function heightForIterations(iterations, matchIndex) {
    const repeatFactor = visitedState.length - matchIndex;
    const quotient = parseInt((iterations - matchIndex) / repeatFactor);
    const reminder = (iterations - matchIndex) % repeatFactor;    
    const repeatSectionHeight = heightState[heightState.length - 1] - heightState[matchIndex - 1];

    solidState.splice(0);
    solidStateCopy.forEach(point=>solidState.push([...point]));
    height = heightState[heightState.length - 1];
    rockIndex = visitedState[matchIndex].split(",").map(Number)[0]
    jetIndex = visitedState[matchIndex].split(",").map(Number)[1]
    for(let index = 0; index < reminder; index++){
      dropRock(false)
    }
    
    height += ((quotient-1) * repeatSectionHeight);
  }

  let output;
  while (!output) {
    output = dropRock(true);
  }

  // Part 1
  heightForIterations(
    2022,
    output
  );
  console.log("Height For 2022: ",height);
  
  // Part 2
  heightForIterations(
    1000000000000,
    output
  );
  console.log("Height For 1000000000000: ",height);
} catch (err) {
  console.error(err);
}
