import React from 'react';
import {connect} from 'react-redux';
import Viewport from './viewport';
import Stage from './stage';
import TurtleIcon from './sprites/turtle_icon';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';
import {playSound, toggleMute} from '../util/soundPlayer';

// fix frame width and size
// contains nav links and instructions
// starts and ends the game loop
// check for turtle's health, if l.t.e zero, end game

const mapStateToProps = ({turtle: {health, score}}, ownProps) => {
  return {
    health,
    score,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

};

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      soundPlaying: null,
      muted: true,
    };

    this.addSoundPlaying = this.addSoundPlaying.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.renderMuteButton = this.renderMuteButton.bind(this);
    this.renderHealthMeter = this.renderHealthMeter.bind(this);
  }

  render() {
    return (
      <div className="game"
        style={this.renderGameStyles()}>
        <nav className="toggle-mute-bar">
          {this.renderMuteButton()}
          <span>
            Press 'm' to mute/unmute.
          </span>
        </nav>
        <nav className="turtle-health-bar">
          <div className="turtle-health">
            <span className="turtle-name">
              <strong>MIKE</strong>
              <small>{this.props.score}</small>
            </span>
            <div className="turtle-health-meter">
              <strong>{this.renderHealthMeter()}</strong>
            </div>
            <div className="player-icon">
              <span>
                <strong>1</strong>
                <small>up</small>
              </span>
            </div>
            <div className="turtle-icon">
              <TurtleIcon />
            </div>
          </div>
        </nav>
        <div className="gameframe"
          style={this.renderFrameStyles()}>
          <Viewport>
            <Stage addSoundPlaying={this.addSoundPlaying} />
          </Viewport>
        </div>
      </div>
    );
  }


  componentDidMount() {
    document.addEventListener("keydown", (e)=>{
      if (e.code === 'KeyM') {
        this.toggleMute();
      }
    });
  }

  renderHealthMeter() {
    const {health} = this.props;
    let healthMeter = "";
    for (let i = 0; i < health; i++) {
      healthMeter += "|";
    }
    return healthMeter;
  }

  addSoundPlaying(sound) {
    this.setState({soundPlaying: sound});
  }

  toggleMute() {
    const muted = toggleMute(this.state.soundPlaying);
    this.setState({muted});
  }

  renderMuteButton() {
    if (this.state.muted) {
      return <i className="fa fa-volume-off" aria-hidden="true"></i>;
    } else {
      return <i className="fa fa-volume-up" aria-hidden="true"></i>;
    }
  }

  renderFrameStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

  renderGameStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT + 50,
    };
  }

}

export default connect(mapStateToProps, null)(Game);
