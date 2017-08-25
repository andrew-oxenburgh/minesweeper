import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    render() {
        var className = this.props.className;
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
            '0', '0', '0', '0',
            '0', '1', '1', '1',
            '0', '1', 'X', '1',
            '0', '1', '1', '1'
        ];
    }

    renderSquare(i, className) {
        return (
            <Square
                value={this.squares[i]}
                className={className}
            />
        );
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    {this.renderSquare(0, "square begin")}
                    {this.renderSquare(1, "square")}
                    {this.renderSquare(2, "square")}
                    {this.renderSquare(3, "square end")}
                    {this.renderSquare(4, "square begin")}
                    {this.renderSquare(5, "square")}
                    {this.renderSquare(6, "square")}
                    {this.renderSquare(7, "square end")}
                    {this.renderSquare(8, "square begin")}
                    {this.renderSquare(9, "square")}
                    {this.renderSquare(10, "square")}
                    {this.renderSquare(11, "square end")}
                    {this.renderSquare(12, "square begin")}
                    {this.renderSquare(13, "square")}
                    {this.renderSquare(14, "square")}
                    {this.renderSquare(15, "square end")}
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById("root"));

export default Game;
