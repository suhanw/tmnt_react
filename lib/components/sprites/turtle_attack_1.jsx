import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleAttack1 extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={90}
        height={90}
        sprite='./assets/spritesheets/mikey-attack.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={45}
        startFrame={0}
        stopLastFrame={true}
        frameCount={5}
        wrapAfter={5}
         />
    );
  }
}

export default TurtleAttack1;
