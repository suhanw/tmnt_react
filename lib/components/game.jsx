import React from 'react';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import SelectScreen from './select_screen';
import Viewport from './viewport';
import Stage from './stage';
import TurtleIcon from './sprites/turtle_icon';
import {FRAME_WIDTH, FRAME_HEIGHT, GROUND_X, TURTLES} from '../constants';
import {playSound, toggleMute, stopAll} from '../util/soundPlayer';
import {updateTurtle} from '../actions/turtle_actions';

const mapStateToProps = ({turtle, foots: {footsIdArr}}, ownProps) => {
  return {
    health: turtle.health,
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
      pressStart: false,
      score: 0,
    };

    this.gameOver = false;
    this.timeout = null;

    this.renderSelectScreen = this.renderSelectScreen.bind(this);
    this.renderMuteBar = this.renderMuteBar.bind(this);
    this.renderHealthBar = this.renderHealthBar.bind(this);
    this.addSoundPlaying = this.addSoundPlaying.bind(this);
    this.renderMuteButton = this.renderMuteButton.bind(this);
    this.renderHealthMeter = this.renderHealthMeter.bind(this);
    this.checkGameOver = this.checkGameOver.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    const {path} = this.props.match;
    if (path === '/select') {
      return (
        <div className="game">
          {this.renderMuteBar()}
          {this.renderSelectScreen()}
        </div>
      );
    }

    const selectedTurtleName = this.props.history.location.pathname.split('/')[2];
    if (TURTLES.indexOf(selectedTurtleName) === -1) {
      this.props.history.replace('/select'); //redirect user to select screen if they manipulate the URL
    }

    return (
      <div className="game"
        style={this.renderGameStyles()}>

        {this.renderMuteBar()}
        {this.renderHealthBar(selectedTurtleName)}
        {this.renderStage(selectedTurtleName)}

      </div>
    );
  }

  renderSelectScreen() {
    return <SelectScreen
      history={this.props.history}
      addSoundPlaying={this.addSoundPlaying}
      muted={this.state.muted} />;
  }

  renderMuteBar() {
    return (
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
          <li><a href="https://stackoverflow.com/story/suhanw" target="_blank" className="angellist"><i className="fa fa-stack-overflow" aria-hidden="true"></i></a></li>
          <li><a href="mailto:suhanw@gmail.com" className="email"><i className="fa fa-envelope" aria-hidden="true"></i></a></li>
        </ul>
      </nav>
    );
  }

  renderMuteButton() {
    if (this.state.muted) {
      return <i className="fa fa-volume-off" aria-hidden="true"></i>;
    } else {
      return <i className="fa fa-volume-up" aria-hidden="true"></i>;
    }
  }

  renderHealthBar(selectedTurtleName) {
    return (
      <nav className="turtle-health-bar">
        <div className="turtle-health">
          <span className="turtle-name">
            <strong>{selectedTurtleName.toUpperCase()}</strong>
            <small>{this.state.score}</small>
          </span>
          <div className="turtle-health-meter">
            <strong>{this.renderHealthMeter()}</strong>
          </div>
          <div className={`player-icon ${selectedTurtleName}`}>
            <span>
              <strong>1</strong>
              <small>up</small>
            </span>
          </div>
          <div className="turtle-icon">
            <TurtleIcon selectedTurtleName={selectedTurtleName} />
          </div>
        </div>

        <div className="turtle-health">
          <span className="turtle-name suhan">
            <strong>SUHAN</strong>
            <small>9001!</small>
          </span>
          <div className="turtle-health-meter suhan">
            <small className={ this.state.pressStart ? "fast" : "slow" }>
              P2 COMING SOON
            </small>
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
    );
  }

  renderStage(selectedTurtleName) {
    return (
      <div
        className="gameframe"
        style={this.renderFrameStyles()}>
        <Viewport>
          <Stage
            addSoundPlaying={this.addSoundPlaying}
            muted={this.state.muted}
            gameOver={this.gameOver}
            muted={this.state.muted}
            turtleName={selectedTurtleName}/>
        </Viewport>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  componentWillReceiveProps(newProps) {
    const {footsIdArr, turtle} = newProps;
    let updatedTurtle = merge({}, turtle);
    if (!Object.keys(turtle).length) { // don't do any checks when first mounting Stage
      return;
    } else if (this.props.footsIdArr.length &&  footsIdArr.length !== this.props.footsIdArr.length) {
      let newScore = this.state.score + 100;
      this.setState({score: newScore});
    } else if (!this.gameOver) {
      this.gameOver = this.checkGameOver(newProps);
    }
  }

  checkGameOver(props) {
    if (props.health <= 0) { // when turtle dies
      stopAll();
      const dieSound = playSound('turtle-die', this.state.muted);
      dieSound.onended = () => {
        this.props.history.replace("/lose");
      };
      return true;
    }

    if (!props.footsIdArr.length) { // when turtle wins
      stopAll();
      playSound('stage-clear', this.state.muted);
      this.timeout = setTimeout(()=>{
        let newTurtle = merge({}, props.turtle);
        newTurtle.doing = 'cowabunga';
        this.props.updateTurtle(newTurtle);
        const cowabungaSound = playSound('cowabunga', this.state.muted);
        cowabungaSound.onended = () => {
          this.props.history.replace('/win');
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
    document.removeEventListener('keydown', this.handleKeydown);
    clearTimeout(this.timeout);
    this.timeout = null;
    stopAll();
    this.props.updateTurtle({});
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
