import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect, pathToJS, populatedDataToJS, dataToJS } from 'react-redux-firebase';
import { reduxForm, Field } from 'redux-form';
import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

// Material UI
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
// ----

import CustomAutoComplete from '../../components/CustomAutoComplete';

import { UserIsAuthenticated, UserIsDoctor } from '../../utils/router';

import {
  getAuthUID,
  getMyPatients,
  getNewPatients,
} from '../../selectors';

const patientDialogActions = (handleClose, handleSubmit) => ([
  <FlatButton
    label="Annuler"
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Ajouter"
    primary
    keyboardFocused
    onTouchTap={handleSubmit}
  />,
]);

const PatientDialogForm = ({ data, handleClose, handleSubmit }) => (
  <Dialog
    title="Dialog With Actions"
    actions={patientDialogActions(handleClose, handleSubmit)}
    modal={false}
    open
    onRequestClose={handleClose}
  >
    <div>
      <Field
        name="patient"
        component={CustomAutoComplete}
        floatingLabelText="Taper le nom de votre patient"
        filter={AutoComplete.fuzzyFilter}
        dataSource={data}
        maxSearchResults={5}
        fullWidth
      />
    </div>
  </Dialog>
);

const PatientDialogF = reduxForm({
  form: 'addPatient',
})(PatientDialogForm);

class PatientFormDialog extends Component {

  handleSubmit(values) {
    const newPArray = map(this.props.data, (p, k) => ({
      text: `${p.firstname} ${p.lastname}`,
      value: k,
    }));

    this.props.firebase.push('links', {
      doctor: this.props.authUID,
      patient: newPArray.find(p => p.text === values.patient).value,
      status: 'invit',
    });
    this.props.handleClose();
  }

  render() {
    return (
      <PatientDialogF
        onSubmit={(v) => this.handleSubmit(v)}
        handleClose={this.props.handleClose}
        data={map(this.props.data, p => `${p.firstname} ${p.lastname}`)}
      />
    );
  }
}

class Patients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpened: false,
    }
  }

  openDialog() {
    this.setState({ dialogOpened: true });
  }

  closeDialog() {
    this.setState({ dialogOpened: false });
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          flex: 1,
        }}
      >
        {this.state.dialogOpened && (
          <PatientFormDialog
            handleClose={() => this.closeDialog()}
            data={this.props.newPatients}
            firebase={this.props.firebase}
            authUID={this.props.authUID}
          />
        )}
        <FloatingActionButton
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}
          onTouchTap={() => this.openDialog()}
        >
          <FontIcon className="mdi mdi-plus" />
        </FloatingActionButton>
      </div>
    );
  }
}

const populates = [
  { child: 'patient', root: 'users' },
];

const mapStateToProps = (state) => {
  return {
    authUID: getAuthUID(state),
    newPatients: getNewPatients(state),
    myPatients: getMyPatients(state),
  }
};

export default connect(mapStateToProps)(firebaseConnect([
  'users',
  'links',
])(UserIsAuthenticated(UserIsDoctor(Patients))));
