const fs = require("fs");

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const lines = data.split(/\r?\n/);

  const matrix = lines.map((row)=>row.split("").map(Number));
  const rows = lines.length;
  const columns = matrix[0].length;

  const computeIfVisibleInArray = (tree, array)=>{
    return !array.some((currentTree)=> currentTree >= tree);
  }
  
  const computeIfVisible = (rowIndex, columnIndex) => {
    const leftArray = matrix[rowIndex].slice(0,columnIndex)
    const rightArray = matrix[rowIndex].slice(columnIndex+1)
    
    const topArray = matrix.slice(0,rowIndex).map((row)=>row[columnIndex]);
    const bottomArray = matrix.slice(rowIndex+1).map((row)=>row[columnIndex]);
    
    const tree = matrix[rowIndex][columnIndex];

    const isTreeVisible = 
    computeIfVisibleInArray(tree, leftArray) ||
    computeIfVisibleInArray(tree, rightArray) ||
    computeIfVisibleInArray(tree, topArray) ||
    computeIfVisibleInArray(tree, bottomArray);
    return isTreeVisible;
  };

  const computeScenicScoreInArray = (tree, array)=>{
    if(array.length === 0) return 0;
    const index = array.findIndex((currentTree)=> currentTree >= tree);
    return (index === -1 ? array.length : index) + (array.length > 0 && index !== -1 ? 1 : 0)
  }
  
  const computeScenicScore = (rowIndex, columnIndex) => {
    const leftArray = matrix[rowIndex].slice(0,columnIndex).reverse()
    const rightArray = matrix[rowIndex].slice(columnIndex+1)
    
    const topArray = matrix.slice(0,rowIndex).map((row)=>row[columnIndex]).reverse();
    const bottomArray = matrix.slice(rowIndex+1).map((row)=>row[columnIndex]);
    
    const tree = matrix[rowIndex][columnIndex];

    const scenicScore = 
    computeScenicScoreInArray(tree, leftArray) *
    computeScenicScoreInArray(tree, rightArray) *
    computeScenicScoreInArray(tree, topArray) *
    computeScenicScoreInArray(tree, bottomArray);
    
    return scenicScore;
  };

  // Puzzle One
  const computedScore = matrix.reduce((prevState, row, rowIndex) => {
    const rowScore = row.reduce((prevRowState, currentTree, columnIndex)=>{
      if(rowIndex === 0 || columnIndex === 0 || rowIndex === rows-1 || columnIndex === columns-1 ){
        return prevRowState
      } else if(computeIfVisible(rowIndex, columnIndex)){
        return prevRowState+1
      }else{
        return prevRowState
      }
    },0)
    return prevState + rowScore;
  }, 0);
  const score = computedScore+ (2 * (rows+columns-2));
  console.log("Score: ", score);

  // Puzzle Two
  const computedScenicScore = matrix.reduce((prevMax, row, rowIndex) => {
    const rowMax = row.reduce((prevRowmax, currentTree, columnIndex)=>{
      if(rowIndex === 0 || columnIndex === 0 || rowIndex === rows-1 || columnIndex === columns-1 ){
        return prevRowmax
      }
      const viewScore = computeScenicScore(rowIndex, columnIndex);
      return viewScore > prevRowmax ? viewScore : prevRowmax;
    },0)
    return rowMax > prevMax ? rowMax : prevMax;
  }, 0);
  console.log("Max Score: ", computedScenicScore);
} catch (err) {
  console.error(err);
}
