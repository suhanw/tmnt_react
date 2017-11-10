import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import TurtleWalk from './sprites/turtle_walk';
import TurtleStand from './sprites/turtle_stand';
import TurtleAttack from './sprites/turtle_attack';
import {resetTurtle, updateTurtle} from '../actions/turtle_actions';
import {WALKING_SPEED} from '../constants';

// tracks its own pos relative to stage (redux) - done
// tracks its half length (redux)
// tracks health (redux)
// keypress event handlers
// sprite state (redux)
// Walk
// Stand
// Attack
// Note: if turtle is attack and foot is stand, and
// dist betw centers <= half lengths, then foot loses health

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

    this.keyState = {};
    this.timer = 0;

    this.renderStyles = this.renderStyles.bind(this);
    this.renderSprite = this.renderSprite.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.continueKeydown = this.continueKeydown.bind(this);
  }

  render() {
    if (!this.state.pos) { //render nothing when Redux state not yet updated
      return null;
    }

    return (
      <div className="turtle"
        style={this.renderStyles()}>
        Health: {this.state.health} <br />
        {this.renderSprite()}
      </div>
    );
  }

  componentDidMount(){
    this.props.resetTurtle(); // resets turtle when game starts
    this.addListeners();
  }

  componentWillReceiveProps({turtle}){
    if (JSON.stringify(turtle) !== JSON.stringify(this.state)) {
      this.setState(turtle); // set React state only when Redux state updated
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {turtle} = nextProps;
    //only re-render if there is value change in React/Redux state
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)
    || JSON.stringify(turtle) !== JSON.stringify(this.state)) {
      return true;
    }
    return false;
  }

  renderStyles() {
    const {pos, size} = this.state;
    const style = merge({}, pos, size);
    return style;
  }

  renderSprite() {
    const {doing} = this.state;
    const TurtleSprite = {
      'stand': TurtleStand,
      'walk': TurtleWalk,
      'attack': TurtleAttack,
    };
    const Sprite = TurtleSprite[doing];
    return (<Sprite />);
  }

  addListeners() {
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("keyup", this.handleKeyup);
  }

  handleKeydown(e) {
    let newState;
    switch (e.code) {
      case "ArrowRight":
        this.keyState[e.code] = true;
        if (this.timer === 0) { // start loop only when it hasn't been started previously
          this.continueKeydown();
        }
        break;
      case "Space":
        // prevent multiple attacks when key is pressed
        let allowed;
        if (e.repeat != undefined) {
          // first keydown, e.repeat is 'false'
          // second keydown, e.repeat is 'true'
          allowed = !e.repeat;
        }
        if (!allowed) return; // on second keydown, turtle won't attack
        allowed = false;
        newState = merge({}, this.state, {doing: "attack"});
        this.props.updateTurtle(newState);
        break;
      default:
        break;
    }
  }

  handleKeyup(e) {
    let newDoing = 'stand';
    let newState = merge({}, this.state, {doing: newDoing});
    switch (e.code) {
      case "ArrowRight":
        this.keyState[e.code] = false;
        if (this.timer) { // to break the continueKeydown loop when key is released
          clearTimeout(this.timer);
          this.timer = 0;
        }
        this.props.updateTurtle(newState);
        break;
      default:
        this.props.updateTurtle(newState);
        break;
    }
  }

  continueKeydown() {
    // To fix delay in native 'keydown' event
    // Credit: https://stackoverflow.com/questions/12273451/how-to-fix-delay-in-javascript-keydown
    const {pos} = this.state;
    let newPos;
    let newDoing;
    if (this.keyState["ArrowRight"]) {
      newPos = merge({}, pos, {left: pos.left + WALKING_SPEED});
      newDoing = 'walk';
      this.setState({
        pos: newPos,
        doing: newDoing,
      });
      this.props.updateTurtle(this.state);
    }
    this.timer = setTimeout(this.continueKeydown, 10);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Turtle);
