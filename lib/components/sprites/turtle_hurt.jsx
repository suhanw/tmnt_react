import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleHurt extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={70}
        height={70}
        sprite='./assets/spritesheets/mikey-hurt.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={10}
        startFrame={0}
        stopLastFrame={false}
        frameCount={2}
        wrapAfter={2}
         />
    );
  }
}

export default TurtleHurt;
