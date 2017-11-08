import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleWalk extends React.Component {

  render() {
    return (
      <SpriteAnimator
        width={45}
        height={65}
        sprite='./assets/spritesheets/mikey-walking.png'
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

export default TurtleWalk;
