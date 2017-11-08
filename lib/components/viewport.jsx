import React from 'react';
import Stage from './stage';
import TurtleWalking from './sprites/turtle_walking';

class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      left: 0,
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  render() {
    return (
      <div style={this.renderStyles()}>
        {this.props.children}
      </div>
    );
  }

  componentDidMount(){
    document.addEventListener('keydown', this.handleKeyPress);
  }

  renderStyles() {
    const {top, left} = this.state;
    return {
      top,
      left,
      position: "absolute",
    };
  }

  handleKeyPress(e) {
    let left;
    if (e.key === 'ArrowRight') {
      left = this.state.left - 20;
    } else if (e.key === 'ArrowLeft') {
      left = this.state.left + 20;
    }
    this.setState({left: left});
  }
}

export default Viewport;
