const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const stackLines = [
    ['B','V','S', 'N','T','C','H','Q'],//1
    ['W','D','B','G'],//2
    ['F','W','R','T','S','Q','B'],//3
    ['L','G','W','S','Z','J','D','N'],//4
    ['M','P','D','V','F'],//5
    ['F','W','J'],//6
    ['L','N','Q','B','J','V'],//7
    ['G','T','R','C','J','Q','S','N'],//8
    ['J','S','Q','C','W','D','M'],//9
  ];
  const stackLinesCopy = [
    ['B','V','S', 'N','T','C','H','Q'],//1
    ['W','D','B','G'],//2
    ['F','W','R','T','S','Q','B'],//3
    ['L','G','W','S','Z','J','D','N'],//4
    ['M','P','D','V','F'],//5
    ['F','W','J'],//6
    ['L','N','Q','B','J','V'],//7
    ['G','T','R','C','J','Q','S','N'],//8
    ['J','S','Q','C','W','D','M'],//9
  ];
  const operationsLine = data.split(/\r?\n/);

  
  const movePackage = (source, destination) => {
    const packageMoved = stackLines[source-1].pop();
    stackLines[destination-1].push(packageMoved);
  };
  
  const movePackages = (count,source,destination) => {
    const packagesMoved = stackLinesCopy[source-1].splice(stackLinesCopy[source-1].length-count);
    stackLinesCopy[destination-1] = [ ...stackLinesCopy[destination-1], ...packagesMoved];
  }

  const operateCrane = (line) => {
    const [numberOfPackages, source, destination] = line.match(/\d+/g);
    for(let index = 0; index < numberOfPackages; index++){
      movePackage(source,destination);
    }
  };
  const operateNewCrane = (line) => {
    console.log(line);
    const [numberOfPackages, source, destination] = line.match(/\d+/g);
    movePackages(numberOfPackages, source, destination);
  };

  const getTopPackages = (line)=>{
    return line.reduce((prevState, current)=>prevState+current[current.length-1],'')
  }

  // Puzzle One
  operationsLine.forEach(line => {
    operateCrane(line)
  });
  console.log("Top Packages: ",getTopPackages(stackLines));

  // Puzzle Two
  operationsLine.forEach(line => {
    operateNewCrane(line)
  });
  console.log("New Top Packages: ",getTopPackages(stackLinesCopy));
} catch (err) {
  console.error(err);
}
