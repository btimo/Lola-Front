import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { pathToJS, populatedDataToJS, firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import map from 'lodash/map';

import { filterObject } from '../../utils/utils';

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

const ProfileForm = ({ mode, setEditMode, setReadMode, handleSubmit }) => (
  <div>
    <div
      style={{
        padding: 20,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <IconButton
        onTouchTap={mode === 'read' ? setEditMode : setReadMode}
        iconClassName={mode === 'edit' ? 'mdi mdi-undo' : 'mdi mdi-account-edit'}
        tooltip={ mode === 'edit' ? 'Annuler les changements' : 'Editer votre profil'}
      />
      { mode === 'edit' && (
        <IconButton
          onTouchTap={handleSubmit}
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
        disabled={mode === 'read'}
      />
      <Field
        name="firstname"
        component={TextField}
        floatingLabelText="Prénom"
        disabled={mode === 'read'}
      />
    </div>
  </div>
);

const ProfileF = reduxForm({
  form: 'profile',
  enableReinitialize: true,
})(ProfileForm);


const DoctorTable = ({ doctors, acceptInvit, removeDoctor }) => (
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
          { isLoaded(doctors) && !isEmpty(doctors) && map(doctors, (d, i) => (
            <TableRow key={`doctor-row-${i}`}>
              <TableRowColumn>{d.doctor.lastname}</TableRowColumn>
              <TableRowColumn>{d.doctor.firstname}</TableRowColumn>
              <TableRowColumn>{d.status === 'invit' ? 'Invitation' : 'Actif'}</TableRowColumn>
              <TableRowColumn>
                { d.status === 'invit' && (
                  <IconButton
                    iconClassName="mdi mdi-account-plus"
                    tooltip="Accepter la liaison"
                    onTouchTap={() => acceptInvit(i)}
                  />
                )}
                <IconButton
                  iconClassName="mdi mdi-delete"
                  tooltip="Supprimer la liaison"
                  onTouchTap={() => removeDoctor(i)}
                />
              </TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

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

  saveProfile(values) {
    this.props.firebase.update(
      `/users/${this.props.authUID}`,
      {
        firstname: values.firstname,
        lastname: values.lastname,
      },
    );

    this.setState({ mode: 'read' });
  }

  acceptInvit(linkId) {
    /*
    this.props.firebase.push('links', {
      doctor: "3X97xpOipUdf3JGtHeA5WNPwrzC2",
      patient: this.props.authUID,
      status: 'invit',
    });
    */

    this.props.firebase.update(`links/${linkId}`, {
      ...this.props.links.linkId,
      status: 'active',
    });
  }

  removeDoctor(linkId) {
    this.props.firebase.remove(`links/${linkId}`);
  }

  render() {
    return (
      <div
        style={{
          flex: 1,
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
          <ProfileF
            mode={this.state.mode}
            setEditMode={this.setEditMode}
            setReadMode={this.setReadMode}
            onSubmit={this.saveProfile}
            initialValues={{
              firstname: this.props.profile ? this.props.profile.firstname : null,
              lastname: this.props.profile ? this.props.profile.lastname: null,
            }}
          />
          <Divider />
          { this.props.profile && this.props.profile.type === 'patient' && (
            <DoctorTable
              doctors={this.props.doctors}
              acceptInvit={(t) => this.acceptInvit(t)}
              removeDoctor={(t) => this.removeDoctor(t)}
            />
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
  const links = populatedDataToJS(firebase, 'links', populates);

  return {
    authUID,
    links,
    doctors: links ? filterObject(links, link => link.patient === authUID ) : null,
    profile: profile,
  }
};

export default connect(mapStateToProps)(firebaseConnect([
  { path: '/links', populates },
])(UserIsAuthenticated(Profile)));
