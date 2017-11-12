import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import Viewport from './viewport';
import Stage from './stage';
import TurtleIcon from './sprites/turtle_icon';
import {FRAME_WIDTH, FRAME_HEIGHT, GROUND_X} from '../constants';
import {playSound, toggleMute, stopAll} from '../util/soundPlayer';
import {updateTurtle} from '../actions/turtle_actions';

// fix frame width and size
// contains nav links and instructions
// starts and ends the game loop
// check for turtle's health, if l.t.e zero, end game

const mapStateToProps = ({turtle, foots: {footsIdArr}}, ownProps) => {
  return {
    health: turtle.health,
    score: turtle.score,
    doing: turtle.doing,
    turtle,
    footsIdArr,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateTurtle: (turtle)=>dispatch(updateTurtle(turtle)),
  };
};

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      soundPlaying: null,
      muted: true,
    };

    this.gameOver = false;
    this.timeout = null;

    this.addSoundPlaying = this.addSoundPlaying.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.renderMuteButton = this.renderMuteButton.bind(this);
    this.renderHealthMeter = this.renderHealthMeter.bind(this);
    this.checkGameOver = this.checkGameOver.bind(this);
  }

  render() {
    console.log(this.state.muted);
    return (
      <div className="game"
        style={this.renderGameStyles()}>
        <nav className="toggle-mute-bar">
          {this.renderMuteButton()}
          <span>
            Press 'm' to mute/unmute soundtrack.
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
    console.log('game mounted');
    const that = this;
    document.addEventListener("keydown", this.toggleMute);
  }

  componentWillReceiveProps(newProps) {
    if (!this.gameOver) {
      this.gameOver = this.checkGameOver(newProps);
    }
  }

  checkGameOver(props) {
    if (props.health <= 0) { // redirect to lose page
      stopAll();
      const dieSound = playSound('turtle-die');
      dieSound.onended = () => {
        this.props.history.push("/lose");
      };
      return true;
    }

    if (!props.footsIdArr.length) { // play soundtrack if won
      stopAll();
      playSound('stage-clear');
      this.timeout = setTimeout(()=>{
        let newTurtle = merge({}, props.turtle);
        newTurtle.doing = 'cowabunga';
        this.props.updateTurtle(newTurtle);
        const cowabungaSound = playSound('cowabunga');
        cowabungaSound.onended = () => {
          this.props.history.push('/win');
        };
      }, 2500);
      return true;
    }

    return false;
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

  toggleMute(e) {
    if (e.code === 'KeyM') {
      const muted = toggleMute(this.state.soundPlaying);
      this.setState({muted});
    }
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

  componentWillUnmount() {
    console.log('timeout cleared');
    console.log('event listeners cleared');
    document.removeEventListener('keydown', toggleMute);
    clearTimeout(this.timeout);
    this.timeout = null;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
