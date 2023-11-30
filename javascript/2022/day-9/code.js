const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);

  const sitesOne = new Set(["0,0"]);
  const sitesTwo = new Set(["0,0"]);

  const knots = ["h", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const state = {
    h: {
      row: 0,
      col: 0,
    },
    1: {
      row: 0,
      col: 0,
    },
    2: {
      row: 0,
      col: 0,
    },
    3: {
      row: 0,
      col: 0,
    },
    4: {
      row: 0,
      col: 0,
    },
    5: {
      row: 0,
      col: 0,
    },
    6: {
      row: 0,
      col: 0,
    },
    7: {
      row: 0,
      col: 0,
    },
    8: {
      row: 0,
      col: 0,
    },
    9: {
      row: 0,
      col: 0,
    },
  };

  const moveNextKnot = (currentKnot) => {
    if (currentKnot) {
      const indexOfKnot = knots.findIndex((knot) => knot === currentKnot);
      const { row: newRow, col: newCol } = state[knots[indexOfKnot-1]];

      const { row: tRow, col: tCol } = state[currentKnot];
      if (
        (Math.abs(newRow - tRow) > 1 && Math.abs(newCol - tCol) == 0) ||
        (Math.abs(newRow - tRow) == 0 && Math.abs(newCol - tCol) > 1)
      ) {
        const rowDiff = newRow - tRow;
        const colDiff = newCol - tCol;
        const newT = {};

        if (rowDiff > 1) {
          newT.row = tRow + 1;
          newT.col = tCol;
        } else if (rowDiff < 1) {
          newT.row = tRow - 1;
          newT.col = tCol;
        }

        if (colDiff > 1) {
          newT.col = tCol + 1;
          newT.row = tRow;
        } else if (colDiff < -1) {
          newT.col = tCol - 1;
          newT.row = tRow;
        }

        if (Object.keys(newT).length > 0) {
          state[currentKnot] = newT;
          if (indexOfKnot === 1) {
            sitesOne.add(`${newT.row},${newT.col}`);
          } else if (indexOfKnot === knots.length - 1) {
            sitesTwo.add(`${newT.row},${newT.col}`);
          }
        }
      } else if (
        !(Math.abs(newRow - tRow) <= 1 && Math.abs(newCol - tCol) <= 1)
      ) {
        const rowDiff = newRow - tRow;
        const colDiff = newCol - tCol;
        const newT = {};

        if (rowDiff > 0 && colDiff > 0) {
          newT.row = tRow + 1;
          newT.col = tCol + 1;
        } else if (rowDiff < 0 && colDiff < 0) {
          newT.row = tRow - 1;
          newT.col = tCol - 1;
        } else if (rowDiff > 0 && colDiff < 0) {
          newT.row = tRow + 1;
          newT.col = tCol - 1;
        } else {
          newT.row = tRow - 1;
          newT.col = tCol + 1;
        }

        if (Object.keys(newT).length > 0) {
          state[currentKnot] = newT;
          if (indexOfKnot === 1) {
            sitesOne.add(`${newT.row},${newT.col}`);
          } else if (indexOfKnot === knots.length - 1) {
            sitesTwo.add(`${newT.row},${newT.col}`);
          }
        }
      }
      moveNextKnot(knots[indexOfKnot + 1]);
    } else {
      return;
    }
  };

  const moveHeadStep = (newRow, newCol) => {
    state.h = { row: newRow, col: newCol };
    moveNextKnot(knots[1]);
  };

  const performOperation = (direction, steps) => {
    new Array(steps).fill(1).forEach(() => {
      const { row: hRow, col: hCol } = state.h;
      if (direction === "U") {
        moveHeadStep(hRow + 1, hCol);
      } else if (direction === "D") {
        moveHeadStep(hRow - 1, hCol);
      } else if (direction === "L") {
        moveHeadStep(hRow, hCol - 1);
      } else if (direction === "R") {
        moveHeadStep(hRow, hCol + 1);
      }
    });
  };

  // Puzzle One
  lines.forEach((line) => {
    const [direction, steps] = line.split(" ");
    performOperation(direction, Number(steps));
  });
  console.log("Steps: ", Array.from(sitesOne).length);

  // Puzzle Two
  console.log("Steps: ", Array.from(sitesTwo).length);
} catch (err) {
  console.error(err);
}
