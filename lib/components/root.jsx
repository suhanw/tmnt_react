import React from 'react';
import TurtleWalking from './sprites/turtle_walking';
import TurtleStanding from './sprites/turtle_standing';
import TurtleAttack from './sprites/turtle_attack';
import Gameframe from './gameframe';

class Root extends React.Component {
  render() {
    return (
      <Gameframe />
    );
  }
}

export default Root;
