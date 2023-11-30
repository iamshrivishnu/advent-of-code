const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const ITEMS = ["ore", "clay", "obsidian"];

  const blueprints = data.split(/\r?\n/).map((line) => {
    const maxSpend = [0, 0, 0];
    const recipes = line
      .split(":")[1]
      .split(". ")
      .map((section) => {
        return section.match(/(\d+) (\w+)/g).map((value) => {
          let [x, y] = value.split(" ");
          x = Number(x);
          y = ITEMS.indexOf(y);
          maxSpend[y] = Math.max(maxSpend[y], x);
          return [x, y];
        });
      });
    return { blueprint: recipes, maxSpend };
  });

  function dfs(blueprint, maxSpend, cache, time, bots, amount) {
    if (time <= 0) {
      return amount[3];
    }

    const key = `${time}|${bots.join(",")}|${amount.join(",")}`;
    if (cache[key]) return cache[key];

    let maxValue = amount[3] + (bots[3] * time);
    
    for (const blueprintIndexString in blueprint) {
      const blueprintIndex = Number(blueprintIndexString);
      const recipe = blueprint[blueprintIndex];

      if (
        blueprintIndex !== 3 &&
        bots[blueprintIndex] >= maxSpend[blueprintIndex]
      ) {
        continue;
      }

      let wait = 0;
      let noZeroBot = true;

      for (const [recipeAmount, recipeType] of recipe) {
        if (bots[recipeType] === 0) {
          noZeroBot = false;
          break;
        }
        wait = Math.max(
          wait,
          Math.ceil((recipeAmount - amount[recipeType]) / bots[recipeType])
        );
      }

      if (noZeroBot) {
        const remainingTime = time - wait - 1;
        if (remainingTime <= 0) {
          continue;
        }

        const newBots = [...bots];
        const newAmount = amount.map((val, i) => val + (wait + 1) * bots[i]);
        for (const [recipeAmount, recipeType] of recipe) {
          newAmount[recipeType] -= recipeAmount;
        }
        newBots[blueprintIndex] += 1;
        
        for (let i = 0; i < maxSpend.length; i++) {
          newAmount[i] = Math.min(newAmount[i], maxSpend[i] * remainingTime);
        }

        maxValue = Math.max(
          maxValue,
          dfs(blueprint, maxSpend, cache, remainingTime, newBots, newAmount)
        );
      }
    }

    cache[key] = maxValue;
    return maxValue;
  }

  // Part 1
  const totalValue = blueprints.reduce((prevValue, element, index) => {
    const value = dfs(
      element.blueprint,
      element.maxSpend,
      {},
      24,
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    );
    return prevValue + ((index + 1) * value);
  }, 0);
  console.log("Value: ", totalValue);
  
  // Part 2
  const newTotalValue = blueprints.slice(0,3).reduce((prevValue, element, index) => {
    const value = dfs(
      element.blueprint,
      element.maxSpend,
      {},
      32,
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    );
    return prevValue * value;
  }, 1);
  console.log("New Value: ", newTotalValue);
} catch (err) {
  console.error(err);
}
