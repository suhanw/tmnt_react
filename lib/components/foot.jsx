import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import {receiveFoot, updateFoot, deleteFoot} from '../actions/foots_actions';
import {updateTurtle} from '../actions/turtle_actions';
import {hasHorizontalCollision, inflictDamage} from '../util/collision_util';
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

    this.timeout = null;
    this.footWalkingInterval = null;
    this.footAttackInterval = null;
    this.newTurtle = null;

    this.renderStyles = this.renderStyles.bind(this);
    this.renderSprite = this.renderSprite.bind(this);
  }

  render(){
    console.log('rendering foot', this.state.id);
    return (
      <div className="foot"
        style={this.renderStyles()}>
        Health: {this.state.health} <br />
        {this.renderSprite()}
      </div>
    );
  }

  componentDidMount() {
    // // to test hurting/killing turtle
    // const that = this;
    // setInterval(()=>{
    //   let newFoot = merge({},that.state);
    //   newFoot.doing = 'attack';
    //   that.setState(newFoot);
    //   that.props.updateFoot(newFoot);
    //   console.log('newFoot.doing', newFoot.doing);
    //   console.log('that.props.foot', that.props.foot.doing);
    //
    //   setTimeout(()=>{
    //     newFoot.doing = 'stand';
    //     that.setState(newFoot);
    //     that.props.updateFoot(newFoot);
    //   }, 200);
    // }, 1500);
  }

  componentWillReceiveProps({turtle, foot}) {
    let newFoot;
    this.newTurtle = merge({}, turtle);

    if (hasHorizontalCollision(turtle, foot) && this.state.health > 0) { // turtle cannot move without killing enemy
      this.newTurtle.hasCollided = true;
      if (this.footWalkingInterval) {
        console.log('foot stop walking');
        clearInterval(this.footWalkingInterval);
        this.footWalkingInterval = null;
        newFoot = merge({}, this.state);
        newFoot.doing = 'stand';
        // this.footAttackInterval = newFoot.doing()
        this.setState(newFoot);
      }
    } else if ((foot.pos.left - (turtle.pos.left + 65) <= 100) && this.state.health > 0) { //detect turtle approaching
      console.log('turtle approaching');
      if (!this.footWalkingInterval) {
        const that = this;
        this.footWalkingInterval = setInterval(()=>{
          newFoot = merge({}, that.state);
          newFoot.pos.left -= WALKING_SPEED;
          newFoot.doing = 'walk';
          that.setState(newFoot);
          that.props.updateFoot(newFoot);
        }, 50);
      }
    }

    if (turtle.doing.includes('attack') && foot.doing === 'attack') { // do nothing if both attack at the same time
      return;
    }

    // CONDITION 1: when player hits spacebar
    else if (turtle.doing.includes('attack') && hasHorizontalCollision(turtle, foot)) {
      playSound("strike");
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      newFoot = merge({}, foot);
      if (newFoot.health > 0) { // to stop reducing health after foot's health is negative
        newFoot.health -= TURTLE_ATTACK_DAMAGE;
      }
      this.setDamageSprite(newFoot); // render foot-hurt or foot-die sprite
      this.setState(newFoot); //reduce foot's React health
    }
    // CONDTION 2: when player releases spacebar
    else if (turtle.doing === 'stand' && foot.health !== this.state.health) { // true if turtle attack landed
      newFoot = merge({}, this.state);
      this.props.updateFoot(newFoot); //reduce foot's Redux health
      if (newFoot.health <= 0) { // if foot is dead, remove dead foot after short delay
        this.newTurtle.hasCollided = false;
        this.newTurtle.score += 100;
        setTimeout(() => {
          this.props.deleteFoot(newFoot.id);
        }, 500);
      } else { // else, let foot recover when turtle doesn't keep attacking
        this.timeout = setTimeout(()=> {
          newFoot.doing = 'stand';
          this.setState(newFoot);
          this.timeout = null;
        }, 500);
      }
    }
    // CONDITION 3: when foot attacks in turtle hitbox
    else if (foot.doing === 'attack' && hasHorizontalCollision(turtle, foot)) {
      // this.turtleDamage = true;
      this.newTurtle = merge({}, this.props.turtle);
      if (this.newTurtle.health > 0) { // to stop reducing health after health is 0
        this.newTurtle.health -= FOOT_ATTACK_DAMAGE;
      }
      if (this.newTurtle.health > 0) {
        this.newTurtle.doing = 'hurt';
      } else {
        this.newTurtle.doing = 'die';
      }
    }

    if (JSON.stringify(turtle) !== JSON.stringify(this.newTurtle)) {
      this.props.updateTurtle(this.newTurtle);
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
      console.log(`component updating state from ${JSON.stringify(this.state)} to ${JSON.stringify(nextState)} `);
      return true;
    }
    // if (JSON.stringify(nextProps.foot) !== JSON.stringify(this.props.foot)) {
    //   console.log(`component updating redux from ${JSON.stringify(this.props.foot)} to ${JSON.stringify(nextProps.foot)}`);
    //   return true;
    // }
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Foot);
