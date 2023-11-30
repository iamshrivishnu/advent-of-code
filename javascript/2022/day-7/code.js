const fs = require("fs");

const DIRECTORY = "DIRECTORY",
  FILE = "FILE";

const TOTAL_SIZE = 70000000, REQUIRED_SIZE = 30000000;

try {
  const data = fs.readFileSync("data.txt", "UTF-8");
  const commands = data
    .split("$")
    .map((entry) => entry.trim())
    .filter((entry) => entry);

  const getFilesAndFolders = (list) => {
    return list.reduce((prevState, line) => {
      const [block1, block2] = line.split(" ");
      if (block1 === "dir") {
        return {
          ...prevState,
          [block2]: {
            type: DIRECTORY,
            name: block2,
            size: 0,
            contents: {},
          },
        };
      } else {
        return {
          ...prevState,
          [block2]: {
            type: FILE,
            name: block2,
            size: block1,
          },
        };
      }
    }, {});
  };

  const getCurrentDirectory = (tree, currentDirectoryString) => {
    const currentDirectory = currentDirectoryString
      .split("/")
      .filter((entry) => entry)
      .reduce((prevState, currentEntry) => prevState.contents[currentEntry], tree);
    return currentDirectory;
  };

  const performActionForCommand = (prevState, currentCommand) => {
    const [command, ...output] = currentCommand.split("\n");
    if (command === "ls") {
      const filesAndFolder = getFilesAndFolders(output);
      const newTree = { ...prevState.tree };
      const currentDirectory = getCurrentDirectory(newTree, prevState.currentDirectory);
      currentDirectory.contents = filesAndFolder;
      return { ...prevState, tree: newTree }
    } else if (/^cd/.test(command)) {
      const newState = { ...prevState };
      const [_, operation] = command.split(" ");
      if (operation === "..") {
        newState.currentDirectory = newState.currentDirectory
          .split("/")
          .slice(0, -1)
          .join("/");
      } else {
        if(operation === "/"){
          newState.currentDirectory = "/";
        }else{
          newState.currentDirectory = newState.currentDirectory +( newState.currentDirectory === "/" ? "" : "/") + operation;
        }
      }
      return newState;
    } else {
      return prevState;
    }
  };

  const folders = [];

  const computeSizesAndListFolders = (directory)=>{
    const { contents } = directory;
    const foldersInDirectory = Object.values(contents).filter((entry)=>entry.type === DIRECTORY);
    for(let folderInDirectory of foldersInDirectory){
      if(Object.values(folderInDirectory.contents).length && folderInDirectory.size === 0){
        computeSizesAndListFolders(folderInDirectory);
      }
      folders.push({ name: folderInDirectory.name, size: folderInDirectory.size });
    }
    directory.size = Object.values(contents).reduce((prevSum,current)=>prevSum+Number(current.size),0);
  }

  // Puzzle One
  const { tree } = commands.reduce(performActionForCommand,
    { tree: {
      type: DIRECTORY,
      name: 'root',
      size: 0,
      contents: {},
    }, currentDirectory: "/" }
  );
  computeSizesAndListFolders(tree);
  folders.push({ name: "root", size: tree.size })
  const sumOfBelow1L = folders.reduce((prevSum,current)=>{
    if(current.size <= 100000){
      return prevSum+current.size;
    }else{
      return prevSum;
    }
  },0)
  console.log("Sum: ",sumOfBelow1L);
  
  // Puzzle Two
  folders.sort((a,b)=>a.size-b.size);
  const minSpaceNeededToBeDeleted = (REQUIRED_SIZE - (TOTAL_SIZE-tree.size));
  const folderToDelete = folders.find((folder)=>folder.size > minSpaceNeededToBeDeleted);
  console.log("Folder to delete: ",folderToDelete);
} catch (err) {
  console.error(err);
}
