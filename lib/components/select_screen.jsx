import React from 'react';
import {FRAME_WIDTH, FRAME_HEIGHT, TURTLES} from '../constants';
import {playSound, stopAll} from '../util/soundPlayer';

class SelectScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
    };

    this.renderStyles = this.renderStyles.bind(this);
    this.renderTurtleStyles = this.renderTurtleStyles.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    const {selected} = this.state;
    const selectedTurtle = TURTLES[selected];
    return (
      <div className="select-screen"
        style={this.renderStyles()}>
        <span>SELECT YOUR TURTLE</span>
        <figure className={this.renderTurtleStyles('leo')}>Leonardo</figure>
        <figure className={this.renderTurtleStyles('mikey')}>Michaelangelo</figure>
        <figure className={this.renderTurtleStyles('don')}>Coming Soon</figure>
        <figure className={this.renderTurtleStyles('raph')}>Coming Soon</figure>
        <small>'LEFT' or 'RIGHT' to browse, 'SPACEBAR' to select</small>
      </div>
    );
  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

  renderTurtleStyles(turtleName) {
    const {selected} = this.state;
    const selectedTurtle = TURTLES[selected];
    return (turtleName === selectedTurtle) ? `${turtleName} selected` : turtleName;
  }

  componentDidMount(){
    document.addEventListener('keydown', this.handleKeydown);
    this.props.addSoundPlaying('select-screen');
    playSound('select-screen', this.props.muted);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    stopAll();
  }

  handleKeydown(e) {
    const currSelected = this.state.selected;
    let newSelected;
    switch (e.code) {
      case "ArrowLeft":
        newSelected = currSelected - 1;
        // if (newSelected < 0) newSelected = TURTLES.length - 1;
        if (newSelected < 0) newSelected = 1;
        this.setState({selected: newSelected});
        playSound('select-menu', this.props.muted);
        break;
      case "ArrowRight":
        // newSelected = (currSelected + 1) % TURTLES.length;
        newSelected = (currSelected + 1) % 2;
        this.setState({selected: newSelected});
        playSound('select-menu', this.props.muted);
        break;
      case "Space":
        this.props.history.push(`/game/${TURTLES[currSelected]}`);
      default:
        break;
    }
  }
}

export default SelectScreen;
