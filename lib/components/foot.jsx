import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import {receiveFoot, updateFoot} from '../actions/foots_actions';
import {updateTurtle} from '../actions/turtle_actions';
import {hasHorizontalCollision, inflictDamage} from '../util/collision_util';
import FootStand from './sprites/foot_stand';
import FootWalk from './sprites/foot_walk';
import FootAttack from './sprites/foot_attack';

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

  componentDidMount(){
    const that = this;
    setTimeout(()=>{
      let newState = merge({}, that.state, {doing: "attack"});
      that.props.updateFoot(newState);
    }, 4000);

    setTimeout(()=>{
      let newState = merge({}, that.state, {doing: "stand"});
      that.props.updateFoot(newState);
    }, 4500);
  }

  componentWillReceiveProps({turtle, foot}) {
    if (JSON.stringify(foot) !== JSON.stringify(this.state)) {
      this.setState(foot);
      return;
    }

    let newTurtle = merge({}, turtle);
    let newFoot = merge({}, foot);
    if (hasHorizontalCollision(newTurtle, newFoot)) { // true if turtle and foot are close enough to attack each other
      console.log('collide');
      if (inflictDamage(newTurtle, newFoot)) { // if damage inflicted, will return true
        console.log('attack');
        this.props.updateFoot(newFoot);
        this.props.updateTurtle(newTurtle);
      }
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
    };
    const Sprite = FootSprite[doing];
    return (<Sprite />);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Foot);
