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

const CustomDrawer = ({ opened, auth, profile, history, firebase, toggleDrawer }) => {

  const goTo = (path) => {
    history.push(path);
    window.matchMedia('only screen and (max-width: 760px)').matches && toggleDrawer();
  };

  return (
    <Drawer
      containerStyle={{
        position: 'inherit',
        display: 'flex',
        flexDirection: 'column',
      }}
      style={{
        height: '100%',
        width: opened ? 256 : 0,
        transition: 'width 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      }}
      open={opened}
    >
      <MenuItem
        onTouchTap={() => goTo(HOME)}
      >
        Accueil
      </MenuItem>
      <Divider />
      { profile && profile.type === 'patient' && (
        <MenuItem
          onTouchTap={() => goTo(MY_DATA)}
        >
          Mes données
        </MenuItem>
      )}
      { profile && profile.type === 'doctor' && (
        <MenuItem
          onTouchTap={() => goTo(MY_PATIENTS)}
        >
          Mes patients
        </MenuItem>
      )}
      <Divider />
      <MenuItem
        onTouchTap={() => goTo(ESTIMATOR)}
      >
        Faire une estimation
      </MenuItem>
      <div style={{ flex: 1 }} />
      { !auth && (
        <div>
          <Divider />
          <MenuItem
            onTouchTap={() => goTo(LOGIN)}
          >Se connecter</MenuItem>
        </div>
      )}
      { auth && (
        <div>
          <Divider />
          <MenuItem
            onTouchTap={() => goTo(MY_PROFILE)}
          >Mon profil</MenuItem>
          <MenuItem
            onTouchTap={() => {
              firebase.logout();
              window.matchMedia('only screen and (max-width: 760px)').matches && toggleDrawer();
            }}
          >Se déconnecter</MenuItem>
        </div>
      )}
    </Drawer>
  );
};

const mapStateToProps = ({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  profile: pathToJS(firebase, 'profile'),
});

export default connect(mapStateToProps)(firebaseConnect()(withRouter(CustomDrawer)));