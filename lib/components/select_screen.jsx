import React from 'react';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

const TURTLES = ['leo', 'mikey', 'don', 'raph'];

class SelectScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
    };

    this.renderStyles = this.renderStyles.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  render() {
    const {selected} = this.state;
    const selectedTurtle = TURTLES[selected];
    return (
      <div className="select-screen"
        style={this.renderStyles()}>
        <span>SELECT YOUR TURTLE</span>
        <figure className={selectedTurtle === 'leo' ? 'leo selected' : 'leo'}>Leonardo</figure>
        <figure className={selectedTurtle === 'mikey' ? 'mikey selected' : 'mikey'}>Michaelangelo</figure>
        <figure className={selectedTurtle === 'don' ? 'don selected' : 'don'}>Coming Soon</figure>
        <figure className={selectedTurtle === 'raph' ? 'raph selected' : 'raph'}>Coming Soon</figure>
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

  componentDidMount(){
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
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
        break;
      case "ArrowRight":
        // newSelected = (currSelected + 1) % TURTLES.length;
        newSelected = (currSelected + 1) % 2;
        this.setState({selected: newSelected});
        break;
      case "Space":
        this.props.history.push(`/game/${TURTLES[currSelected]}`);
      default:
        break;
    }
  }
}

export default SelectScreen;
