const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);

  const getContainers = (string) => {
    const stringLength = string.length;

    const stringOne = string.substring(0, stringLength / 2);
    const stringTwo = string.substring(stringLength / 2);
    return [stringOne, stringTwo];
  };

  const getCommonItem = (stringOneArray, stringTwoArray) => {
    const commonItem = stringOneArray.find(
      (item) => stringTwoArray.indexOf(item) != -1
    );
    return commonItem;
  };

  const getCommonItems = (stringOneArray, stringTwoArray, stringArrayThree) => {
    const commonItem = stringOneArray.find(
      (item) =>
        stringTwoArray.indexOf(item) != -1 &&
        stringArrayThree.indexOf(item) != -1
    );
    return commonItem;
  };

  const getScore = (char) => {
    const code = char.charCodeAt(0);
    return code >= "a".charCodeAt(0)
      ? code - "a".charCodeAt(0) + 1
      : code - "A".charCodeAt(0) + 27;
  };

  // Puzzle One
  const score = lines.reduce((prevState, line) => {
    const [stringOne, stringTwo] = getContainers(line);
    const commonItem = getCommonItem(stringOne.split(""), stringTwo.split(""));
    return prevState + getScore(commonItem);
  }, 0);
  console.log("Score: ", score);

  // Puzzle Two
  const newScore = lines.reduce((prevState, _, index, self) => {
    if ((index + 1) % 3 === 0) {
      const [stringOne, stringTwo, stringThree] = self.slice(
        index - 2,
        index + 1
      );
      const commonItem = getCommonItems(
        stringOne.split(""),
        stringTwo.split(""),
        stringThree.split("")
      );
      return prevState + getScore(commonItem);
    } else {
      return prevState;
    }
  }, 0);
  console.log("New Score: ", newScore);
} catch (err) {
  console.error(err);
}
