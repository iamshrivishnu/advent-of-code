const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const monkeyBlocks = data.split(/\r?\n\r?\n/);

  const multiplyClosure = (operand) => (oldValue) =>
    operand ? oldValue * operand : oldValue * oldValue;
  const addClosure = (operand) => (oldValue) =>
    operand ? oldValue + operand : oldValue + oldValue;

  const computeMonkeyData = (currentItem) => {
    const [_, line2, line3, line4, line5, line6] = currentItem.split(/\r?\n/);
    const worryLevels = line2.match(/\d+/g).map(Number);
    const operator = line3.match(/(\+|\*)/g)[0];
    const operand = Number(line3.match(/(\d+)/g)?.[0] || 0);
    const operation = operator === "*" ? multiplyClosure(operand) : addClosure(operand);
    const test = Number(line4.match(/(\d+)/g)[0]);
    const truthCase = Number(line5.match(/(\d+)/g)[0]);
    const falsyCase = Number(line6.match(/(\d+)/g)[0]);
    return {
      worryLevels,
      operation,
      test,
      truthCase,
      falsyCase,
      inspections: 0,
    };
  };

  const monkeyData = monkeyBlocks.map(computeMonkeyData);
  const updatedMonkeyDataWithRelief = monkeyData.map((data)=>({ ...data, worryLevels: [...data.worryLevels] }));
  const updatedMonkeyDataWithoutRelief = monkeyData.map((data)=>({ ...data, worryLevels: [...data.worryLevels] }));
  const lcm = monkeyData.reduce((prevValue, currentItem)=>prevValue* currentItem.test, 1);

  const subtractIfPossible = (number)=>{
    return number > lcm ? number%lcm : number
  }

  const roundOfInspection = (isWithRelief, array) => {
    for(const index in array){
      const monkey = array[index];
      const worryLevels = monkey.worryLevels;
      for(const worryLevel of worryLevels){
        const newWorryLevel = isWithRelief ? Math.floor(monkey.operation(worryLevel)/3) : subtractIfPossible(monkey.operation(worryLevel));
        if(newWorryLevel % monkey.test === 0){
          array[monkey.truthCase].worryLevels.push(newWorryLevel);
        }else{
          array[monkey.falsyCase].worryLevels.push(newWorryLevel);
        }
      }
      array[index].inspections = array[index].inspections + worryLevels.length;
      array[index].worryLevels = [];
    }
  }

  // Puzzle One
  const requiredNumberOfRoundsWithRelief = 20;
  for(let round = 1; round <= requiredNumberOfRoundsWithRelief; round++){
    roundOfInspection(true, updatedMonkeyDataWithRelief)
  }
  console.log("Monkey Business: ",updatedMonkeyDataWithRelief.map((data)=>data.inspections).sort((a,b)=>b-a).slice(0,2).reduce((prevState, currentItem)=>prevState*currentItem,1))
  
  // Puzzle Two
  const requiredNumberOfRoundsWithoutRelief = 10000;
  for(let round = 1; round <= requiredNumberOfRoundsWithoutRelief; round++){
    roundOfInspection(false, updatedMonkeyDataWithoutRelief)
  }
  console.log("New Monkey Business: ",updatedMonkeyDataWithoutRelief.map((data)=>data.inspections).sort((a,b)=>b-a).slice(0,2).reduce((prevState, currentItem)=>prevState*currentItem,1))
  
} catch (err) {
  console.error(err);
}
