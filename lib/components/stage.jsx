import React from 'react';
import Turtle from './turtle';
import TurtleWalking from './sprites/turtle_walking';

class Stage extends React.Component {
  render() {
    return (
      <div className="stage">
        <Turtle />
      </div>
    );
  }
}

export default Stage;
