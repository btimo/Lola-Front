import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Provider } from 'react-redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'sanitize.css';
import './index.css';

import reducer from './reducers';

import App from './containers/App';

import { CustomHistory } from './utils/router';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const firebaseConfig = {
  apiKey: "AIzaSyCS7QNsUqWY-VDxIFHVkgad_NrNx-I4lHc",
  authDomain: "lola-office.firebaseapp.com",
  databaseURL: "https://lola-office.firebaseio.com",
  projectId: "lola-office",
  storageBucket: "lola-office.appspot.com",
};

const middleware = [ thunk ];

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(...middleware),
    reactReduxFirebase(firebaseConfig, { userProfile: 'users' }),
  )
);

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={CustomHistory}>
        <Route component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);