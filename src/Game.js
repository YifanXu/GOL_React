import React from 'react'
import './Game.css'

const updateInterval = 100;

const unSelectedStyle = {
    'color': 'black',
    'backgroundColor': 'white'
}

const selectedStyle = {
    'color': 'white',
    'backgroundColor': 'red'
}

class GameOfLife extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            paused: true,
            hardEdge: false,
            cycle: 0,
            updateInterval: 100,
            grid: this.initGrid(this.props.size)
        }
    }

    componentDidMount() {
        this.interval = setInterval(() =>{
            if(this.state.paused) return;
            this.updateGrid();
        }, this.state.updateInterval);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
   
    initGrid (size) {
        let grid = [];
        for(let i = 0; i < this.props.size; i++) {
            let gridRow = [];
            for(let j = 0; j < this.props.size; j++) {
                gridRow.push({
                    status: false,
                    neighbor: 0,
                });
            }
            grid.push(gridRow)
        }
        return grid;
    }

    updateGrid () {
        let flipList = [];
        for(let i = 0; i < this.state.grid.length; i++) {
            for(let j = 0; j < this.state.grid[i].length; j++) {
                let cell = this.state.grid[i][j];
                
                // Setup Rule
                if((cell.status && (cell.neighbor < 2 || cell.neighbor > 3)) || (!cell.status && cell.neighbor === 3)) {
                    flipList.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        this.handleChange(flipList)
        this.setState({
            cycle: this.state.cycle + 1
        })
    }

    handleChange(coordinates) {
        let newDataSet = this.state.grid.slice();
        for(let i = 0; i < coordinates.length; i++) {
            // Is Adding?
            let value = newDataSet[coordinates[i].row][coordinates[i].col].status

            // Update Status
            newDataSet[coordinates[i].row][coordinates[i].col].status =  value ? 0 : 1;

            // Update Neighbor Count
            const delta = value ? -1 : 1;
            for(let rowDelta = -1; rowDelta <= 1; rowDelta++) {
                for(let colDelta = -1; colDelta <= 1; colDelta++) {
                    if(rowDelta === 0 && colDelta === 0) {
                        continue;
                    }
                    this.updateNeighbor(newDataSet, coordinates[i].row + rowDelta, coordinates[i].col + colDelta, delta)
                }
            }
        }
        this.setState({grid: newDataSet})
    }

    updateNeighbor (grid, row, col, change) {
       if (this.state.hardEdge && (row < 0 || row >= this.props.size || col < 0 || col >= this.props.size)) {
           return;
       }

       if(!this.state.hardEdge) {
           if(row < 0) row = this.props.size - 1;
           if(row >= this.props.size) row = 0;
           if(col < 0) col = this.props.size - 1;
           if(col >= this.props.size) col = 0;
       }
       grid[row][col].neighbor += change;
    }

    randomPopulate(chance) {
        let listLength = this.props.size * this.props.size * chance;
        let hitList = [];
        for(let i = 0; i < listLength; i++) {
            hitList.push({
                row: Math.floor(Math.random() * this.props.size),
                col: Math.floor(Math.random() * this.props.size)
            })
        }
        this.handleChange(hitList)
    }

    render() {
        let rows = [];
        // Construct Elements
        for(let i = 0; i < this.props.size; i++) {
            let row = [];

            for(let j = 0; j < this.props.size; j++) {
                row.push(
                    <th key={j}>
                        <button 
                            style={this.state.grid[i][j].status ? selectedStyle : unSelectedStyle} 
                            className="gridButton"
                            onClick={()=>this.handleChange([{row: i, col: j}])}
                        >
                            {this.state.grid[i][j].neighbor}
                        </button>
                    </th>
                )
            }
            rows.push(<tr key={i}>{row}</tr>)
        }
        return (
            <div>
                <h1>Conway's Game of Life (React Edition)</h1>
                <table>
                    <tbody>{rows}</tbody>
                </table>
                <br/>
                <div>
                    <button onClick={()=> this.setState({paused: !this.state.paused})}>{this.state.paused ? 'Paused' : 'Running'}</button>
                    <button onClick={this.updateGrid.bind(this)}>Next</button>
                </div>
                <input value={this.state.updateInterval} onChange={e=>{
                    this.setState({updateInterval: e.target.value})
                    if(this.interval) {
                        clearInterval(this.interval);
                    }
                    this.interval = setInterval(() =>{
                        if(this.state.paused) return;
                        this.updateGrid();
                    }, this.state.updateInterval);
                }}/>
                <button onClick={()=>this.randomPopulate(0.3)}>Spice it up</button>
                <p>Cycle {this.state.cycle}</p>
            </div>
        )
    }
}

export default GameOfLife