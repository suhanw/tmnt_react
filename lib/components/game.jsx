import React from 'react';
import Viewport from './viewport';
import Stage from './stage';

// fix frame width and size
// contains nav links and instructions
// starts and ends the game loop

class Game extends React.Component {

  render() {
    return (
      <div className="game"
        onKeyPress={this.handleKeyPress}>
        <Viewport>
          <Stage />
        </Viewport>
      </div>
    );
  }

  componentDidMount() {

  }
}

export default Game;
