import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

class Lose extends React.Component {
  render() {
    return (
      <div className="lose"
        style={this.renderStyles()}>
        Press 'C' to continue.
      </div>
    );
  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", (e)=>{
      if (e.code === 'KeyC') {
        this.props.history.push("/game");
      }
    });
  }
}

export default Lose;
