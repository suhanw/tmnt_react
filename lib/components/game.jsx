import React from 'react';
import Viewport from './viewport';
import Stage from './stage';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';
import {playSound, toggleMute} from '../util/soundPlayer';

// fix frame width and size
// contains nav links and instructions
// starts and ends the game loop
// check for turtle's health, if l.t.e zero, end game

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      soundPlaying: null,
      muted: false,
    };

    this.addSoundPlaying = this.addSoundPlaying.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.renderMuteButton = this.renderMuteButton.bind(this);
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
          healthbar
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

export default Game;
