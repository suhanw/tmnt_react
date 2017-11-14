import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import TurtleWalk from './sprites/turtle_walk';
import TurtleStand from './sprites/turtle_stand';
import TurtleAttack1 from './sprites/turtle_attack_1';
import TurtleAttack2 from './sprites/turtle_attack_2';
import TurtleAttack3 from './sprites/turtle_attack_3';
import TurtleHurt from './sprites/turtle_hurt';
import TurtleDie from './sprites/turtle_die';
import TurtleJump from './sprites/turtle_jump';
import TurtleCowabunga from './sprites/turtle_cowabunga';
import {resetTurtle, updateTurtle} from '../actions/turtle_actions';
import {playSound} from '../util/soundPlayer';
import {WALKING_SPEED, INIT_JUMP_VEL, GRAVITY, GROUND_X} from '../constants';

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
    this.keypressTimer = 0;
    this.jumpTimer = 0;
    this.combo = [];

    this.renderStyles = this.renderStyles.bind(this);
    this.renderSprite = this.renderSprite.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.continueKeypress = this.continueKeypress.bind(this);
    this.setComboAttackSprite = this.setComboAttackSprite.bind(this);
    this.jump = this.jump.bind(this);
    this.disableControls = this.disableControls.bind(this);
  }

  render() {
    if (!this.state.pos) { //render nothing when Redux state not yet updated
      return null;
    }

    return (
      <div className="turtle"
        style={this.renderStyles()}>
        {this.renderSprite()}
      </div>
    );
  }

  componentDidMount(){
    this.props.resetTurtle(); // resets turtle when game starts
    this.addListeners(); // registers event handlers
  }

  componentWillReceiveProps({turtle}){
    if (JSON.stringify(turtle) !== JSON.stringify(this.state)) {
      this.setState(turtle); // set React state only when Redux state updated
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {turtle} = nextProps;
    //only re-render if there is value change in React/Redux state
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      return true;
    }
    return false;
  }

  renderStyles() {
    const {pos, size} = this.state;
    let style = merge({}, pos, size);
    return style;
  }

  renderSprite() {
    const {doing} = this.state;
    const TurtleSprite = {
      'stand': TurtleStand,
      'walk': TurtleWalk,
      'attack-1': TurtleAttack1,
      'attack-2': TurtleAttack2,
      'attack-3': TurtleAttack3,
      'hurt': TurtleHurt,
      'die': TurtleDie,
      'jump': TurtleJump,
      'cowabunga': TurtleCowabunga
    };
    const Sprite = TurtleSprite[doing];
    return (<Sprite />);
  }

  addListeners() {
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("keyup", this.handleKeyup);
  }

  disableControls() {
    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("keyup", this.handleKeyup);
    // setTimeout(this.keypressTimer);
    // setTimeout(this.jumpTimer);
    // this.keypressTimer = 0;
    // this.jumpTimer = 0;
    // let newTurtle = merge({}, this.state);
    // newTurtle.doing = 'stand';
    // this.props.updateTurtle(newTurtle);
  }


  handleKeydown(e) {
    if (this.props.gameOver) { //disable controls when game over
      let newTurtle = merge({}, this.state);
      newTurtle.doing = 'stand';
      this.props.updateTurtle(newTurtle);
      this.disableControls();
      return;
    }

    let newState;
    switch (e.code) {
      case "ArrowRight":
        this.keyState[e.code] = true;
        if (this.keypressTimer === 0) { // start keydown loop only when it hasn't been started previously
          this.continueKeypress();
        }
        break;
      case "ArrowUp":
        if (this.isKeypressed(e)) return; // prevent multiple jumps when key is pressed
        if (this.jumpTimer) return; // prevent double jumping if jumping is already in progress
        playSound('jump');
        this.jump(INIT_JUMP_VEL, true);
        break;
      case "Space":
        if (this.keypressTimer) { // to stop walking if ArrowRight is pressed
          clearTimeout(this.keypressTimer);
          this.keypressTimer = 0;
        }
        if (this.isKeypressed(e)) return; // prevent multiple attacks when key is pressed
        this.combo.push(e.timeStamp); // track combo attacks
        let comboLength = this.combo.length;
        const attack = this.setComboAttackSprite();
        if (!this.state.hasCollided) {
          playSound('swish');
        } else {
          playSound('strike');
        }
        newState = merge({}, this.state, {doing: attack});
        this.props.updateTurtle(newState);
        break;
      default:
        break;
    }
  }

  isKeypressed(e) {
    let keyPressed;
    if (e.repeat !== undefined) {
      // first keydown, e.repeat is 'false', second keydown, e.repeat is 'true'
      keyPressed = e.repeat;
    }
    return keyPressed;
  }

  jump(jumpVel, initJump) {
    let newTurtle = merge({}, this.state);
    let currJumpVel = jumpVel;
    newTurtle.pos.bottom += jumpVel; // new_location = speed + old_location
    newTurtle.doing = 'jump';
    if (newTurtle.pos.bottom <= GROUND_X && !initJump) {
      clearTimeout(this.jumpTimer);
      this.jumpTimer = null;
      newTurtle.pos.bottom = GROUND_X;
      newTurtle.doing = 'stand';
      this.setState(newTurtle);
      return;
    }
    this.setState(newTurtle);
    jumpVel = GRAVITY + jumpVel; // new_speed = acceleration + old_speed
    this.jumpTimer = setTimeout(()=>{
      this.jump(jumpVel, false);
    }, 30);
  }

  continueKeypress() {
    if (this.state.hasCollided || this.props.gameOver) {
      this.keyState["ArrowRight"] = false;
      let newTurtle = merge({}, this.state);
      newTurtle.doing = 'stand';
      this.props.updateTurtle(newTurtle);
      return;
    }
    // To fix delay in native 'keydown' event
    // Credit: https://stackoverflow.com/questions/12273451/how-to-fix-delay-in-javascript-keydown
    if (this.keyState["ArrowRight"]) {
      let newTurtle = merge({}, this.state);
      newTurtle.doing = (newTurtle.pos.bottom === GROUND_X) ? 'walk' : 'jump'; // to account for jumping forward
      newTurtle.pos.left += WALKING_SPEED;
      this.props.updateTurtle(newTurtle);
    }
    // invoke this func in a loop to detect 'ArrowRight' being pressed
    this.keypressTimer = setTimeout(this.continueKeypress, 20);
  }

  setComboAttackSprite() {
    let attackSprite;
    if (this.combo.length === 1) {
      attackSprite = 'attack-1';
    } else if (this.combo.length === 2 &&  this.combo[1] - this.combo[0] < 450) {
      attackSprite = 'attack-2';
    } else if (this.combo.length === 3 &&  this.combo[2] - this.combo[1] < 450) {
      attackSprite = 'attack-3';
      this.combo = [];
    } else {
      attackSprite = 'attack-1';
      this.combo = [];
    }
    return attackSprite;
  }


  handleKeyup(e) {
    if (this.props.gameOver) {  //disable controls when game over
      let newTurtle = merge({}, this.state);
      newTurtle.doing = 'stand';
      this.props.updateTurtle(newTurtle);
      this.disableControls();
      return;
    }

    let newDoing = 'stand';
    let newState = merge({}, this.state, {doing: newDoing});
    switch (e.code) {
      case "ArrowRight":
        this.keyState[e.code] = false;
        if (this.keypressTimer) { // to break the continueKeypress loop when key is released
          clearTimeout(this.keypressTimer);
          this.keypressTimer = 0;
        }
        this.props.updateTurtle(newState);
        break;
      case "Space":
        setTimeout(()=>{ // give time for attack sprite animation to complete
          this.props.updateTurtle(newState);
        }, 150);
        break;
      default:
        break;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.keypressTimer);
    clearTimeout(this.jumpTimer);
    this.keypressTimer = 0;
    this.jumpTimer = 0;
    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("keyup", this.handleKeyup);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Turtle);
