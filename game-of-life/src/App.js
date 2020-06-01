import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 50;
const numCols = 70;

//neighbor cells
const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for( let i=0;i<numRows;i++){
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for( let i=0;i<numRows;i++){
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  
  const runningRef = useRef();
  runningRef.current = running

  const runSimulation = useCallback(() => {
    //kill condition
    if(!runningRef.current){
      return;
    }

    //simulate
    setGrid((g) => {
      return produce(g, gridCopy => {
        for(let i=0; i<numRows; i++){
          for(let j=0; j<numCols; j++){
            let neighbors = 0;
            operations.forEach(([x,y]) => {
              const newI = i+x;
              const newJ = j+y;
              if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols){
                neighbors += g[newI][newJ]
              }
            })
            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][j] = 0;
            }
            else if(g[i][j] === 0 && neighbors === 3){
              gridCopy[i][j] = 1;
            }
          }
        }
    
      })
    })

    //repeat
    setTimeout(runSimulation, 100);
  },[])

  return (
    <div className='App'>
    <h1 style={{marginTop:10, marginBottom: 2,color:'white'}}>The Game of Life</h1>
    <p style={{color:'white'}}><i>John Conway's Game of Life is a zero-player game, played by by creating an initial configuration and observing how it evolves. For more information, <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" style={{color:'#bbbbbb'}}>click here</a>.</i></p>
    <div className='Buttons'>
    <button className='Button' onClick={() => {
      setRunning(!running);
      if(!running){
      runningRef.current = true;//to ensure no race condition occurs between runningRef getting updated and runSimulation occuring
      runSimulation();
      }
    }}>
    {running ? 'stop' : 'start'}
    </button> 
    <button className='Button' onClick={() => {
      const rows = [];
      for( let i=0;i<numRows;i++){
        rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 :0))
        );
     }setGrid(rows);
    }}>
     random
    </button> 
    <button className='Button' onClick={() => {
      setGrid(generateEmptyGrid());
    }}>
      clear
    </button> 
    </div>
    <div className='Grid' style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols},18px)`
    }}>
     {grid.map((rows,i) => 
        rows.map((col,j) => (
            <div key={`${i}-${j}`} 
              onClick={()=>{
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
              style={{width:18, height:18, 
              backgroundColor: grid[i][j] ? 'pink' : undefined,
              border: 'solid 1px black'}}/>)))}
    </div>
    </div>
  );
}

export default App;
