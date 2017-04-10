import React from 'react';
import { reduxForm, Field } from 'redux-form';
import {
  TextField,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

const Login = ({ handleSubmit, submitting }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Paper
      zDepth={1}
      style={{
        padding: '20px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
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
        <RaisedButton
          label="Se connecter"
          primary
          type="submit"
          disabled={submitting}
        />
      </form>
    </Paper>
  </div>
);

export default reduxForm({
  form: 'login',
})(Login);
