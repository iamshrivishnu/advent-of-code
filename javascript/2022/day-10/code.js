const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);

  const requiredCycles = [20, 60, 100, 140, 180, 220];

  const isBrightSpot = (index, spriteStart, cycle) => {
    const spriteAdd = (parseInt(cycle / 40))*40;
    return (index === spriteAdd+spriteStart) || (index === spriteAdd+spriteStart+1) || (index === spriteAdd+spriteStart+2); 
  }

  const processCommand = (command, arg, prevCycle, x, pixelArray) => {
    if (command === "noop") {
      const matchCycle = requiredCycles.find(
        (findCycle) => findCycle === prevCycle + 1
      );
      const updatedPixelArray = [ ...pixelArray];
      updatedPixelArray[prevCycle] = isBrightSpot(prevCycle+1, x, prevCycle)? "#":".";
      if(matchCycle){
        const score = matchCycle * x
        return { cycle: prevCycle + 1, x, score, pixelArray: updatedPixelArray };
      }else{
        return { cycle: prevCycle + 1, x, score: 0, pixelArray: updatedPixelArray };
      }
    } else {
      const matchCycle = requiredCycles.find(
        (findCycle) => findCycle === prevCycle + 1 || findCycle === prevCycle + 2
      );

      const updatedPixelArray = [ ...pixelArray];
      updatedPixelArray[prevCycle] = isBrightSpot(prevCycle+1,x, prevCycle)? "#":".";
      updatedPixelArray[prevCycle+1] = isBrightSpot(prevCycle+2,x, prevCycle+1)? "#":".";

      if (matchCycle) {
        const score = matchCycle * x;
        return {
          cycle: prevCycle + 2,
          x: x + arg,
          score, pixelArray: updatedPixelArray
        };
      } else {
        return {
          cycle: prevCycle + 2,
          x: x + arg,
          score: 0, pixelArray: updatedPixelArray
        };
      }
    }
  };

  // Puzzle One
  const { signalStrengths, pixelArray } = lines.reduce(
    (prevState, line) => {
      const [command, arg] = line.split(" ");
      const { cycle, x, score, pixelArray } = processCommand(
        command,
        Number(arg),
        prevState.cycle,
        prevState.x,
        [...prevState.pixelArray]
      );
      return {
        x,
        signalStrengths: prevState.signalStrengths + (score || 0),
        cycle,
        pixelArray
      };
    },
    { x: 1, signalStrengths: 0, cycle: 0, pixelArray: new Array(240).fill('.') }
  );
  console.log("Signal Strength: ", signalStrengths);

  // Puzzle Two
  for(let index =0; index < 6; index++){
    console.log(pixelArray.slice((index * 40),((index+1)*40)).join(" "))
  }
} catch (err) {
  console.error(err);
}