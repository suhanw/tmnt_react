import React from 'react';
import {Provider} from 'react-redux';
import Game from './game';

const Root = ({store}) => (
  <Provider store={store}>
    <Game />
  </Provider>
);

export default Root;
