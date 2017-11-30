import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleDie extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 140;
      this.height = 79;
      this.frameCount = 7;
    } else if (turtleName === 'leo') {
      this.width = 130;
      this.height = 90;
      this.frameCount = 7;
    } else if (turtleName === 'don') {
      this.width = 128;
      this.height = 83;
      this.frameCount = 7;
    } else if (turtleName === 'raph') {
      this.width = 120;
      this.height = 78;
      this.frameCount = 7;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}/${turtleName}-die.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={5}
        startFrame={0}
        stopLastFrame={true}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount}
         />
    );
  }
}

export default TurtleDie;
