import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import Viewport from './viewport';
import Stage from './stage';
import TurtleIcon from './sprites/turtle_icon';
import {FRAME_WIDTH, FRAME_HEIGHT, GROUND_X} from '../constants';
import {playSound, toggleMute, stopAll} from '../util/soundPlayer';
import {updateTurtle} from '../actions/turtle_actions';

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
      muted: false,
    };

    this.gameOver = false;
    this.timeout = null;

    this.addSoundPlaying = this.addSoundPlaying.bind(this);
    this.renderMuteButton = this.renderMuteButton.bind(this);
    this.renderHealthMeter = this.renderHealthMeter.bind(this);
    this.checkGameOver = this.checkGameOver.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    console.log(this.state.muted);
    return (
      <div className="game"
        style={this.renderGameStyles()}>
        <nav className="toggle-mute-bar">
          <div className="toggle-mute">
            {this.renderMuteButton()}
            <span>
              Press 'M' to mute/unmute soundtrack.
            </span>
          </div>
          <ul className="icons">
            <li><a href="https://www.linkedin.com/in/suhanwijaya" target="_blank" className="linkedin"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
            <li><a href="https://www.github.com/suhanw" target="_blank" className="github"><i className="fa fa-github" aria-hidden="true"></i></a></li>
            <li><a href="https://angel.co/suhan-wijaya" target="_blank" className="angellist"><i className="fa fa-angellist" aria-hidden="true"></i></a></li>
            <li><a href="mailto:suhanw@gmail.com" className="email"><i className="fa fa-envelope" aria-hidden="true"></i></a></li>
          </ul>
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
          <div className="turtle-health">
            <span className="turtle-name suhan">
              <strong>SUHAN</strong>
              <small>9001!</small>
            </span>
            <div className="turtle-health-meter suhan">
              <small>PUSH 'S' TO START</small>
            </div>
            <div className="player-icon suhan">
              <span>
                <strong>2</strong>
                <small>up</small>
              </span>
            </div>
            <div className="suhan-icon">
            </div>
          </div>
        </nav>

        <div
          className="gameframe"
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
    document.addEventListener("keydown", this.handleKeydown);
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

  handleKeydown(e) {
    if (e.code === 'KeyM') {
      playSound('mute');
      const muted = toggleMute(this.state.soundPlaying);
      this.setState({muted});
    } else if (e.code === 'KeyS') {
      window.open('https://suhanw.github.io');
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
    document.removeEventListener('keydown', this.handleKeydown);
    clearTimeout(this.timeout);
    this.timeout = null;
    stopAll();
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
