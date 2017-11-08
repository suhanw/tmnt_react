import React from 'react';
import Viewport from './viewport';
import Stage from './stage';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

// fix frame width and size
// contains nav links and instructions
// starts and ends the game loop

class Game extends React.Component {

  render() {
    return (
      <div className="game"
        style={this.renderStyles()}>
        <Viewport>
          <Stage />
        </Viewport>
      </div>
    );
  }

  componentDidMount() {

  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

}

export default Game;
