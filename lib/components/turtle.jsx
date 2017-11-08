import React from 'react';
import TurtleWalking from './sprites/turtle_walking';

class Turtle extends React.Component {
  render() {
    return (
      <div className="turtle">
        <TurtleWalking />
      </div>
    );
  }
}

export default Turtle;
