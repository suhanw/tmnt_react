import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';
import {playSound} from '../util/soundPlayer';

class Splash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pressStart: false,
    };

    this.timer = null;

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    return (
      <div className="splash"
        style={this.renderStyles()}>
        <div className="splash-title">
          <div className="splash-subtitle"></div>
        </div>
        <span className={ this.state.pressStart ? "press-start fast" : "press-start slow" }>PUSH 'S' TO START</span>
      </div>
    );
  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(e) {
    if (e.code === 'KeyS') {
      playSound('start');
      this.setState({pressStart: true});
      this.timer = setTimeout(()=>{
        this.props.history.push("/select");
      }, 1200);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    clearTimeout(this.timer);
    this.timer = null;
  }
}

export default Splash;
