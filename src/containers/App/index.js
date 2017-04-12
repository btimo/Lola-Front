import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import setPageTitleHoc from '../setPageTitleHoc';

import AppBar from 'material-ui/AppBar';
import './App.css';
import 'mdi/css/materialdesignicons.min.css';

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
  constructor(props) {
    super(props);

    this.state = {
      openedDrawer: window.innerWidth > 780,
    }
  }

  toggleDrawer() {
    this.setState({ openedDrawer: !this.state.openedDrawer });
  }

  render() {
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
      }}>
        <CustomDrawer
          opened={this.state.openedDrawer}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AppBar
            title={this.props.pageTitle}
            onLeftIconButtonTouchTap={() => this.toggleDrawer()}
          />
          <Switch>
            <Route exact path={HOME} component={setPageTitleHoc('LOLA - Accueil')(Home)} />
            <Route exact path={LOGIN} component={setPageTitleHoc('LOLA - Se connecter')(Login)} />
            <Route exact path={MY_DATA} component={setPageTitleHoc('LOLA - Mes données')(MyData)} />
            <Route exact path={ESTIMATOR} component={setPageTitleHoc('LOLA - Estimation glycémique')(Estimator)} />
            <Route exact path={MY_PROFILE} component={setPageTitleHoc('LOLA - Mon profil')(Profile)} />
            <Route exact path={MY_PATIENTS} component={setPageTitleHoc('LOLA - Mes patients')(Patients)} />
            <Route exact path={REGISTER} component={setPageTitleHoc('LOLA - S\'inscrire')(Register)} />
            <Route exact path={RESET_PASSWORD} component={setPageTitleHoc('LOLA - Réinitialiser mon mot de passe')(ResetPassword)} />
            <Redirect to="/home" />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pageTitle: state.app.title,
});

export default connect(mapStateToProps)(App);
