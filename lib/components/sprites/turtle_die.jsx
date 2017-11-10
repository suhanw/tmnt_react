import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleDie extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={140}
        height={79}
        sprite='./assets/spritesheets/mikey-die.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={5}
        startFrame={0}
        stopLastFrame={true}
        frameCount={7}
        wrapAfter={7}
         />
    );
  }
}

export default TurtleDie;
