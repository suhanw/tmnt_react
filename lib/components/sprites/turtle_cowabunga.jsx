import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleCowabunga extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 105;
      this.height = 150;
      this.frameCount = 13;
    } else if (turtleName === 'leo') {
      this.width = 105;
      this.height = 150;
      this.frameCount = 13;
    } else if (turtleName === 'don') {
      this.width = 105;
      this.height = 150;
      this.frameCount = 13;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-cowabunga.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={10}
        startFrame={0}
        stopLastFrame={true}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount}
         />
    );
  }
}

export default TurtleCowabunga;
