import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import TurtleWalk from './sprites/turtle_walk';
import TurtleStand from './sprites/turtle_stand';
import TurtleAttack from './sprites/turtle_attack';
import {resetTurtle, updateTurtle} from '../actions/turtle_actions';

// tracks its own pos relative to stage (redux) - done
// tracks its half length (redux)
// tracks health (redux)
// keypress event handlers
// sprite state (redux)
// Walk
// Stand
// Attack
// Note: if turtle is attack and foot is stand, and dist betw centers <= half lengths, then foot loses health

const mapStateToProps = ({turtle}, ownProps) => {
  return {
    turtle,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetTurtle: () => dispatch(resetTurtle()),
    updateTurtle: (turtle) => dispatch(updateTurtle(turtle)),
  };
};

class Turtle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: null,
      size: null,
      health: null,
      doing: null,
    };

    this.renderStyles = this.renderStyles.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    return (
      <div className="turtle"
        style={this.renderStyles()}>
        <TurtleStand />
      </div>
    );
  }

  componentDidMount(){
    this.props.resetTurtle(); // resets turtle when game starts
    document.addEventListener("keydown", this.handleKeydown);
  }

  componentWillReceiveProps({turtle}){
    this.setState(turtle); // set React state whenever Redux state updated
  }

  renderStyles() {
    const {pos} = this.state;
    return pos;
  }

  handleKeydown(e) {
    const {pos} = this.state;
    let newPos;
    switch (e.key) {
      case "ArrowRight":
        newPos = merge({}, pos, {left: pos.left + 10});
        this.setState({ pos: newPos });
        this.props.updateTurtle(this.state);
        break;
      default:
        break;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Turtle);
