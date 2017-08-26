import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './Game.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            posited: false,
            className: this._calcClassName(),
            blowingup: false,
        };
    }

    render() {
        var className = this.state.className;

        if (!this.state.posited && this.state.blowingup && this.props.value === 'X') {
            className += " blowup";
        }

        if (this.state.posited) {
            className += " posited"
        }

        if (this.state.selected) {
            className += " type-" + this.props.value;
        }

        return (
            <button className={className} onClick={(evt) => this._handleClick(evt)}>
                {this.state.selected ? this.props.value : "?"}
            </button>
        );
    }

    blowup() {
        this.setState({blowingup: true})
    }

    handleEmptyNextDoor() {
        if (!this.state.selected && !this.state.posited) {
            this._normalClick();
        }
    }

    _calcClassName() {
        var className = 'square';
        if (this.props.nm % 16 === 0) {
            className += ' begin'
        }
        if (this.props.nm % 16 === 15) {
            className += ' end'
        }
        return className;
    }

    _handleClick(evt) {
        if (this.state.blowingup === true) {
            return;
        }
        if (evt.shiftKey) {
            this._shiftClick()
        } else {
            this._normalClick()
        }
    }

    _normalClick() {
        this.setState({posited: false});
        if (this.props.value === 'X') {
            this.setState({blowingup: true});
            this.props.blowup();
            return
        }
        let call = (() => {
            this.render();
            if (this.props.value === '0') {
                this.props.findEmpties(this.props.nm)
            }
        });
        this.setState({selected: true}, call);
    }

    _shiftClick() {
        this.setState({posited: true})
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date().getTime()
        };
    }

    render() {
        var elapsedTime = Math.floor((new Date().getTime() - this.state.startTime) / 1000);
        var min = Math.floor(elapsedTime / 60);
        var sec = elapsedTime - (min * 60);
        var str = min + ':' + sec
        return (<div className="timer">
                {str} s
            </div>
        )
    }

    cancelTimer() {
        clearInterval(this.state.timer)
    }

    componentDidMount() {
        this.setState({timer: setInterval(this._tick.bind(this), 1000)});
    }

    _tick() {
        this.setState({});
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.square_values = [
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
        this.state = {
            squares: [],
            bombCount: 32
        }
    }

    render() {
        this.state = {squares: []};
        return (
            <div className="game">
                <Timer ref={(input) => this.timer = input}/>
                <div className="game-board">
                    {_.range(0, 16 * 16).map((element, i) => {
                        return this._renderSquare(i)
                    })}
                </div>
            </div>
        );
    }

    blowup() {
        this.state.squares.map((sq) => sq.blowup());
        this.timer.cancelTimer();
    }

    findEmpties(num) {
        this._messageToNeighbours(num, this._handleNextDoors);
    }

    _handleNextDoors(sq) {
        sq.handleEmptyNextDoor.apply(sq);
    }

    _messageToNeighbours(num, call) {
        var row = Math.floor(num / 16);
        var col = num % 16;

        for (var i = row - 1; i <= row + 1; i++) {
            if (i >= 0 && i < 16) {
                for (var j = col - 1; j <= col + 1; j++) {
                    if (j >= 0 && j < 16) {
                        var sq = i * 16 + j;
                        if (sq !== num) {
                            call(this.state.squares[sq]);
                        }
                    }
                }
            }
        }
    }

    _renderSquare(i) {
        return (
            <Square
                value={this.square_values[i]}
                key={i}
                nm={i}
                ref={(input) => {
                    input ? this.state.squares.push(input) : ''
                }}
                findEmpties={this.findEmpties.bind(this)}
                blowup={this.blowup.bind(this)}
            />
        );
    }
}

ReactDOM.render(<Game/>, document.getElementById("root"))

export default Game;
