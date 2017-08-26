import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './Game.css';

class Square extends React.Component {
    constructor(props) {
        super(props);


        var className = 'square';
        if (this.props.nm % 16 === 0) {
            className += ' begin'
        }
        if (this.props.nm % 16 === 15) {
            className += ' end'
        }

        this.state = {
            selected: false,
            posited: false,
            className: className,
            blowingup: false,
            findEmpties: this.props.findEmpties.bind(this, this.props.nm)
        };
    }

    blowup() {
        this.setState({blowingup: true}, this.render)
    }

    handleEmptyNextDoor() {
        if (!this.state.selected && !this.state.posited) {
            this._normalClick();
        }
    }

    _handleClick(evt) {
        if (this.state.blowingup === true) {
            return;
        }
        if (evt.shiftKey) {
            this.setState({posited: true})
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
                this.state.findEmpties()
            }
        }).bind(this);
        this.setState({selected: true}, call);
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
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date().getTime()
        };
    }

    componentDidMount() {
        this.setState({timer: setInterval(this._tick.bind(this), 1000)});
    }

    cancelTimer() {
        clearInterval(this.timer)
    }

    _tick() {
        this.setState({});
    }

    render() {
        var elapsedTime = Math.floor((new Date().getTime() - this.state.startTime) / 1000);
        var min = Math.floor(elapsedTime / 60);
        var sec = elapsedTime - (min * 60);
        var str = min + ':' + sec
        console.log(elapsedTime);
        return (<div className="timer">
                {str} s
            </div>
        )
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
        this.state = {squares: []}
    }

    blowup() {
        this.state.squares.map((sq) => sq.blowup());
        this.timer.cancelTimer();
    }

    _handleNextDoors(sq) {
        sq.handleEmptyNextDoor.apply(sq);
    }

    findEmpties(num) {
        this._messageToNeighbours(num, this._handleNextDoors);
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
}

ReactDOM.render(<Game/>, document.getElementById("root"))

export default Game;
