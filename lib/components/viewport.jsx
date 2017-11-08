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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // placeholder
  };
};

class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      left: 0,
    };

    // this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  render() {
    return (
      <div style={this.renderStyles()}>
        {this.props.children}
      </div>
    );
  }

  componentWillReceiveProps(newProps) {
    const {turtle: {pos: {left}}} = newProps;
    const newLeft = left * (-1);
    this.setState({left: newLeft});
  }

  // componentDidMount(){
  //   document.addEventListener('keydown', this.handleKeyPress);
  // }

  renderStyles() {
    const {bottom, left} = this.state;
    return {
      left,
      bottom,
      position: "absolute",
    };
  }

  // handleKeyPress(e) {
  //   let left;
  //   if (e.key === 'ArrowRight') {
  //     left = this.state.left - 20;
  //   } else if (e.key === 'ArrowLeft') {
  //     left = this.state.left + 20;
  //   }
  //   this.setState({left: left});
  // }

}

export default connect(mapStateToProps, null)(Viewport);
