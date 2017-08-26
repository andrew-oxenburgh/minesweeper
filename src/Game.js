import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './Game.css';

class Square extends React.Component {
    constructor(props) {
        super(props);


        var className = 'square';
        if(this.props.value%8===0){
            className += ' begin'
        }
        if(this.props.value%8===7){
            className += ' end'
        }

        this.state = {
            selected: false,
            posited: false,
            className: className
        };
    }

    render() {
        var className = this.state.className;
        if (this.state.selected) {
            className += " type-" + this.props.value;
        }
        return (
            <button className={className} onClick={() => this.handleClick()}>
                {this.state.selected ? this.props.value : "?"}
            </button>
        );
    }

    handleClick() {
        if (this.props.value === 'X') {
            alert('the end');
            return
        }
        this.setState({selected: true}, this.render);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.squares = [
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
            '0', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X', '1', '1', 'X', 'X',
            '0', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2', '1', '1', '2', '2',
        ];
    }

    renderSquare(i) {
        return (
            <Square
                value={this.squares[i]}
                key={i}
            />
        );
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    {_.range(0, 16*16).map((element, i)=>{return this.renderSquare(i)})};
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById("root"));

export default Game;
