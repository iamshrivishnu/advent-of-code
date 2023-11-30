const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const droplets = new Set();
  const faces = new Map();
  const offsets = [[0.5,0,0],[0,0.5,0],[0,0,0.5],[-0.5,0,0],[0,-0.5,0],[0,0,-0.5]];
  let minX, minY, minZ, maxX, maxY, maxZ;

  minX = minY = minZ = Number.MAX_SAFE_INTEGER;
  maxX = maxY = maxZ = Number.MIN_SAFE_INTEGER;

  data
    .split(/\r?\n/)
    .forEach((line) => {
      droplets.add(line.trim());

      const [x,y,z] = eval(`[${line.trim()}]`)
      
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      minZ = Math.min(minZ, z)

      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
      maxZ = Math.max(maxZ, z)

      for(const [dx,dy,dz] of offsets){
        const key = `${x+dx},${y+dy},${z+dz}`;
        faces.set(key, (faces.get(key)||0) + 1);
      }
    });

  minX--;
  minY--;
  minZ--;

  maxX++;
  maxY++;
  maxZ++;

  const queueSet = new Set([ `${minX},${minY},${minZ}` ]);
  const queueSetIterator = queueSet.values();
  const air = new Set([ `${minX},${minY},${minZ}` ])

  while(queueSet.size > 0){
    const { value, done } = queueSetIterator.next();
    if(done){
      break;
    }
    const [x,y,z] = value.split(",").map(Number);
    queueSet.delete(value);

    for(const [dx,dy,dz] of offsets){
      const key = `${x+(dx*2)},${y+(dy*2)},${z+(dz*2)}`;
      const [newX, newY, newZ] = eval(`[${key}]`);

      if((newX < minX || newX > maxX) ||(newY < minY || newY > maxY) ||(newZ < minZ || newZ > maxZ)){
        continue
      }
      if(droplets.has(key) || air.has(key)){
        continue
      }

      air.add(key)
      queueSet.add(key)
    }    
  }

  const freeSpots = new Set()

  for(const airPoint of air){
    for(const [dx, dy, dz] of offsets){
      const [x,y,z] = eval(`[${airPoint}]`)
      freeSpots.add(`${x+dx},${y+dy},${z+dz}`)
    }
  }
  
  // Part 1
  const score = Array.from(faces.values()).filter(value=>value === 1).length;
  console.log("Score: ", score);

  // Part 2
  const intersectionSet = new Set()
  faces.forEach((_,key)=>{
    if(freeSpots.has(key)){
      intersectionSet.add(key);
    }
  })
  console.log("New Score: ", intersectionSet.size)

} catch (err) {
  console.error(err);
}
