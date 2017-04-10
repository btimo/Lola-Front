import { UserAuthWrapper } from 'redux-auth-wrapper';
import { pathToJS } from 'react-redux-firebase';
import { replace } from 'react-router-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HOME,
} from '../constants/paths';


const AUTHED_REDIRECT = 'AUTHED_REDIRECT';
const UNAUTHED_REDIRECT = 'UNAUTHED_REDIRECT';

/**
 * @description Higher Order Component that redirects to `/login` instead
 * rendering if user is not authenticated (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsAuthenticated = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsAuthenticated',
  LoadingComponent: LoadingSpinner,
  authSelector: ({ firebase }) => pathToJS(firebase, 'auth'),
  authenticatingSelector: ({ firebase }) =>
  (pathToJS(firebase, 'auth') === undefined) ||
  (pathToJS(firebase, 'isInitializing') === true),
  predicate: auth => auth !== null,
  redirectAction: newLoc => (dispatch) => {
    dispatch(replace(newLoc));
    dispatch({
      type: UNAUTHED_REDIRECT,
      payload: { message: 'User is not authenticated.' }
    })
  }
});

/**
 * @description Higher Order Component that redirects to `/home` instead
 * rendering if user is not a doctor (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsDoctor = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsDoctor',
  LoadingComponent: LoadingSpinner,
  authSelector: ({ firebase }) => pathToJS(firebase, 'profile'),
  predicate: profile => profile !== null && profile.type === 'doctor',
  failureRedirectPath: HOME,
  redirectAction: newLoc => (dispatch) => {
    dispatch(replace(newLoc));
    dispatch({
      type: UNAUTHED_REDIRECT,
      payload: { message: 'User is not a doctor.' }
    })
  }
});

/**
 * @description Higher Order Component that redirects to `/home` instead
 * rendering if user is not a patient (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsPatient = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsPatient',
  LoadingComponent: LoadingSpinner,
  authSelector: ({ firebase }) => pathToJS(firebase, 'profile'),
  predicate: profile => profile !== null && profile.type === 'patient',
  failureRedirectPath: HOME,
  redirectAction: newLoc => (dispatch) => {
    dispatch(replace(newLoc));
    dispatch({
      type: UNAUTHED_REDIRECT,
      payload: { message: 'User is not a patient.' }
    })
  }
});


/**
 * @description Higher Order Component that redirects to listings page or most
 * recent route instead rendering if user is not authenticated. This is useful
 * routes that should not be displayed if a user is logged in, such as the
 * login route.
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsNotAuthenticated = UserAuthWrapper({ // eslint-disable-line new-cap
  wrapperDisplayName: 'UserIsNotAuthenticated',
  allowRedirectBack: false,
  LoadingComponent: LoadingSpinner,
  failureRedirectPath: (state, props) => HOME,
  authSelector: ({ firebase }) => pathToJS(firebase, 'auth'),
  authenticatingSelector: ({ firebase }) =>
  (pathToJS(firebase, 'auth') === undefined) ||
  (pathToJS(firebase, 'isInitializing') === true),
  predicate: auth => auth === null,
  redirectAction: newLoc => (dispatch) => {
    dispatch(replace(newLoc));
    dispatch({ type: AUTHED_REDIRECT })
  }
});

export default {
  UserIsAuthenticated,
  UserIsNotAuthenticated,
  UserIsDoctor,
  UserIsPatient,
}
