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
        <figure className={selectedTurtle === 'don' ? 'don selected' : 'don'}>Donnatello</figure>
        <figure className={selectedTurtle === 'raph' ? 'raph selected' : 'raph'}>Raphael</figure>
        <small>LEFT OR RIGHT ARROW TO SELECT</small>
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
    const oldSelected = this.state.selected;
    let newSelected;
    switch (e.code) {
      case "ArrowLeft":
        newSelected = oldSelected - 1;
        if (newSelected < 0) newSelected = TURTLES.length - 1;
        this.setState({selected: newSelected});
        break;
      case "ArrowRight":
        newSelected = (oldSelected + 1) % TURTLES.length;
        this.setState({selected: newSelected});
        break;
      default:
        break;
    }
  }
}

export default SelectScreen;
