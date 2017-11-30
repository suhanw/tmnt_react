import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleHurt extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 70;
      this.height = 70;
      this.frameCount = 2;
    } else if (turtleName === 'leo') {
      this.width = 70;
      this.height = 70;
      this.frameCount = 2;
    } else if (turtleName === 'don') {
      this.width = 52;
      this.height = 64;
      this.frameCount = 2;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-hurt.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={10}
        startFrame={0}
        stopLastFrame={false}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount}
         />
    );
  }
}

export default TurtleHurt;
