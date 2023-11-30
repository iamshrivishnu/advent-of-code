const fs = require("fs");

class Node {
  constructor(value) {
    this.prev = null;
    this.value = value;
    this.next = null;
  }
}

try {
  const data = fs.readFileSync("data.txt", "UTF-8");

  function runSet(multiplyValue = 1, repeatCount = 1) {
    const array = data
      .split(/\r?\n/)
      .map((line) => new Node(Number(line.trim()) * multiplyValue));
    const arrayLength = array.length;
    const modulus = array.length - 1;
    let zeroNode = null;

    // Link all the entries to make circular list
    for (const indexString in array) {
      const index = Number(indexString);
      if (index === 0) {
        array[index].prev = array[arrayLength - 1];
      } else {
        array[index].prev = array[index - 1];
      }
      if (index === arrayLength - 1) {
        array[index].next = array[0];
      } else {
        array[index].next = array[index + 1];
      }
    }

    // Iterate through all nodes in array
    for (const _ in new Array(repeatCount).fill(1)) {
      for (const node of array) {
        if (node.value === 0) {
          zeroNode = node;
          continue;
        } else {
          let pointer = node;
          if (node.value > 0) {
            for (const _ in new Array(node.value % modulus).fill(1)) {
              pointer = pointer.next;
            }
            if (node !== pointer) {
              // De-linking node
              node.next.prev = node.prev;
              node.prev.next = node.next;

              // Linking the node to position
              pointer.next.prev = node;
              node.next = pointer.next;
              pointer.next = node;
              node.prev = pointer;
            }
          } else if (node.value < 0) {
            for (const _ in new Array((-1 * node.value) % modulus).fill(1)) {
              pointer = pointer.prev;
            }
            if (node !== pointer) {
              // De-linking node
              node.prev.next = node.next;
              node.next.prev = node.prev;

              // Linking the node to position
              pointer.prev.next = node;
              node.prev = pointer.prev;
              pointer.prev = node;
              node.next = pointer;
            }
          }
        }
      }
    }

    let score = 0;

    for (const i in new Array(3).fill(1)) {
      for (const j in new Array(1000).fill(1)) {
        zeroNode = zeroNode.next;
      }
      score += zeroNode.value;
    }
    return score;
  }

  // Part 1
  const score = runSet(1, 1);
  console.log("Score: ", score);
  
  // Part 2
  const newScore = runSet(811589153, 10);
  console.log("Score: ", newScore);
} catch (err) {
  console.error(err);
}
