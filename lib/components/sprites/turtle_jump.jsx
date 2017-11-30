import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleJump extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 43;
      this.height = 45;
      this.frameCount = 4;
    } else if (turtleName === 'leo') {
      this.width = 42;
      this.height = 45;
      this.frameCount = 4;
    } else if (turtleName === 'don') {
      this.width = 36;
      this.height = 45;
      this.frameCount = 4;
    } else if (turtleName === 'raph') {
      this.width = 42;
      this.height = 43;
      this.frameCount = 4;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-jump.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={8}
        startFrame={0}
        stopLastFrame={false}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount}
         />
    );
  }
}

export default TurtleJump;
