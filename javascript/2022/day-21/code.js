const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const numericValue = new Map()
  const numericCopy = new Map()
  const expressionValue = new Map()
  const expressionCopy = new Map()

  data.split(/\r?\n/).forEach((line)=>{
    const [key, value] = line.trim().split(/:/);
    if(value.match(/\d+/)){
      numericValue.set(key, Number(value.trim()))
      numericCopy.set(key, Number(value.trim()))
    }else{
      const [lh,op,rh] = value.trim().split(/ /)
      expressionValue.set(key,[(numericValue.get(lh)|| lh), op, (numericValue.get(rh)|| rh)])
      expressionCopy.set(key,[lh, op, rh])
    }
  })

  while(expressionValue.size > 0){
    for(let monkey of expressionValue.keys()){
      const [lh,op,rh] = expressionValue.get(monkey);
      const updatedLH = (numericValue.get(lh)|| lh)
      const updatedRH = (numericValue.get(rh)|| rh)
      if(typeof updatedLH === "number" && typeof updatedRH === 'number'){
        expressionValue.delete(monkey);
        const value = eval(`${updatedLH}${op}${updatedRH}`)
        numericValue.set(monkey, value);
      }else{
        expressionValue.set(monkey, [updatedLH,op,updatedRH]);
      }
    }
  }
  
  numericCopy.set('humn', 'x');

  const equalKeys = expressionCopy.get('root').filter(item=>!/[\+\-\*\/]+/.test(item))
  
  while(expressionCopy.size > 0){
    for(let monkey of expressionCopy.keys()){
      const [lh,op,rh] = expressionCopy.get(monkey);
      const updatedLH = (numericCopy.get(lh)|| lh)
      const updatedRH = (numericCopy.get(rh)|| rh)
      if((typeof updatedLH === "number" || updatedLH.match(/[0-9\+\-\*\/x]+/)) && (typeof updatedRH === 'number' || updatedRH.match(/[0-9\+\-\*\/x]+/))){
        expressionCopy.delete(monkey);
        if(typeof updatedLH === "number" && typeof updatedRH === 'number'){
          const value = eval(`${updatedLH}${op}${updatedRH}`)
          numericCopy.set(monkey, value);
        }else{
          const value = `(${updatedLH}${op}${updatedRH})`
          numericCopy.set(monkey, value);
        }
      }else{
        expressionCopy.set(monkey, [updatedLH,op,updatedRH]);
      }
    }
  }

  const expression = `${numericCopy.get(equalKeys[0])}=${numericCopy.get(equalKeys[1])}`
 
  // Part 1
  console.log("Root: ",numericValue.get('root'))
  
  // Part 2
  // Use https://nerdamer.com/demo.html to solve the expression as didn't want to use package to solve the equation
  console.log("Solve : \n",expression);
  
} catch (err) {
  console.error(err);
}
