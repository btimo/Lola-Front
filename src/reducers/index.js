import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { firebaseStateReducer } from 'react-redux-firebase';
import { routerReducer } from 'react-router-redux';
import app from './rdc_app';


const rootReducer = combineReducers({
  form: formReducer,
  firebase: firebaseStateReducer,
  app,
  router: routerReducer,
});

export default rootReducer;
