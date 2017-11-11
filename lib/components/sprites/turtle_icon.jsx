import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleIcon extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={25}
        height={19}
        sprite='./assets/spritesheets/mikey-icon.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={5}
        startFrame={0}
        stopLastFrame={false}
        frameCount={7}
        wrapAfter={7}
         />
    );
  }
}

export default TurtleIcon;
