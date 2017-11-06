import React from 'react';
import TurtleWalking from './sprites/turtle_walking';
import TurtleStanding from './sprites/turtle_standing';

class Root extends React.Component {
  render() {
    return (
        <TurtleStanding />
    );
  }
}

export default Root;
