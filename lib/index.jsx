import ReactDOM from 'react-dom';
import React from 'react';
import Gameframe from './components/gameframe';

document.addEventListener('DOMContentLoaded', ()=>{
  const rootDom = document.getElementById('root');
  ReactDOM.render(
    <Gameframe />,
    rootDom
  );
});
