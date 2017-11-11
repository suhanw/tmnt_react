import React from 'react';
import {connect} from 'react-redux';
import Turtle from './turtle';
import Foot from './foot';
import {resetFoots} from '../actions/foots_actions';
import {playSound} from '../util/soundPlayer';

// renders turtle
// renders foots at random pos (redux)

const mapStateToProps = ({foots, turtle}, ownProps) => {
  return {
    foots,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetFoots: () => dispatch(resetFoots()),
  };
};

class Stage extends React.Component {
  constructor(props) {
    super(props);

    this.renderFoots = this.renderFoots.bind(this);

  }

  render() {
    return (
      <div className="stage">
        <Turtle />
        {this.renderFoots()}
      </div>
    );
  }

  componentDidMount() {
    this.props.resetFoots();
    this.props.addSoundPlaying('stage1');
    // playSound('stage1');
  }

  renderFoots() {
    const {footsIdArr, footsById} = this.props.foots;
    if (!footsIdArr.length) { // render null before foots are received
      return null;
    }

    let foots = footsIdArr.map((id) => {
      return (
        <Foot key={id} id={id} />
      );
    });
    return foots;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
