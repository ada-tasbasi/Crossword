const puzzleWidth = 7,
      puzzleHeight = 7,
      words = ["EAST",
               "SEA",
               "TEA",
               "SET",
               "EAT"
              ]

let bar = [],
    gameNodes = []          

const generate = (width, height) => {
  gameNodes = []
  for (let i = 0; i < height; i++) {
    for (let n = 0; n < width; n++) {
      gameNodes.push({id:(i*width+n), content:""})
    }
  }
}

const isValid = (currentNode, char, startRow, alignment) =>{
  if(currentNode){
    const currentRow = currentNode.id % puzzleWidth === 0? Math.ceil(currentNode.id / puzzleWidth)+1: Math.ceil(currentNode.id / puzzleWidth)
    const nodeCheck = Boolean(gameNodes[currentNode.id].content === char||currentNode.content === "")
    const rowCheck = alignment === "horizontal" ? Boolean(startRow === currentRow): true
    return Boolean(nodeCheck&&rowCheck)
  }else{
    return false
  }
}

const insertWord = (word, width) => {
  let nodeIndex = Math.floor(Math.random()*gameNodes.length),
      alignment = Math.floor(Math.random()*2) ? "vertical" : "horizontal",
      puzzleContent = [],
      startRow = 0
  for(let i = 0; i < word.length; i++){
    const currentNode = gameNodes[nodeIndex],
          char = word[i]
    if(i === 0 && alignment === "horizontal"){
      startRow = Math.ceil(currentNode.id / puzzleWidth)
    }      
    if(isValid(currentNode, char, startRow, alignment)){
      puzzleContent.push({id:currentNode.id, content:char})
      nodeIndex = alignment === "horizontal"? nodeIndex + 1 : nodeIndex + width
    }else{
      puzzleContent = []
      break;
    }
  }      
  return puzzleContent
}

const initialize = () => {
  let maxIterations = 0
  generate(puzzleWidth, puzzleHeight)
  words.forEach((word) =>{
    const puzzleContent = []
    do{
      puzzleContent.push(...insertWord(word, puzzleWidth))
      maxIterations++
    }while(puzzleContent.length < 1 && maxIterations<100)
    puzzleContent.forEach((el)=>{
      const foundIndex = gameNodes.findIndex(node => node.id === el.id)
      gameNodes[foundIndex].content = el.content
    })   
  })
}

initialize()

const render = () => {
  let output = "",
      counter = 0
  for (let index = 0; index < gameNodes.length; index++) {
    output += gameNodes[index].content ||"*"
    counter++
    output += " "
    if(counter % (puzzleWidth) === 0)output += "\n"
  }
  console.log(output)
}

render()

