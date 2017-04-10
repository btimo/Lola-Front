import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { firebaseStateReducer } from 'react-redux-firebase';


const rootReducer = combineReducers({
  form: formReducer,
  firebase: firebaseStateReducer,
});

export default rootReducer;
