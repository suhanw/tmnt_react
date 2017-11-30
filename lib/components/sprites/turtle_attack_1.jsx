import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleAttack1 extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 90;
      this.height = 90;
      this.frameCount = 5;
    } else if (turtleName === 'leo') {
      this.width = 95;
      this.height = 67;
      this.frameCount = 3;
    } else if (turtleName === 'don') {
      this.width = 168;
      this.height = 73;
      this.frameCount = 3;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-attack.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={45}
        startFrame={0}
        stopLastFrame={true}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount}
         />
    );
  }
}

export default TurtleAttack1;
