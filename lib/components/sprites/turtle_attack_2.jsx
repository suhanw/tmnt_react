import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleAttack2 extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={120}
        height={94}
        sprite='./assets/spritesheets/mikey-attack-2.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={45}
        startFrame={0}
        stopLastFrame={true}
        frameCount={3}
        wrapAfter={3}
         />
    );
  }
}

export default TurtleAttack2;
