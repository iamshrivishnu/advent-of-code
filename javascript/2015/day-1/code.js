const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const brackets = data.split("");

  //   Puzzle 1
  const floor = brackets.reduce((prevState, current) => {
    if (current === "(") {
      return prevState + 1;
    } else if (current === ")") {
      return prevState - 1;
    } else {
      return prevState;
    }
  }, 0);
  console.log("Floor: ", floor);

  // Puzzle 2
  let firstBasement = undefined;
  brackets.reduce((prevState, current, index) => {
    if (current === "(") {
      return prevState + 1;
    } else if (current === ")") {
      if (prevState === 0 && !firstBasement) {
        firstBasement = index+1;
      }
      return prevState - 1;
    } else {
      return prevState;
    }
  }, 0);
  console.log("First Basement: ", firstBasement);
} catch (err) {
  console.error(err);
}
