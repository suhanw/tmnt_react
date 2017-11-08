import React from 'react';
import {connect} from 'react-redux';
import Turtle from './turtle';
import {resetTurtle} from '../actions/turtle_actions';

// renders turtle
// renders foots at random pos (redux)

const mapStateToProps = (state, ownProps) => {
  //placeholder
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetTurtle: () => dispatch(resetTurtle()),
  };
};

class Stage extends React.Component {
  render() {
    return (
      <div className="stage">
        <Turtle />
      </div>
    );
  }

  componentDidMount() {
    this.props.resetTurtle();
  }
}

export default connect(null, mapDispatchToProps)(Stage);
