import React from 'react';
import SpriteAnimator from 'react-sprite-animator';

class TurtleIcon extends React.Component {
  constructor(props) {
    super(props);

    const {turtleName} = this.props;
    if (turtleName === 'mikey') {
      this.width = 25;
      this.height = 19;
      this.frameCount = 7;
    } else if (turtleName === 'leo') {
      this.width = 23;
      this.height = 19;
      this.frameCount = 7;
    }
  }

  render() {
    const {turtleName} = this.props;
    return (
      <SpriteAnimator
        width={this.width}
        height={this.height}
        sprite={`./assets/spritesheets/${turtleName}-icon.png`}
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

export default TurtleIcon;
