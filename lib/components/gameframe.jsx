import React from 'react';
import Viewport from './viewport';
import Stage from './stage';

class Gameframe extends React.Component {

  render() {
    return (
      <div className="gameframe"
        onKeyPress={this.handleKeyPress}>
        <Viewport>
          <Stage />
        </Viewport>
      </div>
    );
  }

  handleKeyPress(e) {
    // if (e.key === 39) {
    //
    // }
    debugger
    alert(e.key);
  }
}

export default Gameframe;
