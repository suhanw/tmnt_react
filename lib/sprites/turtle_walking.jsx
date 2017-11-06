import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleWalking extends React.Component {

  render() {
    return (
      <div onClick={()=>alert('test')}>
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
      </div>
    );
  }
}

export default TurtleWalking;
