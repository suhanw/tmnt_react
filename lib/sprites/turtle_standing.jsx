import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleStanding extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={65}
        height={65}
        sprite='./assets/spritesheets/mikey-standing.png'
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

export default TurtleStanding;
