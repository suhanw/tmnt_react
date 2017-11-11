import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleCowabunga extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={105}
        height={150}
        sprite='./assets/spritesheets/mikey-cowabunga.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={10}
        startFrame={0}
        stopLastFrame={true}
        frameCount={13}
        wrapAfter={13}
         />
    );
  }
}

export default TurtleCowabunga;
