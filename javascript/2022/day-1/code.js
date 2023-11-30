const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);
  const elfs = lines.reduce(
    (prevState, line) => {
      if (!line || isNaN(Number(line))) {
        return [...prevState, 0];
      } else {
        const lastElement = prevState.at(-1);
        return [...prevState.slice(0, -1), lastElement + Number(line)];
      }
    },
    [0]
  );

  // Puzzle One
  const max = elfs.reduce(
    (prevMax, current) => (prevMax > current ? prevMax : current),
    0
  );
  console.log("Max Elf:", max);

  //  Puzzle Two
  const sorted = elfs.sort((a, b) => b - a);
  console.log(sorted);
  const top3 = sorted[0] + sorted[1] + sorted[2];
  console.log("Top 3 Elfs:", top3);
} catch (err) {
  console.error(err);
}
