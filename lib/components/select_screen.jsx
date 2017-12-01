import React from 'react';
import {FRAME_WIDTH, FRAME_HEIGHT, TURTLES} from '../constants';
import {playSound, stopAll} from '../util/soundPlayer';
import {preloadImage} from '../util/preload_image_util';

class SelectScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: 0,
      selected: null,
    };

    // preloadImage('assets/select_screen/don.png');
    // preloadImage('assets/select_screen/don-selected.png');
    // preloadImage('assets/select_screen/leo.png');
    // preloadImage('assets/select_screen/leo-selected.png');
    // preloadImage('assets/select_screen/mikey.png');
    // preloadImage('assets/select_screen/mikey-selected.png');
    // preloadImage('assets/select_screen/raph.png');
    // preloadImage('assets/select_screen/raph-selected.png');

    this.renderStyles = this.renderStyles.bind(this);
    this.renderTurtleStyles = this.renderTurtleStyles.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    return (
      <div className="select-screen"
        style={this.renderStyles()}>
        <figure className={this.renderTurtleStyles('leo', this.state.selected)}>Leonardo</figure>
        <figure className={this.renderTurtleStyles('mikey', this.state.selected)}>Michaelangelo</figure>
        <figure className={this.renderTurtleStyles('don', this.state.selected)}>Donatello</figure>
        <figure className={this.renderTurtleStyles('raph', this.state.selected)}>Raphael</figure>
        <span>SELECT YOUR TURTLE</span>
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

  renderTurtleStyles(turtleName, selected) {
    const {hovered} = this.state;
    const hoveredTurtle = TURTLES[hovered];
    const selectedTurtle = TURTLES[selected];
    if (turtleName === hoveredTurtle && turtleName === selectedTurtle) {
      return `${turtleName} hovered fast`;
    } else if (turtleName === hoveredTurtle) {
      return `${turtleName} hovered`;
    } else {
      return turtleName;
    }
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
    const currHovered = this.state.hovered;
    let newHovered;
    switch (e.code) {
      case "ArrowLeft":
        newHovered = currHovered - 1;
        if (newHovered < 0) newHovered = TURTLES.length - 1;
        // if (newHovered < 0) newHovered = 1;
        this.setState({hovered: newHovered});
        playSound('select-menu', this.props.muted);
        break;
      case "ArrowRight":
        newHovered = (currHovered + 1) % TURTLES.length;
        // newHovered = (currHovered + 1) % 2;
        this.setState({hovered: newHovered});
        playSound('select-menu', this.props.muted);
        break;
      case "Space":
        const selectedSound = playSound('selected-menu', this.props.muted);
        this.setState({selected: currHovered});
        document.removeEventListener('keydown', this.handleKeydown);
        selectedSound.onended = () => {
          this.props.history.replace(`/game/${TURTLES[currHovered]}`);
        };
      default:
        break;
    }
  }
}

export default SelectScreen;
