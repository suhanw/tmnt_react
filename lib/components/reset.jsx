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
        <div>
          <a className="resume" href="https://suhanw.github.io/assets/suhan_wijaya_resume.pdf" target="_blank">
            View my resume.
          </a>
        </div>
        <div>
          Reach me at <a className="email" href="mailto:suhanw@gmail.com">suhanw@gmail.com</a>.
        </div>
        <ul className="icons">
          <li><a href="https://www.linkedin.com/in/suhanwijaya" target="_blank" className="linkedin"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
          <li><a href="https://www.github.com/suhanw" target="_blank" className="github"><i className="fa fa-github" aria-hidden="true"></i></a></li>
          <li><a href="https://stackoverflow.com/story/suhanw" target="_blank" className="angellist"><i className="fa fa-stack-overflow" aria-hidden="true"></i></a></li>
        </ul>
        <ul className="credits">
          <li>Credits</li>
          <li>Graphics from spriters-resource.com</li>
          <li>Title font from fontmeme.com</li>
          <li>Audio from odzfire@charter.net</li>
          <li>Favicon from FunkMessiah</li>
        </ul>
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
      <div>
        <img className="cowabunga" src="https://fontmeme.com/permalink/171114/8029266302d30f6e52bd4c7d0ebb09b2.png" />
      </div>
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
      this.props.history.push('/select');
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  }
}

export default Reset;
