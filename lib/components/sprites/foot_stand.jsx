import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class FootStand extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={46}
        height={56}
        sprite='./assets/spritesheets/foot-stand.png'
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

export default FootStand;
