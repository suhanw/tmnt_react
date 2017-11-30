import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleWalk extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 45;
      this.height = 65;
      this.frameCount = 4;
    } else if (turtleName === 'leo') {
      this.width = 50;
      this.height = 65;
      this.frameCount = 4;
    } else if (turtleName === 'don') {
      this.width = 59;
      this.height = 66;
      this.frameCount = 4;
    } else if (turtleName === 'raph') {
      this.width = 42;
      this.height = 64;
      this.frameCount = 4;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}/${turtleName}-walking.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={5}
        startFrame={0}
        stopLastFrame={false}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount}
        />
    );
  }
}

export default TurtleWalk;
