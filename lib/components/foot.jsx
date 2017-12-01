import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import {receiveFoot, updateFoot, deleteFoot} from '../actions/foots_actions';
import {updateTurtle} from '../actions/turtle_actions';
import {hasHorizontalCollision, hasVerticalCollision} from '../util/collision_util';
import FootStand from './sprites/foot_stand';
import FootWalk from './sprites/foot_walk';
import FootAttack from './sprites/foot_attack';
import FootHurt from './sprites/foot_hurt';
import FootDie from './sprites/foot_die';
import {TURTLE_ATTACK_DAMAGE, FOOT_ATTACK_DAMAGE, WALKING_SPEED} from '../constants';
import {playSound} from '../util/soundPlayer';

const mapStateToProps = (state, ownProps) => {
  const {turtle, foots: {footsById}} = state;
  return {
    foot: footsById[ownProps.id],
    turtle,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateFoot: (foot) => dispatch(updateFoot(foot)),
    deleteFoot: (footId) => dispatch(deleteFoot(footId)),
    updateTurtle: (turtle) => dispatch(updateTurtle(turtle)),
  };
};

class Foot extends React.Component {
  constructor(props) {
    super(props);

    const {foot} = this.props;
    this.state = foot;

    this.footRecoverTimer = null;
    this.footWalkingInterval = null;
    this.footAttackInterval = null;
    this.newTurtle = null;

    this.renderStyles = this.renderStyles.bind(this);
    this.renderSprite = this.renderSprite.bind(this);
    this.footWalk = this.footWalk.bind(this);
    this.footStand = this.footStand.bind(this);
    this.footAttack = this.footAttack.bind(this);
    this.footReceiveDamage = this.footReceiveDamage.bind(this);
    this.footReduceHealth = this.footReduceHealth.bind(this);
    this.turtleReceiveDamage = this.turtleReceiveDamage.bind(this);
  }

  render(){
    return (
      <div className="foot"
        style={this.renderStyles()}>
        {this.renderSprite()}
      </div>
    );
  }

  componentWillReceiveProps({turtle, foot}) {
    let oldFoot = this.props.foot;
    let newFoot;
    this.newTurtle = merge({}, turtle);

    if (hasHorizontalCollision(turtle, foot) && this.state.health > 0) { // stop turtle when collides with foot
      this.newTurtle.hasCollided = true;
      if (this.footWalkingInterval) { // if foot was walking,
        clearInterval(this.footWalkingInterval); //stop when it collides with turtle
        this.footWalkingInterval = null;
        this.footStand();
      }
      const that = this;
      if (!this.footAttackInterval) { // if foot was not already attacking
        this.footAttack(); //set foot to attack when it collides with turtle
      }
      if (turtle.health <= 0) {
        clearInterval(this.footAttackInterval);
        this.footAttackInterval = null;
      }
    } else if ((foot.pos.left - (turtle.pos.left + 65) <= 100) && this.state.health > 0) { // before collision but turtle is approaching
      if (!this.footWalkingInterval) { // if foot was not already walking
        this.footWalk(); // set foot to walk
      }
    }

    // CONDITION 0: do nothing when both attack at the same time
    if (turtle.doing.includes('attack') && foot.doing === 'attack') {
      return;
    }
    // CONDITION 1: when player hits spacebar
    else if (turtle.doing.includes('attack') && hasHorizontalCollision(turtle, foot)) {
      this.footReceiveDamage(foot);
    }
    // CONDTION 2: when player releases spacebar
    else if (turtle.doing === 'stand' && foot.health !== this.state.health) { // true if turtle attack landed
      this.footReduceHealth();
    }
    // CONDITION 3: when foot attacks in turtle hitbox
    else if (foot.doing === 'attack' && hasHorizontalCollision(turtle, foot) && hasVerticalCollision(turtle, foot)) {
      if (oldFoot.doing !== 'attack') { // to avoid turtle damage beyond the point of foot attack
        this.turtleReceiveDamage();
      }
    }

    if (JSON.stringify(turtle) !== JSON.stringify(this.newTurtle)) {
      this.props.updateTurtle(this.newTurtle); // only update tutle Redux when turtle received damage
    }
  }

  footStand() {
    let newFoot = merge({}, this.state);
    newFoot.doing = 'stand';
    this.setState(newFoot);
    this.props.updateFoot(newFoot);
  }

  footAttack() {
    let newFoot;
    const that = this;
    this.footAttackInterval = setInterval(()=>{
      newFoot = merge({},that.state);
      newFoot.doing = 'attack';
      that.setState(newFoot);
      that.props.updateFoot(newFoot);
      playSound("strike", this.props.muted);
      setTimeout(()=>{
        that.footStand();
      }, 400);
    }, 800);
  }

  footWalk() {
    let newFoot;
    const that = this;
    this.footWalkingInterval = setInterval(()=>{ // foot starts walking when turtle approaches
      newFoot = merge({}, that.state);
      newFoot.pos.left -= WALKING_SPEED;
      newFoot.doing = 'walk';
      that.setState(newFoot);
      that.props.updateFoot(newFoot);
    }, 50);
  }

  footReceiveDamage(foot) {
    let newFoot;
    if (this.footRecoverTimer) {
      clearTimeout(this.footRecoverTimer);
      this.footRecoverTimer = null;
    }
    if (this.footAttackInterval) {
      clearTimeout(this.footAttackInterval);
      this.footAttackInterval = null;
    }
    if (this.footWalkingInterval) {
      clearTimeout(this.footWalkingInterval);
      this.footWalkingInterval = null;
    }
    newFoot = merge({}, foot);
    if (newFoot.health > 0) { // to stop reducing health after foot's health is negative
      newFoot.health -= TURTLE_ATTACK_DAMAGE;
    }
    this.setDamageSprite(newFoot); // render foot-hurt or foot-die sprite
    this.setState(newFoot); //reduce foot's React health
  }

  footReduceHealth() {
    let newFoot = merge({}, this.state);
    this.props.updateFoot(newFoot); //reduce foot's Redux health
    if (newFoot.health <= 0) { // if foot is dead,
      this.newTurtle.hasCollided = false;
      this.props.updateTurtle(this.newTurtle);
      let footDyingTimeout = setTimeout(() => { // remove dead foot after short delay
        this.newTurtle.hasCollided = false;
        this.props.updateTurtle(this.newTurtle);
        this.props.deleteFoot(newFoot.id);
        clearTimeout(footDyingTimeout);
        footDyingTimeout = null;
      }, 500);
    } else { // else, let foot recover when turtle doesn't keep attacking
      this.footRecoverTimer = setTimeout(()=> {
        this.footStand();
        clearTimeout(this.footRecoverTimer);
        this.footRecoverTimer = null;
      }, 500);
    }
  }

  turtleReceiveDamage() {
    this.newTurtle = merge({}, this.props.turtle);
    if (this.newTurtle.health > FOOT_ATTACK_DAMAGE) { // to stop reducing health after dying blow
      this.newTurtle.health -= FOOT_ATTACK_DAMAGE;
      this.newTurtle.doing = 'hurt';
    } else if (this.newTurtle.health > 0){
      this.newTurtle.health -= FOOT_ATTACK_DAMAGE; // dying blow
      this.newTurtle.doing = 'die';
      this.newTurtle.pos.bottom = 1;
    } else {
      return; // do nothing if turtle health already negative
    }
  }

  setDamageSprite(foot) {
    if (foot.health <= 0) {
      foot.doing = 'die';
    } else {
      foot.doing = 'hurt';
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //re-render only if foot React state VALUES changed (i.e., ignore turtle state changes)
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      return true;
    }
    return false;
  }

  renderStyles() {
    const {pos} = this.state;
    return pos;
  }

  renderSprite() {
    const {doing} = this.state;
    const FootSprite = {
      'stand': FootStand,
      'walk': FootWalk,
      'attack': FootAttack,
      'hurt': FootHurt,
      'die': FootDie,
    };
    const Sprite = FootSprite[doing];
    return (<Sprite />);
  }

  componentWillUnmount() {
    clearTimeout(this.footRecoverTimer);
    clearInterval(this.footWalkingInterval);
    clearInterval(this.footAttackInterval);
    this.footRecoverTimer = null;
    this.footWalkingInterval = null;
    this.footAttackInterval = null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Foot);
