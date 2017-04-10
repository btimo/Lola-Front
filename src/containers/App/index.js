import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import './App.css';

import Home from '../Home';
import Login from '../Login';


class App extends Component {
  render() {
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}>
        <Drawer
          containerStyle={{
            position: 'inherit',
          }}
          style={{
            height: '100%',
          }}
          open
        >
          <MenuItem>Accueil</MenuItem>
          <MenuItem>Se connecter</MenuItem>
        </Drawer>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <AppBar
            title="LoLa"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
