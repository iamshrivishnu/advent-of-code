const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  const { flows, neighbors } = data.split(/\r?\n/).reduce(
    (prevState, line) => {
      const updatedLine = line.replace(
        /^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z]{2}.*)+$/,
        '{"source":"$1","flow":$2,"neighbors":"$3"}'
      );
      const data = JSON.parse(updatedLine);
      data.neighbors = data.neighbors.split(/\, /);
      return {
        flows: { ...prevState.flows, [data.source]: data.flow },
        neighbors: { ...prevState.neighbors, [data.source]: data.neighbors },
      };
    },
    { flows: {}, neighbors: {} }
  );

  const nodes = Object.keys(flows);

  let index = -1;
  const nonZeroFlows = Object.keys(flows).reduce((prevState, key) => {
    if (flows[key]) {
      index++;
      return { ...prevState, [key]: index };
    } else {
      return prevState;
    }
  }, {});

  // Sudo Code for Floyd–Warshall algorithm
  // let dist be a |V| × |V| array of minimum distances initialized to ∞ (infinity)
  // for each edge (u, v) do
  //     dist[u][v] ← w(u, v)  // The weight of the edge (u, v)
  // for each vertex v do
  //     dist[v][v] ← 0
  // for k from 1 to |V|
  //     for i from 1 to |V|
  //         for j from 1 to |V|
  //             if dist[i][j] > dist[i][k] + dist[k][j]
  //                 dist[i][j] ← dist[i][k] + dist[k][j]
  //             end if

  function getWeight(currentVertex, incomingVertex, neighbors) {
    if (currentVertex === incomingVertex) {
      return 0;
    } else if (neighbors.indexOf(incomingVertex) !== -1) {
      return 1;
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  function createDistanceMap() {
    const dist = nodes.reduce((prevState, currentKey) => {
      const neighborOfCurrent = neighbors[currentKey];
      const weights = nodes.reduce(
        (prevSubState, currentVertex) => ({
          ...prevSubState,
          [currentVertex]: getWeight(
            currentKey,
            currentVertex,
            neighborOfCurrent
          ),
        }),
        {}
      );
      return { ...prevState, [currentKey]: weights };
    }, {});

    for (const kNode of nodes) {
      for (const iNode of nodes) {
        for (const jNode of nodes) {
          if (dist[iNode][jNode] > dist[iNode][kNode] + dist[kNode][jNode]) {
            dist[iNode][jNode] = dist[iNode][kNode] + dist[kNode][jNode];
          }
        }
      }
    }
    return dist;
  }

  const distances = createDistanceMap();

  const hashCache = new Map();

  function dfs(time, valve, bitmask) {
    const key = `${time}|${valve}|${bitmask}`;
    if (hashCache.has(key)) {
      return hashCache.get(key);
    } else {
      let maxValue = 0;
      for (const neighbor in nonZeroFlows) {
        const bit = 1 << nonZeroFlows[neighbor];
        if (bitmask & bit) {
          continue;
        } else {
          const remainTime = time - distances[valve][neighbor] - 1;
          if (remainTime <= 0) continue;
          maxValue = Math.max(
            maxValue,
            dfs(remainTime, neighbor, bitmask | bit) +
              flows[neighbor] * remainTime
          );
        }
      }
      hashCache.set(key, maxValue);
      return maxValue;
    }
  }

  // Part 1
  console.log("Max Pressure: ",dfs(30, "AA", 0))

  // Part 2
  const limit = (1 << Object.keys(nonZeroFlows).length) - 1
  let max = Number.MIN_SAFE_INTEGER;
  for(index = 0; index <= parseInt((limit+1)/2); index++){
    max = Math.max(max, dfs(26, "AA", index) + dfs(26, "AA", limit ^ index) )
  }
  console.log("New Maximum Pressure: ",max);
} catch (err) {
  console.error(err);
}
