import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Provider } from 'react-redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import {
  Route,
} from 'react-router-dom';
import { ConnectedRouter, routerMiddleware} from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'sanitize.css';
import './index.css';

import reducer from './reducers';

import App from './containers/App';

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

const history = createBrowserHistory();

const middleware = [ thunk, routerMiddleware(history) ];

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(...middleware),
    reactReduxFirebase(firebaseConfig, { userProfile: 'users' }),
  )
);

render(
  <MuiThemeProvider
    muiTheme={getMuiTheme({
      palette: {
        primary1Color: '#3598db',
      },
      timePicker: {
        headerColor: '#3598db',
      },
      datePicker: {
        selectColor: '#3598db',
      }
    })}
  >
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route component={App} />
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);