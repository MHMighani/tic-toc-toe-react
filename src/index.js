import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props){
  let className = "square"
  if(props.winnerStatus){
    className = "square winner"
  }
  return(
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}


class Board extends Component {
  renderSquare(i) {
    let winnerStatus = false
    let winner = this.props.winner
    if(winner && winner.includes(i)){
      winnerStatus = true
    }

    return(
      <Square
         winnerStatus = {winnerStatus}
         value={this.props.squares[i]}
         onClick = {()=>this.props.onClick(i)}
    />
  )}

  renderCol(rowNum){
    let squares = []
    for(let i=0;i<3;i++){
      squares = squares.concat(this.renderSquare(i+(rowNum*3)))
    }
    return squares
  }

  renderRow(rowNum){
    return(<div className="board-row">{this.renderCol(rowNum)}</div>)
  }

  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
      </div>
    );
  }
}

class Game extends Component {
  constructor(props){
    super(props);
      this.state = {
        history:[{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        lastCell:[],
        xIsNext: true,
        isAscending:true,
      }
    }

    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber + 1)
      const current = history[history.length-1]
      const squares = current.squares.slice()
      const lastCell = this.state.lastCell.slice(0,this.state.stepNumber)
      if(calculateWinner(squares) || squares[i]){
        return
      }

      squares[i] = this.state.xIsNext?"X":"O";
      this.setState({
        history:history.concat([{
          squares:squares,
        }]),
        stepNumber:history.length,
        lastCell:lastCell.concat(i),
        xIsNext:!this.state.xIsNext,
      })
    }

    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext:(step%2)===0
      })
    }

    colAndRow(move){
      let cellNum = this.state.lastCell[move-1]
      let row = Math.floor(cellNum/3) + 1
      let col = Math.floor(cellNum%3) + 1

      return(`  (${col}, ${row})`)
    }

    handleSortToggle(){
      this.setState({isAscending:!this.state.isAscending})
    }

  render(){
    let classN = "None"
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const moves = history.map((step,move)=>{
      const desc = move?
      "Go to move #" + move +this.colAndRow(move):
      "Go to game start"
      if(move===history.length-1){
        classN = "bold"
      }
      return(
        <li key={move}>
          <button className={classN} onClick={()=>(this.jumpTo(move))}>{desc}</button>
        </li>
      )
    })

    const isAscending = this.state.isAscending
    if(!isAscending){
      moves.reverse()
    }

    let status;
    if(winner){
      status = "The winner is: " + current.squares[winner[0]]
    }else if(drawCheck(current.squares)){
      status = "Draw!!"
    }else{
      status = "Next player is: " + (this.state.xIsNext?"X":"O")
    }

    // let button;
    // if(this.state.isAscending){
    //   button = <button>Descend</button>
    // }else{
    //   button = <button>Ascend</button>
    // }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner = {winner}
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={()=>this.handleSortToggle()}>
            {this.state.isAscending?'Descend':'Ascend'}
          </button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
    for (let i=0; i<lines.length; i++){
      const [a,b,c] = lines[i]
      if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
        return [a,b,c]
      }
    }
    return null
}

function drawCheck(squares){
  for(let i=0;i<9;i++){
    if(squares[i]===null){
      return false
    }
  }
  return true
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
