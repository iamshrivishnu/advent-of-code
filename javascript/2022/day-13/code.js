const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const messagePairs = data.split(/\r?\n\r?\n/);

  function compareValues(firstInput, secondInput){
    const isFirstArray = Array.isArray(firstInput),
    isSecondArray = Array.isArray(secondInput);

    const updatedFirstInput = (!isFirstArray && isSecondArray) ? [firstInput] : firstInput;
    const updatedSecondInput = (isFirstArray && !isSecondArray) ? [secondInput] : secondInput;

    if(isFirstArray || isSecondArray){
      for(const index in updatedFirstInput){
        if(index >= updatedSecondInput.length){
          return 1;
        }else if(Array.isArray(updatedFirstInput[index]) || Array.isArray(updatedSecondInput[index])){
          const output = compareValues(updatedFirstInput[index],updatedSecondInput[index]);
          if(output){
            return output;
          }
        }else{
          const output = updatedFirstInput[index] - updatedSecondInput[index];
          if(output){
            return output
          }
        }
      }
      if(updatedFirstInput.length < updatedSecondInput.length){
        return -1;
      }
    }else{
      const output = updatedFirstInput - updatedSecondInput;
      return output
    }
  };
 
  // Part 1
  const rightIndexes = messagePairs.reduce((prevArray, currentMessagePair, index)=>{
    const [leftMessage, rightMessage] = currentMessagePair.split(/\r?\n/).map(eval);
    const result = compareValues(leftMessage, rightMessage);
    if(result < 0){
      return [...prevArray, (index+1)];
    }else{
      return prevArray;
    }
  },[])
  console.log("Sum: ",rightIndexes.reduce((prevSum,current)=>prevSum+current,0))

  // Part 2
  const sortedList = data.split(/\r?\n/).filter(line=>line).concat(["[[2]]","[[6]]"]).sort((a,b)=>{
    return compareValues(eval(a), eval(b));
  })
  const result = sortedList.reduce((prevValue, item, index)=>{
    if(item === '[[2]]' || item === '[[6]]'){
      return prevValue * (index+1);
    }else{
      return prevValue
    }
  },1)
  console.log("Result: ",result)

} catch (err) {
  console.error(err);
}
