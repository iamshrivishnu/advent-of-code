const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);

  const getAttackScore = (opponent, you) => {
    const opponentNum = opponent.charCodeAt(0) - "A".charCodeAt(0);
    const youNum = you.charCodeAt(0) - "X".charCodeAt(0);
    const score =
      opponentNum === youNum
        ? 3
        : youNum + 1 === opponentNum || (youNum === 2 && opponentNum === 0)
        ? 0
        : 6;
    return score;
  };

  const getTypeScore = (you) => {
    const youNum = you.charCodeAt(0) - "X".charCodeAt(0);
    return youNum + 1;
  };

  const getAttackType = (opponent, strategy) => {
    const opponentNum = opponent.charCodeAt(0) - "A".charCodeAt(0);
    const strategyNum = strategy.charCodeAt(0) - "X".charCodeAt(0);

    const yourMove = String.fromCharCode(
      "X".charCodeAt(0) + ((opponentNum + 3 + strategyNum - 1) % 3)
    );

    return yourMove;
  };

  // Puzzle One
  const score = lines.reduce((prevState, line) => {
    const [opponent, you] = line.split(" ");
    return prevState + getAttackScore(opponent, you) + getTypeScore(you);
  }, 0);
  console.log("Score: ", score);

  // Puzzle Two
  const newScore = lines.reduce((prevState, line) => {
    const [opponent, strategy] = line.split(" ");
    const you = getAttackType(opponent, strategy);

    return prevState + getAttackScore(opponent, you) + getTypeScore(you);
  }, 0);
  console.log("New Score: ", newScore);
} catch (err) {
  console.error(err);
}
