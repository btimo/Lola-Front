import React, { Component } from 'react';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import { connect } from 'react-redux';

import LoginComponent from '../../components/Login';

class Login extends Component {
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.props.firebase.login(data);
  }

  render(){
    return (
      <LoginComponent
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export default connect(({ firebase }) => ({
  authError: dataToJS(firebase, 'authError'),
}))(firebaseConnect()(Login));
