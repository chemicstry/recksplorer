import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { createStore } from 'redux';

// Import the reducer and create a store
import { reducer } from './AppRedux'
const store = createStore(reducer)

// Remove default css styles
import 'normalize.css';

ReactDOM.render(<App store={store} />, document.getElementById('root'));
