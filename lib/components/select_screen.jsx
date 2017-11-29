import React from 'react';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

class SelectScreen extends React.Component {
  render() {
    return (
      <div className="select-screen"
        style={this.renderStyles()}>
        <figure className="leo"></figure>
        <figure className="mikey"></figure>
        <figure className="don"></figure>
        <figure className="raph"></figure>
      </div>
    );
  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }
}

export default SelectScreen;
