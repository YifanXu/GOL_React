import React from 'react';
import './App.css';
import GameOfLife from './Game'

function App() {
  return (
    <div className="App">
      <GameOfLife size={50}/>
    </div>
  );
}

export default App;
