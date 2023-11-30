const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);
  
  const getIfCompleteOverlap = (elfOne, elfTwo) => {
    const [elfOneMin, elfOneMax] = elfOne.split("-").map(Number);
    const [elfTwoMin, elfTwoMax] = elfTwo.split("-").map(Number);
    const isOverlap =
      (elfOneMin <= elfTwoMin && elfOneMax >= elfTwoMax) ||
      (elfTwoMin <= elfOneMin && elfTwoMax >= elfOneMax);
    return isOverlap;
  };

  const getIfOverlap = (elfOne, elfTwo) => {
    const [elfOneMin, elfOneMax] = elfOne.split("-").map(Number);
    const [elfTwoMin, elfTwoMax] = elfTwo.split("-").map(Number);
    const isOverlap =
      (elfOneMin <= elfTwoMin && elfOneMax >= elfTwoMax) ||
      (elfOneMin <= elfTwoMax && elfOneMax >= elfTwoMax) ||
      (elfTwoMin <= elfOneMin && elfTwoMax >= elfOneMax) ||
      (elfTwoMin <= elfOneMax && elfTwoMax >= elfOneMax);
    return isOverlap;
  };

  // Puzzle One
  const score = lines.reduce((prevState, line) => {
    const [elfOne, elfTwo] = line.split(",");
    const isOverlap = getIfCompleteOverlap(elfOne, elfTwo);
    return prevState + (isOverlap ? 1 : 0);
  }, 0);
  console.log("Score: ", score);

  // Puzzle Two
  const newScore = lines.reduce((prevState, line) => {
    const [elfOne, elfTwo] = line.split(",");
    const isOverlap = getIfOverlap(elfOne, elfTwo);
    return prevState + (isOverlap ? 1 : 0);
  }, 0);
  console.log("New Score: ", newScore);
} catch (err) {
  console.error(err);
}
