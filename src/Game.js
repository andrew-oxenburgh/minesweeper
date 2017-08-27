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
            className += " selected type-" + this.props.value;
        } else {
            className += " unselected";
        }
        var str = "";

        if (this.state.selected && this.props.value !== '0') {
            str = this.props.value;
        }

        return (
            <button className={className} onClick={(evt) => this._handleClick(evt)}>
                {str}
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
        this.props.bombCounter.update();
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
        var posited = !this.state.posited;
        this.setState({posited: posited})
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        var bombCount = 20;
        var square_values = new Array(16 * 16).fill(0);
        while (bombCount > 0) {
            var bombHere = Math.floor(Math.random() * 16 * 16);
            if (square_values[bombHere] !== 'X') {
                square_values[bombHere] = 'X';
                this._messageToNeighbours(bombHere, function (sq) {
                    if (square_values[sq] !== 'X') {
                        square_values[sq]++;
                    }
                });
                bombCount--;
            }
        }

        square_values = square_values.map((val) => {
            return val + ''
        });


        this.state = {
            squares: [],
            bombCount: 32,
            square_values: square_values
        }
    }

    render() {
        return (
            <div className="game">
                <Timer ref={(input) => this.timer = input}/>
                <BombCounter game={this} ref={(input) => this.bombCounter = input}/>
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
        this._messageToNeighbours(num, this._handleNextDoors.bind(this));
    }

    _handleNextDoors(sq) {
        this.state.squares[sq].handleEmptyNextDoor.apply(this.state.squares[sq]);
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
                            call(sq);
                        }
                    }
                }
            }
        }
    }

    _renderSquare(i) {
        return (
            <Square
                value={this.state.square_values[i]}
                key={i}
                nm={i}
                ref={(input) => {
                    input ? this.state.squares.push(input) : ''
                }}
                findEmpties={this.findEmpties.bind(this)}
                blowup={this.blowup.bind(this)}
                bombCounter={this.bombCounter}
            />
        );
    }
}

class BombCounter extends React.Component {
    constructor() {
        super();
        this.state = {
            posited: 0
        }
    }

    render() {
        return (<div className="bomb-counter">
            {this.props.game.state.bombCount - this.state.posited}/{this.props.game.state.bombCount}
        </div>)
    }

    update() {
        var posited = this.props.game.state.squares.reduce(
            (cnt, sq) => {
                if (sq.state.posited) {
                    cnt++
                }
                return cnt;
            }, 1
        );

        this.setState({posited: Math.floor(posited / 2)});
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
        var min = Math.floor(elapsedTime / 60) + '';
        var sec = elapsedTime - (min * 60) + '';
        if (sec.length == 1) {
            sec = '0' + sec;
        }
        if (min.length == 1) {
            min = '0' + min;
        }
        var str = min + ':' + sec;
        return (<div className="timer">
                {str}
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

ReactDOM.render(<Game />, document.getElementById("root"));

export default Game;
