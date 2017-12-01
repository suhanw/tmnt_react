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
    this.attackTimer = 0;
    this.walkTimer = 0;
    this.jumpTimer = 0;
    this.hurtTimer = 0;
    this.combo = [];

    this.renderStyles = this.renderStyles.bind(this);
    this.renderSprite = this.renderSprite.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.enableControls = this.enableControls.bind(this);
    this.walk = this.walk.bind(this);
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
    this.enableControls(); // registers event handlers
  }

  componentWillReceiveProps({turtle}){
    if (JSON.stringify(turtle) !== JSON.stringify(this.state)) {
      const that = this;
      if (turtle.doing === 'hurt') {
        this.hurtTimer = setTimeout(()=>{
          clearTimeout(that.hurtTimer);
          that.hurtTimer = 0;
        }, 300);
        clearTimeout(this.walkTimer);
        this.walkTimer = 0;
        clearTimeout(this.jumpTimer);
        this.jumpTimer = 0;
      }
      this.setState(turtle); // set React state only when Redux state updated
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   // const {turtle} = nextProps;
  //   //only re-render if there is value change in React state
  //   if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
  //     return true;
  //   }
  //   return false;
  // }

  renderStyles() {
    const {pos, size} = this.state;
    let style = merge({}, pos, size);
    return style;
  }

  renderSprite() {
    const {turtleName} = this.props;
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
    return (<Sprite turtleName={turtleName}/>);
  }

  enableControls() {
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("keyup", this.handleKeyup);
  }

  disableControls() {
    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("keyup", this.handleKeyup);
  }


  handleKeydown(e) {
    if (this.props.gameOver) { //disable controls
      this.disableControls();
      return;
    }

    let newState;
    switch (e.code) {
      case "ArrowRight":
        if (this.hurtTimer) return;
        this.keyState[e.code] = true;
        if (this.walkTimer === 0) this.walk(); // start keydown loop only when it hasn't been started previously
        break;
      case "ArrowUp":
        if (this.isKeypressed(e)) return; // prevent multiple jumps when key is already pressed
        if (this.jumpTimer) return; // prevent double jumping if jumping is already in progress
        if (this.hurtTimer) return; // prevent jumping if turtle hurt
        playSound('jump', this.props.muted);
        this.jump(INIT_JUMP_VEL, true);
        break;
      case "Space":
        if (this.walkTimer) { // to stop walking if ArrowRight is pressed
          clearTimeout(this.walkTimer);
          this.walkTimer = 0;
        }
        if (!this.attackTimer) {
          const that = this;
          this.attackTimer = setTimeout(()=>{ // give time for attack sprite animation to complete
            newState = merge({}, that.state, {doing: 'stand'});
            that.props.updateTurtle(newState);
            clearTimeout(that.attackTimer);
            that.attackTimer = 0;
          }, 200);
        } else {
          return; // allow previous attack sprite animation to complete before new attack
        }
        if (this.isKeypressed(e)) return; // prevent multiple attacks when key is pressed
        if (this.state.doing === 'jump') return; // prevent turtle attack when jumping
        this.combo.push(e.timeStamp); // track combo attacks
        let comboLength = this.combo.length;
        const attack = this.setComboAttackSprite();
        if (!this.state.hasCollided) {
          playSound('swish', this.props.muted);
        } else {
          playSound('strike', this.props.muted);
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
    if (newTurtle.pos.bottom <= GROUND_X && !initJump) { // base case: end of jump
      clearTimeout(this.jumpTimer);
      this.jumpTimer = null;
      newTurtle.pos.bottom = GROUND_X;
      newTurtle.doing = 'stand';
      this.props.updateTurtle(newTurtle);
      return;
    }
    let currJumpVel = jumpVel;
    newTurtle.pos.bottom += jumpVel; // new_location = speed + old_location
    newTurtle.doing = 'jump';
    this.props.updateTurtle(newTurtle);
    jumpVel = GRAVITY + jumpVel; // new_speed = acceleration + old_speed
    this.jumpTimer = setTimeout(()=>{
      this.jump(jumpVel, false);
    }, 30);
  }

  walk() {
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
    this.walkTimer = setTimeout(this.walk, 20);
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
      // let newTurtle = merge({}, this.state);
      // newTurtle.doing = 'stand';
      // this.props.updateTurtle(newTurtle);
      this.disableControls();
      return;
    }

    if (this.hurtTimer) return; // prevent if turtle hurt
    if (this.state.doing === 'jump') return; // prevent when jumping

    let newDoing = 'stand';
    let newState = merge({}, this.state, {doing: newDoing});
    switch (e.code) {
      case "ArrowRight":
        this.keyState[e.code] = false;
        if (this.walkTimer) { // to break the walk loop when key is released
          clearTimeout(this.walkTimer);
          this.walkTimer = 0;
        }
        this.props.updateTurtle(newState);
        break;
      case "Space":
        break;
      default:
        break;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.walkTimer);
    clearTimeout(this.jumpTimer);
    this.walkTimer = 0;
    this.jumpTimer = 0;
    this.keyState = {};
    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("keyup", this.handleKeyup);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Turtle);
