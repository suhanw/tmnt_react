import React from 'react';
import {connect} from 'react-redux';
import Stage from './stage';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

// tracks and centers the view based on turtle pos

const mapStateToProps = ({turtle}, ownProps) => {
  return {
    turtle,
  };
};

class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      left: null,
    };
  }

  render() {
    return (
      <div className="viewport"
        style={this.renderStyles()}>
        {this.props.children}
      </div>
    );
  }

  componentWillReceiveProps(newProps) {
    const {turtle: {pos: {left}}} = newProps;
    let newLeft;
    // viewport only starts panning when turtle is 1/4 into the viewport
    if (left > (FRAME_WIDTH / 4)) {
      newLeft = left * (-1) + (FRAME_WIDTH / 4);
    }
    this.setState({left: newLeft});
  }

  renderStyles() {
    const {bottom, left} = this.state;
    return {
      left,
      bottom,
      position: "absolute",
    };
  }

}

export default connect(mapStateToProps, null)(Viewport);
