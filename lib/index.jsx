import ReactDOM from 'react-dom';
import React from 'react';
import Root from './root';

document.addEventListener('DOMContentLoaded', ()=>{
  const rootDom = document.getElementById('root');
  ReactDOM.render(
    <Root />,
    rootDom
  );
});
