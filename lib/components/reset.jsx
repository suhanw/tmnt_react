import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

class Reset extends React.Component {
  constructor(props) {
    super(props);

    this.renderWin = this.renderWin.bind(this);
    this.renderLose = this.renderLose.bind(this);
  }
  render() {
    let message;
    if (this.props.match.path === '/win') {
      message = this.renderWin();
    } else if (this.props.match.path === '/lose') {
      message = this.renderLose();
    }

    return (
      <div className="win"
        style={this.renderStyles()}>
        {message}
        Press 'S' to play again.
      </div>
    );
  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

  renderWin() {
    return (
      <div>Congrats</div>
    );
  }

  renderLose() {
    return(
      <div>Sorry</div>
    );
  }

  componentDidMount() {
    document.addEventListener("keydown", (e)=>{
      if (e.code === 'KeyS') {

        // this.props.history.push("/game");
      }
    });
  }
}

export default Reset;
