import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class FootHurt extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={37}
        height={48}
        sprite='./assets/spritesheets/foot/foot-hurt.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={5}
        startFrame={0}
        stopLastFrame={false}
        frameCount={2}
        wrapAfter={2}
         />
    );
  }
}

export default FootHurt;
