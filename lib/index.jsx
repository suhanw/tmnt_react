import ReactDOM from 'react-dom';
import React from 'react';
import Root from './components/root';
import configureStore from './store/store';

// TESTING
import {randomizeFoots} from './util/foots_util';
import * as FootAction from './actions/foots_actions';
// TESTING

document.addEventListener('DOMContentLoaded', ()=>{
  const store = configureStore();

  // TESTING
  window.randomizeFoots = randomizeFoots;
  window.dispatch = store.dispatch;
  window.getState = store.getState;
  window.resetFoots = FootAction.resetFoots;
  // TESTING

  const rootDom = document.getElementById('root');
  ReactDOM.render(
    <Root store={store} />,
    rootDom
  );
});
