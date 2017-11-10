import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleJump extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={43}
        height={45}
        sprite='./assets/spritesheets/mikey-jump.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={8}
        startFrame={0}
        stopLastFrame={false}
        frameCount={4}
        wrapAfter={4}
         />
    );
  }
}

export default TurtleJump;
