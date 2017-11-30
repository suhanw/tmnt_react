import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleAttack2 extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 120;
      this.height = 94;
      this.frameCount = 3;
    } else if (turtleName === 'leo') {
      this.width = 90;
      this.height = 79;
      this.frameCount = 3;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-attack-2.png`}
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

export default TurtleAttack2;
