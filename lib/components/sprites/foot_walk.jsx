import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class FootWalk extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={32}
        height={64}
        sprite='./assets/spritesheets/foot-walk.png'
        direction="horizontal"
        shouldAnimate={true}
        fps={5}
        startFrame={0}
        stopLastFrame={false}
        frameCount={4}
        wrapAfter={4}
        />
    );
  }
}

export default FootWalk;
