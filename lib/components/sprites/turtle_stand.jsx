import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleStand extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 65;
      this.height = 65;
      this.frameCount = 11;
    } else if (turtleName === 'leo') {
      this.width = 85;
      this.height = 65;
      this.frameCount = 11;
    } else if (turtleName === 'don') {
      this.width = 75;
      this.height = 66;
      this.frameCount = 12;
    } else if (turtleName === 'raph') {
      this.width = 68;
      this.height = 61;
      this.frameCount = 11;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-standing.png`}
        direction="horizontal"
        shouldAnimate={true}
        fps={8}
        startFrame={0}
        stopLastFrame={false}
        frameCount={this.frameCount}
        wrapAfter={this.frameCount} />
    );
  }
}

export default TurtleStand;
