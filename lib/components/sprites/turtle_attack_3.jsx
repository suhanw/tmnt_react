import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleAttack3 extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={120}
        height={108}
        sprite='./assets/spritesheets/mikey-attack-3.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={45}
        startFrame={0}
        stopLastFrame={true}
        frameCount={6}
        wrapAfter={6}
         />
    );
  }
}

export default TurtleAttack3;
