import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import './App.css';

import CustomDrawer from '../CustomDrawer';
import Home from '../Home';
import Login from '../Login';
import Profile from '../Profile';
import Patients from '../Patients';
import MyData from '../MyData';
import Estimator from '../Estimator';
import ResetPassword from '../ResetPassword';
import Register from '../Register';

import {
  HOME,
  LOGIN,
  MY_PROFILE,
  MY_PATIENTS,
  MY_DATA,
  ESTIMATOR,
  RESET_PASSWORD,
  REGISTER,
} from '../../constants/paths';


class App extends Component {
  render() {
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}>
        <CustomDrawer />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <AppBar
            title="LoLa"
            showMenuIconButton={false}
          />
          <Switch>
            <Route exact path={HOME} component={Home} />
            <Route exact path={LOGIN} component={Login} />
            <Route exact path={MY_DATA} component={MyData} />
            <Route exact path={ESTIMATOR} component={Estimator} />
            <Route exact path={MY_PROFILE} component={Profile} />
            <Route exact path={MY_PATIENTS} component={Patients} />
            <Route exact path={REGISTER} component={Register} />
            <Route exact path={RESET_PASSWORD} component={ResetPassword} />
            <Redirect to="/home" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
