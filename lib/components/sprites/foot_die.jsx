import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class FootDie extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={150}
        height={60}
        sprite='./assets/spritesheets/foot-die.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={15}
        startFrame={0}
        stopLastFrame={true}
        frameCount={8}
        wrapAfter={8}
         />
    );
  }
}

export default FootDie;
