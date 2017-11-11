import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import Splash from './splash';

const App = ({store}) => (
  <Switch>
    <Route path="/game" component={Game} />
    <Route path="/" component={Splash} />
  </Switch>
);

export default App;
