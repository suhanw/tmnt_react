import React from 'react';
import TurtleWalk from './sprites/turtle_walk';
import TurtleStand from './sprites/turtle_stand';
import TurtleAttack from './sprites/turtle_attack';

// tracks its own pos relative to stage (redux)
// tracks its half length (redux)
// tracks health (redux)
// keypress event handlers
// sprite state (redux)
// Walk
// Stand
// Attack
// Note: if turtle is attack and foot is stand, and dist betw centers <= half lengths, then foot loses health

class Turtle extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="turtle">
        <TurtleStand />
      </div>
    );
  }
}

export default Turtle;
