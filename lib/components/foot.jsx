import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import {receiveFoot, updateFoot} from '../actions/foots_actions';
import {updateTurtle} from '../actions/turtle_actions';
import {hasHorizontalCollision, inflictDamage} from '../util/collision_util';
import FootStand from './sprites/foot_stand';
import FootWalk from './sprites/foot_walk';
// import FootAttack from './sprites/foot_attack';

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

  componentWillReceiveProps({turtle, foot}) {
    // will run whenever turtle pos changes, or attacks
    // debugger
    const newTurtle = merge({}, turtle);
    const newFoot = merge({}, foot);
    if (hasHorizontalCollision(newTurtle, newFoot)) {
      // if (inflictDamage(newTurtle, newFoot)) { // if damage inflicted, will return true
      //   this.setState(newFoot);
      // }
      if (newTurtle.doing === 'attack') {
        let newHealth = foot.health - 2;
        this.setState({health: newHealth});
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //re-render only if own React or Redux state VALUES changed
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)
    || JSON.stringify(nextProps.foot) !== JSON.stringify(this.state)) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.foot) !== JSON.stringify(this.state)) {
      this.props.updateFoot(this.state);
      // debugger
    }
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
      // 'attack': FootAttack,
    };
    const Sprite = FootSprite[doing];
    return (<Sprite />);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Foot);
