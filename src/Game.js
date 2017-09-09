import React from 'react';
import PropTypes from 'prop-types';
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
        var str = '';

        if (!this.state.posited && this.state.blowingup && this.props.value === 'X') {
            className += ' blowup';
            return (
                <button className={className} onClick={(evt) => this._handleClick(evt)}>
                    <i className="fa fa-bomb" aria-hidden="true"></i>
                </button>
            );
        }

        if (this.state.posited) {
            className += ' posited';
            return (
                <button className={className} onClick={(evt) => this._handleClick(evt)}>
                    <i className="fa fa-bomb" aria-hidden="true"></i>
                </button>
            );
        }

        if (this.state.selected) {
            className += ' selected type-' + this.props.value;
        } else {
            className += ' unselected';
        }

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
        this.setState({blowingup: true});
    }

    handleEmptyNextDoor() {
        if (!this.state.selected && !this.state.posited) {
            this._normalClick();
        }
    }

    _calcClassName() {
        var className = 'square';
        if (this.props.nm % 16 === 0) {
            className += ' begin';
        }
        if (this.props.nm % 16 === 15) {
            className += ' end';
        }
        return className;
    }

    _handleClick(evt) {
        if (this.state.blowingup === true) {
            return;
        }
        if (evt.shiftKey) {
            this._shiftClick();
        } else {
            this._normalClick();
        }
        this.props.game.update();
    }

    _normalClick() {
        this.setState({posited: false});
        if (this.props.value === 'X') {
            this.setState({blowingup: true});
            this.props.game.blowup();
            return;
        }
        let call = (() => {
            this.render();
            if (this.props.value === '0') {
                this.props.game.findEmpties(this.props.nm);
            }
        });
        this.setState({selected: true}, call);
    }

    _shiftClick() {
        var posited = !this.state.posited;
        this.setState({posited: posited});
    }
}

Square.propTypes = {
    value: PropTypes.any,
    nm: PropTypes.any,
    blowup: PropTypes.any,
    game: PropTypes.any
};

class Game extends React.Component {
    constructor(props) {
        super(props);

        var bombCount = 20;
        var square_values = new Array(16 * 16).fill(0);
        while (bombCount > 0) {
            var bombHere = Math.floor(Math.random() * 16 * 16);
            if (square_values[bombHere] !== 'X') {
                square_values[bombHere] = 'X';
                this._messageToNeighbours(bombHere, this.incrementCount.bind(this, square_values));
                bombCount--;
            }
        }

        square_values = square_values.map((val) => {
            return val + '';
        });

        this.state = {
            squares: [],
            bombCount: 20,
            square_values: square_values
        };
    }

    update() {
        this.bombCounter.update();
    }


    render() {
        return (
            <div className="game">
                <div>Click to guess</div>
                <div>Shift click to posit the existence of a bomb under the cursor</div>
                <div>To start a new game, refresh the screen</div>
                <div>The counter is bit buggy</div>
                <div>It is a bit inconclusive whether you have won and/or finished</div>
                <Timer game={this} ref={(input) => this.timer = input}/>
                <BombCounter game={this} ref={(input) => this.bombCounter = input}/>
                <div className="game-board">
                    {_.range(0, 16 * 16).map((element, i) => {
                        return this._renderSquare(i);
                    })}
                </div>
            </div>
        );
    }

    incrementCount(square_values, sq) {
        if (square_values[sq] !== 'X') {
            square_values[sq]++;
        }
    }

    blowup() {
        this.state.squares.map((sq) => sq.blowup());
        this.bombCounter.blowup();
        this.finish();
    }

    finish(){
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
                    if (input) this.state.squares.push(input);
                }}
                game={this}
            />
        );
    }
}

class BombCounter extends React.Component {
    constructor() {
        super();
        this.state = {
            posited: 0,
            face: 'meh-o'
        };
    }

    render() {
        return (<div className="bomb-counter">
            <i className={'fa fa-' + this.state.face} aria-hidden="true"></i>
            {this.props.game.state.bombCount - this.state.posited}/{this.props.game.state.bombCount}
        </div>);
    }

    blowup(){
        this.setState({face: 'frown-o'});
    }

    update() {
        var posited = this.props.game.state.squares.reduce(
            (cnt, sq) => {
                if (sq.state.posited) {
                    cnt++;
                }
                return cnt;
            }, 0
        );

        if (posited == this.props.game.state.bombCount) {
            var correct = this.props.game.state.squares.reduce(
                (cnt, sq) => {
                    if (sq.state.posited && sq.props.value == 'X') {
                        cnt++;
                    }
                    return cnt;
                }, 0
            );
            if (correct == this.props.game.state.bombCount) {
                this.setState({face: 'smile-o'});
                this.props.game.finish();
            } else {
                this.setState({face: 'frown-o'});
            }
        }

        this.setState({posited: posited});
    }
}

BombCounter.propTypes = {
    game: PropTypes.any
};

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
        if (sec.length === 1) {
            sec = '0' + sec;
        }
        if (min.length === 1) {
            min = '0' + min;
        }
        var str = min + ':' + sec;
        return (<div className="timer">
                {str}
            </div>
        );
    }

    cancelTimer() {
        clearInterval(this.state.timer);
    }

    componentDidMount() {
        this.setState({timer: setInterval(this._tick.bind(this), 1000)});
    }

    _tick() {
        this.setState({});
        this.props.game.update();
    }
}

Timer.propTypes = {
    game: PropTypes.any
};

export default Game;
