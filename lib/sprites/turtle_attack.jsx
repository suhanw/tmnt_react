import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleAttack extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={90}
        height={90}
        sprite='./assets/spritesheets/mikey-attack.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={8}
        startFrame={0}
        stopLastFrame={false}
        frameCount={6}
        wrapAfter={6}
         />
    );
  }
}

export default TurtleAttack;
