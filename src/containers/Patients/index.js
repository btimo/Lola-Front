import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { reduxForm, Field } from 'redux-form';
import map from 'lodash/map';

// Material UI
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
// ----

import CustomAutoComplete from '../../components/CustomAutoComplete';

import { UserIsAuthenticated, UserIsDoctor } from '../../utils/router';

import {
  getAuthUID,
  getMyPatients,
  getNewPatients,
  getMyLinks,
  getMyPopulatedLinks,
  getPatientData,
  getOnePatient,
} from '../../selectors';

const patientDialogActions = (handleClose, handleSubmit) => ([
  <FlatButton
    label="Annuler"
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Ajouter"
    primary
    onTouchTap={handleSubmit}
  />,
]);

const PatientDialogForm = ({ data, handleClose, handleSubmit }) => (
  <Dialog
    title="Ajouter un patient"
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

const PatientTable = ({ links, showPatient, removePatient }) => (
  <div
    style={{
      padding: 20,
    }}
  >
    <h2>Mes patients</h2>
    <div>
      <Table
        selectable={false}
      >
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableHeaderColumn>Nom</TableHeaderColumn>
          <TableHeaderColumn>Prénom</TableHeaderColumn>
          <TableHeaderColumn>Statut</TableHeaderColumn>
          <TableHeaderColumn>Actions</TableHeaderColumn>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          { links && map(links, (l, i) => (
            <TableRow key={`patient-row-${i}`}>
              <TableRowColumn>{l.patient.lastname}</TableRowColumn>
              <TableRowColumn>{l.patient.firstname}</TableRowColumn>
              <TableRowColumn>{l.status === 'invit' ? 'Invitation' : 'Actif'}</TableRowColumn>
              <TableRowColumn>
                { l.status === 'active' && (
                  <IconButton
                    iconClassName="mdi mdi-account-card-details"
                    tooltip="Voir les données"
                    onTouchTap={() => showPatient(i)}
                  />
                )}
                <IconButton
                  iconClassName="mdi mdi-delete"
                  tooltip="Supprimer la liaison"
                  onTouchTap={() => removePatient(i)}
                />
              </TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

class PatientDataTable extends Component {
  prettyType(t) {
    switch (t) {
      case 'measure':
        return 'Mesure glycémique';
      default:
        return t.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  render() {
    return (
      <Paper
        style={{
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            iconClassName="mdi mdi-arrow-left"
            tooltip="Revenir"
            onTouchTap={() => this.props.goBack()}
          />
          <h3>Patient: {this.props.patient.firstname} {this.props.patient.lastname}</h3>
        </div>
        <Table
          selectable={false}
        >
          <TableHeader
            displaySelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn>Type</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Valeur</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.props.data && map(this.props.data, (m, k) => (
              <TableRow key={k} selectable={false}>
                <TableRowColumn>{this.prettyType(m.type)}</TableRowColumn>
                <TableRowColumn>{new Date(m.timestamp).toLocaleString()}</TableRowColumn>
                <TableRowColumn>{m.value}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

const PatientData = connect((state, ownProps) => ({
  data: getPatientData(state, ownProps),
  patient: getOnePatient(state, ownProps),
}))(PatientDataTable);

class Patients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpened: false,
      patient: null,
    };

    this.showData = this.showData.bind(this);
    this.removePatient = this.removePatient.bind(this);
  }

  openDialog() {
    this.setState({ dialogOpened: true });
  }

  closeDialog() {
    this.setState({ dialogOpened: false });
  }

  showData(id) {
    this.setState({ patient: this.props.myLinks[id].patient });
  }

  goBack() {
    this.setState({ patient: null });
  }

  removePatient(id) {
    this.props.firebase.remove(`links/${id}`);
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          padding: 20,
          flex: 1,
        }}
      >
        <Paper>
          { this.state.patient === null ? (<PatientTable
            links={this.props.myPopulatedLinks}
            showPatient={this.showData}
            removePatient={this.removePatient}
          />) : (
            <PatientData
              goBack={() => this.goBack()}
              patientID={this.state.patient}
            />)
          }
        </Paper>
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
    myLinks: getMyLinks(state),
    myPopulatedLinks: getMyPopulatedLinks(state),
  }
};

export default connect(mapStateToProps)(firebaseConnect([
  'users',
  'links',
  'measures',
])(UserIsAuthenticated(UserIsDoctor(Patients))));
