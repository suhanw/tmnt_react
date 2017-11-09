import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import {receiveFoot} from '../actions/turtle_actions';
import FootStand from './sprites/foot_stand';
import FootWalk from './sprites/foot_walk';
// import FootAttack from './sprites/foot_attack';

// tracks pos relative to stage (redux)
// tracks health (redux)
// sprite state (redux)
// - Stand
// - Attack

const mapStateToProps = (state, ownProps) => {
  const {foots: {footsById}} = state;
  return {
    foot: footsById[ownProps.id],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // placeholder
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
        {this.renderSprite()}
      </div>
    );
  }

  componentWillReceiveProps({foot}) {
    this.setState(foot);
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

export default connect(mapStateToProps, null)(Foot);
