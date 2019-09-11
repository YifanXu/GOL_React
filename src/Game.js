import React from 'react'
import { ButtonGroup, Button} from 'reactstrap'
import './Game.css'

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
            cycle: 0,
            populateChance: 0.3,
            updateInterval: 100,
            showNeighbors: false,
            grid: this.initGrid(this.props.size)
        }
    }

    componentDidMount() {
        this.interval = setInterval(() =>{
            if(this.state.paused) return;
            this.updateGrid();
        }, this.state.updateInterval);

        this.reset = this.initGrid.bind(this)
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
       if (this.props.hardEdge && (row < 0 || row >= this.props.size || col < 0 || col >= this.props.size)) {
           return;
       }

       if(!this.props.hardEdge) {
           if(row < 0) row = this.props.size - 1;
           if(row >= this.props.size) row = 0;
           if(col < 0) col = this.props.size - 1;
           if(col >= this.props.size) col = 0;
       }
       grid[row][col].neighbor += change;
    }

    randomPopulate(chance) {
        let hitList = [];
        for(let i = 0; i < this.props.size; i++) {
            for(let j = 0; j < this.props.size; j++) {
                if(Math.random() <= chance) {
                    hitList.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        console.log(`repopulating ${hitList.length} cells`)
        this.handleChange(hitList)
    }

    render() {
        //If the grid actually has a different size than expected, rerender
        if(this.state.grid.length !== this.props.size) {
            this.forceUpdate();
        }

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
                            {/* {this.state.showNeighbors ? this.state.grid[i][j].neighbor : null} */}
                        </button>
                    </th>
                )
            }
            rows.push(<tr key={i}>{row}</tr>)
        }
        return (
            <div>
                <table>
                    <tbody>{rows}</tbody>
                </table>
                <br/>
                <div className="controllGroup">
                    <ButtonGroup>
                        <Button onClick={()=> this.setState({paused: !this.state.paused})}>{this.state.paused ? 'Paused' : 'Running'}</Button>
                        <Button onClick={this.updateGrid.bind(this)}>Next</Button>
                        <Button onClick={()=>this.randomPopulate(this.state.populateChance)}>Flip {this.state.populateChance * 100}% cells</Button>
                        <Button onClick={()=>this.setState({grid: this.initGrid(this.props.size)})}>Clear</Button>
                    </ButtonGroup>
                </div>
                <div className="controllGroup">
                    Flip chance
                    <input value={this.state.populateChance} onChange={e=>this.setState({populateChance: e.target.value})}/>
                </div>
                <div className="controllGroup">
                    Show Neighbor Count
                    <input type="checkbox" value={this.state.showNeighbors} onChange={e=>this.setState({showNeighbors: e.target.value})}/>
                </div>
                <div className="controllGroup">
                    Update Interval: 
                    <input value={this.state.updateInterval} onChange={e=>{
                        const newInterval = e.target.value
                        this.setState({updateInterval: newInterval})
                        if(this.interval) {
                            clearInterval(this.interval);
                        }
                        this.interval = setInterval(() =>{
                            if(this.state.paused) return;
                            this.updateGrid();
                        }, newInterval);
                    }}/>
                </div>
                
                <p>Cycle {this.state.cycle}</p>
            </div>
        )
    }
}

export default GameOfLife