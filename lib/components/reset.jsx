import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import {FRAME_WIDTH, FRAME_HEIGHT} from '../constants';

class Reset extends React.Component {
  constructor(props) {
    super(props);

    this.renderWin = this.renderWin.bind(this);
    this.renderLose = this.renderLose.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }
  render() {
    let message;
    if (this.props.match.path === '/win') {
      message = this.renderWin();
    } else if (this.props.match.path === '/lose') {
      message = this.renderLose();
    }

    return (
      <div className="reset"
        style={this.renderStyles()}>
        {message}
        <div>
          Press 'S' to play again.
        </div>
        <ul className="icons">
          <li><a href="https://www.linkedin.com/in/suhanwijaya" target="_blank" className="linkedin"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
          <li><a href="https://www.github.com/suhanw" target="_blank" className="github"><i className="fa fa-github" aria-hidden="true"></i></a></li>
          <li><a href="https://angel.co/suhan-wijaya" target="_blank" className="angellist"><i className="fa fa-angellist" aria-hidden="true"></i></a></li>
        </ul>
        <div>
          Reach me at <a className="email" href="mailto:suhanw@gmail.com">suhanw@gmail.com</a>
        </div>
        <div>
          <a className="resume" href="#" target="_blank">
            View my resume.
          </a>
        </div>
        <div>
          <a className="portfolio" href="https://suhanw.github.io/" target="_blank">
            Visit my portfolio.
          </a>
        </div>
        <small>
          Credit: sprite images from www.spriters-resource.com
        </small>
      </div>
    );
  }

  renderStyles() {
    return {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    };
  }

  renderWin() {
    return (
      <div>Cowabunga!</div>
    );
  }

  renderLose() {
    return(
      <div>No worries. Try harder!</div>
    );
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(e) {
    if (e.code === 'KeyS') {
      this.props.history.push('/game');
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  }
}

export default Reset;
