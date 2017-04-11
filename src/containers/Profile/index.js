import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { pathToJS, populatedDataToJS, dataToJS, firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import map from 'lodash/map';
import filter from 'lodash/filter';

import {
  TextField,
} from 'redux-form-material-ui';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { UserIsAuthenticated } from '../../utils/router';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'read',
    };

    this.setEditMode = this.setEditMode.bind(this);
    this.setReadMode = this.setReadMode.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  setEditMode() {
    this.setState({ mode: 'edit' });
  }

  setReadMode() {
    this.setState({ mode: 'read' });
  }

  saveProfile() {
    console.log('saving profile ...');
    this.setState({ mode: 'read' });
  }

  render() {
    return (
      <div
        style={{
          height: 'calc(100% - 64px)',
          padding: 20,
          display: 'flex',
          position: 'relative',
          flexDirection:'column',
        }}
      >
        <Paper
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: 20,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <IconButton
              onTouchTap={this.state.mode === 'read' ? this.setEditMode : this.setReadMode}
              iconClassName={this.state.mode === 'edit' ? 'mdi mdi-undo' : 'mdi mdi-account-edit'}
              tooltip={ this.state.mode === 'edit' ? 'Annuler les changements' : 'Editer votre profil'}
            />
            { this.state.mode === 'edit' && (
              <IconButton
                onTouchTap={this.saveProfile}
                iconClassName="mdi mdi-content-save"
                tooltip="Sauvegarder votre profil"
              />
            )}
          </div>
          <div
            style={{
              padding: 20,
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <Field
              name="lastname"
              component={TextField}
              floatingLabelText="Nom"
              disabled={this.state.mode === 'read'}
            />
            <Field
              name="firstname"
              component={TextField}
              floatingLabelText="Prénom"
              disabled={this.state.mode === 'read'}
            />
          </div>
          <Divider />
          { this.props.profile && this.props.profile.type === 'patient' && (
            <div
              style={{
                padding: 20,
              }}
            >
              <h2>Mes médecins</h2>
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
                    { isLoaded(this.props.doctors) && !isEmpty(this.props.doctors) && map(this.props.doctors, d => (
                      <TableRow>
                        <TableRowColumn>{d.doctor.lastname}</TableRowColumn>
                        <TableRowColumn>{d.doctor.firstname}</TableRowColumn>
                        <TableRowColumn>{d.status === 'invit' ? 'Invitation' : 'Actif'}</TableRowColumn>
                        <TableRowColumn>
                          { d.status === 'invit' && (
                            <IconButton
                              iconClassName="mdi mdi-account-plus"
                              tooltip="Accepter la liaison"
                            />
                          )}
                          <IconButton
                            iconClassName="mdi mdi-delete"
                            tooltip="Supprimer la liaison"
                          />
                        </TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

const populates = [
  { child: 'doctor', root: 'users' },
];

const mapStateToProps = ({ firebase }) => {

  const profile = pathToJS(firebase, 'profile');
  const auth = pathToJS(firebase, 'auth');
  const authUID = auth ? auth.uid : null;
  const doctors = populatedDataToJS(firebase, 'links', populates);

  return {
    doctors: doctors ? filter(doctors, l => l.patient === authUID ) : null,
    profile: profile,
    initialValues: {
      firstname: profile ? profile.firstname : null,
      lastname: profile ? profile.lastname: null,
    },
  }
};

export default connect(mapStateToProps)(firebaseConnect([
  { path: '/links', populates },
])(UserIsAuthenticated(reduxForm({
  form: 'profile',
  enableReinitialize: true,
})(Profile))));
