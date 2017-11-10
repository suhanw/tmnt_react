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
import {TURTLE_ATTACK_DAMAGE, FOOT_ATTACK_DAMAGE} from '../constants';
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
    // setInterval(()=>{
    //   let newFoot = merge({},this.state);
    //   newFoot.doing = 'attack';
    //   this.props.updateFoot(newFoot);
    //
    //   setTimeout(()=>{
    //     newFoot.doing = 'stand';
    //     this.props.updateFoot(newFoot);
    //   }, 500);
    // }, 1000);
  }

  componentWillReceiveProps({turtle, foot}) {
    if (JSON.stringify(foot) !== JSON.stringify(this.state)) {
      this.setState(foot);
    }
    let newFoot;
    let newTurtle = merge({}, turtle);

    if (turtle.doing.includes('attack') && foot.doing === 'attack') { // do nothing if both attack at the same time
      return;
    } else if (turtle.doing.includes('attack') && hasHorizontalCollision(turtle, foot)) {
      console.log('play sound');
      playSound("strike");
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      newFoot = merge({}, foot);
      newFoot.health -= TURTLE_ATTACK_DAMAGE;
      this.setState(newFoot); //reduce foot's React health
    } else if (turtle.doing === 'stand' && foot.health !== this.state.health) { // true if turtle attack landed
      newFoot = merge({}, this.state);
      this.setDamageSprite(newFoot); // render foot-hurt or foot-die sprite
      this.setState(newFoot);
      if (newFoot.health > 0) {
        this.props.updateFoot(newFoot); //reduce foot's Redux health
        this.timeout = setTimeout(()=> { // render foot-stand when turtle doesn't keep attacking
          newFoot.doing = 'stand';
          this.props.updateFoot(newFoot);
          this.timeout = null;
        }, 500);
      } else {// condition when foot is dead
        console.log('no longer colliding');
        newTurtle.hasCollided = false;
        this.props.updateFoot(newFoot);
        setTimeout(() => {
          this.props.deleteFoot(newFoot.id); // remove dead foot after short delay
          this.props.updateTurtle(newTurtle); // to make sure turtle can move forward
        }, 500);
      }
    } else if (foot.doing === 'attack' && hasHorizontalCollision(turtle, foot)) {
      this.turtleDamage = true;
    } else if (hasHorizontalCollision(turtle, foot) && this.state.health > 0) { // prevent turtle from moving forward without killing foot
      console.log('collided, foot.health', this.state.health);
      newTurtle.hasCollided = true;
    }

    if (JSON.stringify(turtle) !== JSON.stringify(newTurtle)) {
      this.props.updateTurtle(newTurtle);
    }
  }

  setDamageSprite(foot) {
    if (foot.health <= 0) {
      foot.doing = 'die';
    } else {
      foot.doing = 'hurt';
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.doing === 'attack' && this.turtleDamage) { // true if foot attack landed
      this.turtleDamage = false;
      let newTurtle = merge({}, this.props.turtle);
      newTurtle.health -= FOOT_ATTACK_DAMAGE;
      if (newTurtle.health > 0) {
        newTurtle.doing = 'hurt';
      } else {
        newTurtle.doing = 'die';
      }
      this.props.updateTurtle(newTurtle); // reduce turtle's Redux health
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //re-render only if foot React or Redux state VALUES changed (i.e., ignore turtle state changes)
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
       return true;
    }
    if (JSON.stringify(nextProps.foot) !== JSON.stringify(this.props.foot)) {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Foot);
