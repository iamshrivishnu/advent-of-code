const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);
  const dimensions = lines.map((line)=>{
    const [l,w,h] = line.split('x').map(Number);
    const max = Math.max(l,w,h);
    
    const area = 2*l*w + 2*w*h + 2*h*l;
    const extraArea = (l*w*h)/max;
    
    const wrapLength = 2*((l+w+h)-max)
    const bowLength = l*w*h;
    
    return { l, w, h, area, extraArea, wrapLength, bowLength };
  });

  // Puzzle One
  const AreaSum = dimensions.reduce((prevSum,current)=>{
    return prevSum+(current.area+current.extraArea);
  },0);
  console.log("Area :", AreaSum);
  
  //  Puzzle Two
  const ribbonLength = dimensions.reduce((prevSum,current)=>{
    return prevSum+(current.wrapLength+current.bowLength);
  },0);
  console.log("Ribbon Length :", ribbonLength);
} catch (err) {
  console.error(err);
}
