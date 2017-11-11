import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Game from './game';
import Splash from './splash';
import Win from './win';
import Lose from './lose';

const App = ({store}) => (
  <Switch>
    <Route path="/win" component={Win} />
    <Route path="/lose" component={Lose} />
    <Route path="/game" component={Game} />
    <Route path="/" component={Splash} />
  </Switch>
);

export default App;
