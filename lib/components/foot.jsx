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
    console.log('willReceiveProps');
    // if (JSON.stringify(foot) !== JSON.stringify(this.state)) {
    //   this.setState(foot);
    // }
    let newFoot;
    this.newTurtle = merge({}, turtle);

    if (turtle.doing.includes('attack') && foot.doing === 'attack') { // do nothing if both attack at the same time
      return;
    } else if (turtle.doing.includes('attack') && hasHorizontalCollision(turtle, foot)) {
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
    } else if (turtle.doing === 'stand' && foot.health !== this.state.health) { // true if turtle attack landed
      newFoot = merge({}, this.state);
      this.props.updateFoot(newFoot); //reduce foot's Redux health
      // this.setDamageSprite(newFoot); // render foot-hurt or foot-die sprite
      // this.setState(newFoot);
      // debugger
      // if (newFoot.health > 0) {
        // this.props.updateFoot(newFoot); //reduce foot's Redux health
      //   this.timeout = setTimeout(()=> { // render foot-stand when turtle doesn't keep attacking
      //     newFoot.doing = 'stand';
      //     this.props.updateFoot(newFoot);
      //     this.timeout = null;
      //   }, 500);
      // } else {
        // condition when foot is dead
        // console.log('no longer colliding');
        // this.newTurtle.hasCollided = false;
        // this.props.updateFoot(newFoot);
        // setTimeout(() => {
        //   this.props.deleteFoot(newFoot.id); // remove dead foot after short delay
        //   this.newTurtle.score += 100;
        //   this.props.updateTurtle(this.newTurtle); // to make sure turtle can move forward
        // }, 500);
      // }
    } else if (foot.doing === 'attack' && hasHorizontalCollision(turtle, foot)) {
      this.turtleDamage = true;
    } else if (hasHorizontalCollision(turtle, foot) && this.state.health > 0) { // prevent turtle from moving forward without killing foot
      this.newTurtle.hasCollided = true;
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

  componentDidUpdate(prevProps, prevState) {
    console.log('component did update');
    if (prevState.doing === 'attack' && this.turtleDamage) { // true if foot attack landed
      this.turtleDamage = false;
      this.newTurtle = merge({}, this.props.turtle);
      this.newTurtle.health -= FOOT_ATTACK_DAMAGE;
      if (this.newTurtle.health > 0) {
        this.newTurtle.doing = 'hurt';
      } else {
        this.newTurtle.doing = 'die';
      }
      this.props.updateTurtle(this.newTurtle); // reduce turtle's Redux health
    }


    if (this.state.health <= 0) {
      setTimeout(() => {
        console.log('remove dead foot');
        this.props.deleteFoot(this.state.id); // remove dead foot after short delay
      }, 500);
      // console.log('no longer colliding');
      this.newTurtle.hasCollided = false;
    } else if (this.state.health !== this.props.foot.health) {
      let newFoot = merge({}, this.state);
      this.timeout = setTimeout(()=> { // let foot recover when turtle doesn't keep attacking
        console.log('foot recovers');
        newFoot.doing = 'stand';
        this.setState(newFoot);
        this.timeout = null;
      }, 500);
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    //re-render only if foot React or Redux state VALUES changed (i.e., ignore turtle state changes)
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      console.log(`component updating from ${JSON.stringify(this.state)} to ${JSON.stringify(nextState)} `);
       return true;
    }
    if (JSON.stringify(nextProps.foot) !== JSON.stringify(this.props.foot)) {
      console.log(`component updating from ${JSON.stringify(this.props.foot)} to ${JSON.stringify(nextProps.foot)}`);
      return true;
    }
    console.log('component not updating');
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
