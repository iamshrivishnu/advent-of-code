const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const chars = data.split('');

  const getCharsPacket = (index) => {
    const startIndex = index > 3 ? index-4 : 0;
    const array = chars.slice(startIndex, index);
    return array;
  };

  const getCharsMessage = (index) => {
    const startIndex = index > 13 ? index-14 : 0;
    const array = chars.slice(startIndex, index);
    return array;
  };
  
  const isUniquePacket = (index) => {
    const charsSubSet = getCharsPacket(index);
    if(index <= 3) return false;
    return charsSubSet.length === Array.from(new Set(charsSubSet)).length; 
  }

  const isUniqueMessage = (index) => {
    const charsSubSet = getCharsMessage(index);
    if(index <= 13) return false;
    return charsSubSet.length === Array.from(new Set(charsSubSet)).length; 
  }

  // Puzzle One
  const index = chars.findIndex((_, index) => isUniquePacket(index));
  console.log("First Index: ",index);
  
  // Puzzle Two
  const newIndex = chars.findIndex((_, index) => isUniqueMessage(index));
  console.log("New Index: ",newIndex);
} catch (err) {
  console.error(err);
}
