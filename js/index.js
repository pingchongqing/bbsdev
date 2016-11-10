import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import route from './routes/Route';
import { createStore } from 'redux';


import configureStore from './store/configureStore';



import './My.less';


const preloadedState = window.__PRELOADED_STATE__
const store = configureStore(preloadedState)

render(
  <Provider store = {store} >
  	{route}
  </Provider>,
  document.getElementById('supconapp')
);
