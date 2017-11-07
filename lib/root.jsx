import React from 'react';
import TurtleWalking from './sprites/turtle_walking';
import TurtleStanding from './sprites/turtle_standing';
import TurtleAttack from './sprites/turtle_attack';

class Root extends React.Component {
  render() {
    return (
      <div id="turtle">
        <TurtleAttack />
      </div>
    );
  }
}

export default Root;
