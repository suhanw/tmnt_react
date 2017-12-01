import ReactDOM from 'react-dom';
import React from 'react';
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', ()=>{
  const store = configureStore();
  const rootDom = document.getElementById('root');
  ReactDOM.render(
    <Root store={store} />,
    rootDom
  );
});
