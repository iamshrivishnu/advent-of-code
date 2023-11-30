const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  
  const coordinateData = { start: null, end: null };
  const stepBlocks = data.split(/\r?\n/).map((line, rowIndex) =>
    line.split("").map((letter, columnIndex) => {
      if (letter === "S") {
        coordinateData.start = [rowIndex, columnIndex];
        return 0;
      } else if (letter === "E") {
        coordinateData.end = [rowIndex, columnIndex];
        return 27;
      } else {
        return letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
      }
    })
  );

  const rows = stepBlocks.length; // Rows in the grid
  const cols = stepBlocks[0].length; // Columns in the grid

  // Constructor to create the grid points as objects containing the data for the points
  function GridPoint(x, y, v) {
    this.x = x; // x coordinate of the grid point
    this.y = y; // y coordinate of the grid point
    this.v = v; // Value of the grid point

    this.f = 0; // Total cost function

    this.neighbors = []; // Neighbors of the current grid point
    this.parent = undefined; // Immediate source of the current grid point

    // Update neighbors for a given grid point
    this.updateNeighbors = function (grid) {
      const i = this.x;
      const j = this.y;
      if (i < rows - 1) {
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < cols - 1) {
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.neighbors.push(grid[i][j - 1]);
      }
    };
  }

  function getShortestPathLength(startx, starty, endx, endy) {
    // Create array of all the grid points
    const grid = stepBlocks.reduce(
      (prevRowState, row, rowIndex) => [
        ...prevRowState,
        row.reduce(
          (prevColumnState, item, columnIndex) => [
            ...prevColumnState,
            new GridPoint(rowIndex, columnIndex, item),
          ],
          []
        ),
      ],
      []
    );

    // Compute all neighbours
    grid.forEach((row) => row.forEach((item) => item.updateNeighbors(grid)));

    const start = grid[startx][starty]; // Starting grid point
    const end = grid[endx][endy]; // Ending grid point (goal)
    const path = [];

    const openSet = [start]; // Array containing unevaluated grid points
    const closedSet = []; // Array containing completely evaluated grid points

    // A star search implementation
    function search() {
      while (openSet.length > 0) {
        // Starting with the one with lowest value lowest index is the first one to begin with
        const lowestIndex = openSet.reduce(
          (prevIndexState, current, currentIndex) =>
            current.f < openSet[prevIndexState].f
              ? currentIndex
              : prevIndexState,
          0
        );
        const current = openSet[lowestIndex];

        if (current === end) {
          let temp = current;
          path.push(temp);
          while (temp.parent) {
            path.push(temp.parent);
            temp = temp.parent;
          }
          // Return the traced path
          return path.reverse();
        }

        // Remove current from openSet
        openSet.splice(lowestIndex, 1);
        // Add current to closedSet
        closedSet.push(current);

        for (const neighbor of current.neighbors) {
          if (!closedSet.includes(neighbor)) {
            const possibleCost =
              (neighbor.v + 1) >= current.v
                ? current.f + 1
                : Number.MAX_SAFE_INTEGER;

            if (
              possibleCost !== Number.MAX_SAFE_INTEGER &&
              !openSet.includes(neighbor)
            ) {
              openSet.push(neighbor);
            } else if (
              possibleCost >= neighbor.f ||
              possibleCost === Number.MAX_SAFE_INTEGER
            ) {
              continue;
            }

            neighbor.f = possibleCost;
            neighbor.parent = current;
          }
        }
      }
      // No solution by default
      return [];
    }

    return {grid, searchOutput: search()};
  }

  const { grid, searchOutput } = getShortestPathLength(
    coordinateData.end[0],
    coordinateData.end[1],
    coordinateData.start[0],
    coordinateData.start[1],
  );

  // Part 1
  console.log("Number of Steps: ",(searchOutput.length-1));

  // Part 2
  const listOfAs = grid.flat().reduce(( prevArray, gridPoint)=>{
    if(gridPoint.v === 1 && gridPoint.f > 0){
      return [ ...prevArray, { x: gridPoint.x, y: gridPoint.y, cost: gridPoint.f } ]
    }else{
      return prevArray;
    }
  }, [])
  const minCost = listOfAs.reduce((prevMinCost, currentItem)=>currentItem.cost < prevMinCost ? currentItem.cost : prevMinCost, Number.MAX_SAFE_INTEGER);
  console.log("Min Cost : ",minCost);

} catch (err) {
  console.error(err);
}
