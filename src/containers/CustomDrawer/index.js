import React from 'react';
import { connect } from 'react-redux';
import { pathToJS, firebaseConnect } from 'react-redux-firebase';
import withRouter from 'react-router-dom/withRouter';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import {
  HOME,
  MY_DATA,
  MY_PROFILE,
  ESTIMATOR,
  MY_PATIENTS,
  LOGIN,
} from '../../constants/paths';

const CustomDrawer = ({ auth, profile, history, firebase }) => (
  <Drawer
    containerStyle={{
      position: 'inherit',
      display: 'flex',
      flexDirection: 'column',
    }}
    style={{
      height: '100%',
    }}
    open
  >
    <MenuItem
      onTouchTap={() => history.push(HOME)}
    >
      Accueil
    </MenuItem>
    <Divider />
    { profile && profile.type === 'patient' && (
        <MenuItem
          onTouchTap={() => history.push(MY_DATA)}
        >
          Mes données
        </MenuItem>
    )}
    { profile && profile.type === 'doctor' && (
      <MenuItem
        onTouchTap={() => history.push(MY_PATIENTS)}
      >
        Mes patients
      </MenuItem>
    )}
    <Divider />
    <MenuItem
      onTouchTap={() => history.push(ESTIMATOR)}
    >
      Faire une estimation
    </MenuItem>
    <div style={{ flex: 1 }} />
    { !auth && (
        <div>
          <Divider />
          <MenuItem
            onTouchTap={() => history.push(LOGIN)}
          >Se connecter</MenuItem>
        </div>
    )}
    { auth && (
      <div>
        <Divider />
        <MenuItem
          onTouchTap={() => history.push(MY_PROFILE)}
        >Mon profil</MenuItem>
        <MenuItem
          onTouchTap={() => firebase.logout()}
        >Se déconnecter</MenuItem>
      </div>
    )}
  </Drawer>
);

const mapStateToProps = ({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  profile: pathToJS(firebase, 'profile'),
});

export default connect(mapStateToProps)(firebaseConnect()(withRouter(CustomDrawer)));