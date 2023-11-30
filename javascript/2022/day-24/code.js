const fs = require("fs");

try {
  // const data = fs.readFileSync("data.txt", "UTF-8");
  const data = `#.#####
  #.....#
  #>....#
  #.....#
  #...v.#
  #.....#
  #####.#`;

  const DIRECTIONS = {
    "<": [-1, 0],
    ">": [1, 0],
    "^": [0, -1],
    v: [0, 1],
    x: [0, 0],
  };
  const DIRECTION_KEYS = Object.keys(DIRECTIONS);
  const DIRECTION_VALUES = Object.values(DIRECTIONS);
  const blizzardsSet = new Set();

  data.split(/\r?\n/).forEach((line, y) => {
    line
      .trim()
      .split("")
      .forEach((char, x) => {
        const index = DIRECTION_KEYS.indexOf(char);
        if (index !== -1) {
          blizzardsSet.add(`${x},${y},${index}`);
        }
      });
  });

  function lcm(num1, num2) {
    let min = num1 > num2 ? num1 : num2;

    // while loop
    while (true) {
      if (min % num1 == 0 && min % num2 == 0) {
        return min;
      }
      min++;
    }
  }

  const width = data.split(/\r?\n/)[0].trim().split("").length;
  const height = data.split(/\r?\n/).length;

  const period = lcm(width - 2, height - 2);

  const BLIZZARDS_MAP = new Map();

  function simulate(blizzards) {
    const newSet = new Set();
    for (const blizzard of blizzards) {
      const [x, y, direction] = blizzard.split(",").map(Number);
      const [dx, dy] = DIRECTION_VALUES[direction];
      const newX = ((x + dx - 1) % (width - 2)) + 1;
      const newY = ((y + dy - 1) % (height - 2)) + 1;
      newSet.add(`${newX},${newY},${direction}`);
    }
    return newSet;
  }

  function bfs(blizzards, target) {
    const queue = new Set([`1,0,0,0`]);
    const queueIterator = queue.values();
    const bests = { [`1,0,0,0`]: 0 };
    let lastTime = -1;
    let iterations = 0;
    let cells;

    while (queue.size > 0) {
      iterations++;
      const item = queueIterator.next().value;
      console.log("Item : ",item)
      queue.delete(item);
      const [x, y, time, count] = item.split(",").map(Number);

      if (time !== lastTime) {
        lastTime = time;
        if (!BLIZZARDS_MAP.has(time)) {
          const value = simulate(blizzards);
          BLIZZARDS_MAP.set(time, [
            value,
            Array.from(value).map((string) =>
              string.split(/,/).slice(0, 2).join(",")
            ),
          ]);
        }
        [blizzards, cells] = BLIZZARDS_MAP.get(time);
      }

      if (x === target[0] && y === target[1] && count === target[2]) {
        return bests[item];
      }

      let newCount = count;
      if (
        (count % 2 === 0 && x === width - 2 && y === height - 2) ||
        (count % 2 === 1 && x === 1 && y === 0)
      ) {
        newCount++;
      }

      for (const [dx, dy] of DIRECTION_VALUES) {
        const [newX, newY] = [x + dx, y + dy];
        const point = `${newX},${newY}`;

        if (
          point === `1,0` ||
          point === `${width - 2},${height - 1}` ||
          (newX >= 1 && newX < width - 1 && newY >= 1 && newY < height - 1)
        ) {
          const newItem = `${newX},${newY},${(time + 1) % period},${newCount}`;

          if (cells.indexOf(point) === -1 && !bests[newItem]) {
            queue.add(newItem);
            bests[newItem] = bests[item] + 1;
          }
        }
      }
    }
  }

  // Puzzle One
  console.log("Part One: ", bfs(blizzardsSet, [width - 2, height - 1, 0]));

  //  Puzzle Two
} catch (err) {
  console.error(err);
}
