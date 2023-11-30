const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const snafus = data.split(/\r?\n/).map((line) => line.trim());

  const VALUE_MAP = {'=': -2, '-': -1, '0': 0, '1': 1, '2': 2}
  const MODULUS_MAP = ['0','1','2','=','-'];

  function toDecimal(snafu){
    return snafu.split('').reduce((prevValue, current)=>(prevValue * 5)+ VALUE_MAP[current],0);
  }

  function toSnafu(decimal){
    let number = '';
    while(decimal > 0){
      const digit = MODULUS_MAP[decimal%5];
      number = digit+number;
      decimal -= VALUE_MAP[digit];
      decimal /= 5;
    }
    return number;
  }
  
  // Puzzle One
  const sum = snafus.reduce((prevSum, snafu)=> prevSum+ toDecimal(snafu),0);
  console.log("Decimal Sum: ", sum);
  const sumInSnafu = toSnafu(sum);
  console.log("SNAFU Sum: ", sumInSnafu);

} catch (err) {
  console.error(err);
}
