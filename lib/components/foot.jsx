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

// tracks pos relative to stage (redux)
// tracks health (redux)
// sprite state (redux)
// - Stand
// - Attack

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

    this.renderStyles = this.renderStyles.bind(this);
    this.renderSprite = this.renderSprite.bind(this);
  }

  render(){
    return (
      <div className="foot"
        style={this.renderStyles()}>
        Health: {this.state.health} <br />
        {this.renderSprite()}
      </div>
    );
  }

  componentWillReceiveProps({turtle, foot}) {
    if (turtle.doing === 'attack' && foot.doing === 'attack') { // do nothing if both attack at the same time
      return;
    } else if (turtle.doing === 'attack') {
      if (hasHorizontalCollision(turtle, foot)) { // true if turtle is close enough to attack foot
        let newFoot = merge({}, foot);
        newFoot.health -= 2;
        this.setState(newFoot); //reduce foot's React health
      }
    } else if (turtle.doing === 'stand' && foot.health !== this.state.health) { // true if turtle attack landed
      let newFoot = merge({}, this.state);
      this.setDamageSprite(newFoot); // render foot-hurt or foot-die sprite
      this.setState(newFoot);
      if (newFoot.health > 0) {
        this.props.updateFoot(newFoot); //reduce foot's Redux health
      } else {
        setTimeout(() => {
          this.props.deleteFoot(newFoot.id); // remove dead foot after short delay
        }, 800);
      }
    } else if (foot.doing === 'attack') {
      this.setState(foot);
      if (hasHorizontalCollision(turtle, foot)) { // true if foot is close enough to attack turtle
        this.turtleDamage = true;
      }
    } else if (JSON.stringify(foot) !== JSON.stringify(this.state)) {
      this.setState(foot);
    } else {
      return;
    }
  }

  setDamageSprite(foot) {
    if (foot.health === 0) {
      foot.doing = 'die';
    } else {
      foot.doing = 'hurt';
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.doing === 'attack' && this.turtleDamage) { // true if foot attack landed
      this.turtleDamage = false;
      let newTurtle = merge({}, this.props.turtle);
      newTurtle.health -= 2;
      this.props.updateTurtle(newTurtle); // reduce turtle's Redux health
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //re-render only if foot React or Redux state VALUES changed (i.e., ignore turtle state changes)
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      return true;
    }
    if (JSON.stringify(nextProps.foot) !== JSON.stringify(this.state)) {
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
