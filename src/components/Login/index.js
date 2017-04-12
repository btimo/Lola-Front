import React from 'react';
import { reduxForm, Field } from 'redux-form';
import {
  TextField,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import './styles.css';

const Login = ({ handleSubmit, submitting }) => (
  <div
    id="login"
  >
    <Paper
      zDepth={1}
      style={{
        padding: '20px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          id="login-form"
        >
          <Field
            name="email"
            component={TextField}
            floatingLabelText="Email"
            floatingLabelFixed
            hintText="john@doe.xyz"
          />
          <Field
            name="password"
            component={TextField}
            type="password"
            floatingLabelText="Password"
            floatingLabelFixed
            hintText="123password"
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RaisedButton
            label="Se connecter"
            primary
            type="submit"
            disabled={submitting}
          />
        </div>
      </form>
    </Paper>
  </div>
);

export default reduxForm({
  form: 'login',
})(Login);
