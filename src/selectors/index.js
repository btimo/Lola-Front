import { createSelector } from 'reselect';
import { filterObject } from '../utils/utils';

import { dataToJS, pathToJS } from 'react-redux-firebase';

import get from 'lodash/get';
import find from 'lodash/find';
import reduce from 'lodash/reduce';


export const users = state => dataToJS(state.firebase, 'users');
export const auth = state => pathToJS(state.firebase, 'auth');

export const getAuthUID = createSelector(
  auth,
  auth => get(auth, 'uid', null),
);

export const getPatients = createSelector(
  users,
  users => {
    if (users) {
      return filterObject(users, u => u.type === 'patient')
    }
    return null;
  }
);

export const links = state => dataToJS(state.firebase, 'links');

export const getMyLinks = createSelector(
  [links, getAuthUID],
  (links, authUID) => {
    if (links) {
      return filterObject(links, l => l.doctor === authUID)
    }
    return null;
  }
);

export const getNewPatients = createSelector(
  [getMyLinks, getPatients],
  (myLinks, patients) => (myLinks ? reduce(patients, (acc, v, k) => {
    if (find(myLinks, l => l.patient === k)) {
      return acc;
    }
    return {
      ...acc,
      [k]: {
        ...v
      },
    }
  }, {}) : patients),
);

export const getMyPatients = createSelector(
  [getMyLinks, getPatients],
  (myLinks, patients) => (myLinks ? reduce(myLinks, (acc, l) => ({
    ...acc,
    [l.patient]: patients[l.patient],
  }), {}) : null)
);
