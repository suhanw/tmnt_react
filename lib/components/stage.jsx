import React from 'react';
import {connect} from 'react-redux';
import Turtle from './turtle';
import Foot from './foot';
import {resetFoots, clearFoots} from '../actions/foots_actions';
import {playSound, stopAll} from '../util/soundPlayer';
import {preloadImage} from '../util/preload_image_util';

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
    clearFoots: () => dispatch(clearFoots()),
  };
};

class Stage extends React.Component {
  constructor(props) {
    super(props);

    this.renderFoots = this.renderFoots.bind(this);

    preloadImage('assets/stage/sewer.png');
  }

  render() {
    const {turtleName} = this.props;
    return (
      <div className="stage">
        <Turtle gameOver={this.props.gameOver}
          muted={this.props.muted}
          turtleName={turtleName} />
        {this.renderFoots()}
        <div className="instructions">
          'RIGHT' to move forward, 'UP' to jump and 'SPACEBAR' to attack.
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.resetFoots();
    this.props.addSoundPlaying('stage1');
    playSound('stage1', this.props.muted);
  }

  renderFoots() {
    const {footsIdArr, footsById} = this.props.foots;
    if (!footsIdArr.length) { // render null before foots are received
      return null;
    }

    let foots = footsIdArr.map((id) => {
      return (
        <Foot key={id} id={id} muted={this.props.muted} />
      );
    });
    return foots;
  }

  componentWillUnmount() {
    this.props.clearFoots();
    stopAll();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
