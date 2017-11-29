import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleStand extends React.Component {

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={65}
        height={65}
        sprite={`./assets/spritesheets/${turtleName}-standing.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={8}
        startFrame={0}
        stopLastFrame={false}
        frameCount={11}
        wrapAfter={11}
         />
    );
  }
}

export default TurtleStand;
