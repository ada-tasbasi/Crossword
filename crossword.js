const puzzleWidth = 8,
      puzzleHeight = 8,
      words = ["EAST",
               "SEA",
               "TEA",
               "SET",
               "EAT"
              ]          

let gameNodes = [],
    wordRecord = [],
    reset = false        

const generate = (width, height) => {
  gameNodes = []
  reset = false
  for (let i = 0; i < height; i++) {
    for (let n = 0; n < width; n++) {
      gameNodes.push({id:(i*width+n), alignment: "", content:""})
    }
  }
}

const isValid = (currentNode, char, startRow, alignment, index) =>{
  if(currentNode){
  let proximityCheck = true
  if(index === 0){
    gameNodes.forEach((el)=>{
       if(el.alignment === alignment){
         console.log(currentNode.id, el.id)
         proximityCheck = alignment === "horizontal"? 
           Boolean(Math.abs(currentNode.id - el.id) > puzzleWidth*2):
           Boolean(Math.abs(currentNode.id - el.id) > 1)
       }
      })
    }
    const currentRow = currentNode.id % puzzleWidth === 0? Math.ceil(currentNode.id / puzzleWidth)+1: Math.ceil(currentNode.id / puzzleWidth)
    const nodeCheck = Boolean(gameNodes[currentNode.id].content === char||currentNode.content === "")
    const rowCheck = alignment === "horizontal" ? Boolean(startRow === currentRow): true
    return Boolean(nodeCheck&&rowCheck&&proximityCheck)
  }else{
    return false
  }
}

const chooseWord = () => {
  let firstNode = true,
      alignment,
      wordList = {horizontal: [], vertical: []},
      puzzleContent = []

 do{
   wordList = {horizontal: [], vertical: []}
   words.forEach((word) => {
      const resultList = Math.floor(Math.random()*2) ? wordList.horizontal: wordList.vertical
      resultList.push(word)
  })  
  }while(Math.abs(wordList.horizontal.length - wordList.vertical.length) > 1)
  while(wordList.horizontal.length || wordList.vertical.length){
    let maxIterations = 0    
    if(firstNode){
        alignment = wordList.horizontal.length > wordList.vertical.length ? "horizontal" : "vertical" 
    }else{
      alignment = alignment === "horizontal" ? "vertical" : "horizontal"
    }
    const wordContent = []
    let randIndex = Math.floor(Math.random()* wordList[alignment].length)
    do{
      if(maxIterations > 5000){
        reset = true
        return 0
      }else if(maxIterations > 1000){
        randIndex = Math.floor(Math.random()* wordList[alignment].length)
      }
      randWord = wordList[alignment][randIndex]
      wordContent.push(...insertWord(randWord, alignment, wordList, firstNode))
      maxIterations++
    }while(wordContent.length < 1)
    firstNode = false
    wordList[alignment].splice(randIndex, 1)
    puzzleContent.push(...wordContent)
    puzzleContent.forEach((el)=>{
      const foundIndex = gameNodes.findIndex(node => node.id === el.id)
      gameNodes[foundIndex].content = el.content
      gameNodes[foundIndex].alignment = el.alignment
    })  
  }
  return puzzleContent    
}



const insertWord = (word, alignment, isFirst) => {
  let nodeIndex = Math.floor(Math.random()*gameNodes.length),
      wordContent = [],
      charCross = 0
      startRow = 0
      for(let i = 0; i < word.length; i++){
        const currentNode = gameNodes[nodeIndex],
              char = word[i]
        if(i === 0 && alignment === "horizontal"){
          startRow = Math.ceil(currentNode.id / puzzleWidth)
        }      
        if(isValid(currentNode, char, startRow, alignment, i)){
          const alignNode = gameNodes.find(el => el.id === currentNode.id)
          const alignCheck =  alignNode?alignNode.alignment === alignment:false
          if(gameNodes[currentNode.id].content === char&&!isFirst&&!alignCheck)charCross++
          wordContent.push({id:currentNode.id, alignment:alignment, content:char})
          if(charCross === 0&& i === word.length-1&&!isFirst)wordRecord.splice(-1, 1)
          nodeIndex = alignment === "horizontal"? nodeIndex + 1 : nodeIndex + puzzleWidth
          if(i === 0)wordRecord.push({content:char, node:currentNode.id, ali:alignment})
        }else{
          if(i)wordRecord.splice(-1, 1)
          wordContent = []
          break;
        }
      }
      if(charCross === 0&&!isFirst){wordContent = []}
     return wordContent
}

const initialize = () => {
  generate(puzzleWidth, puzzleHeight)
  chooseWord()
}

do{
  initialize()
}while(reset)

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




