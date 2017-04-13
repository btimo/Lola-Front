import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { firebaseConnect } from 'react-redux-firebase';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import IconButton from 'material-ui/IconButton';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderColumn,
  TableRowColumn,
} from 'material-ui/Table';

import {
  SelectField,
  DatePicker,
  TimePicker,
  TextField,
} from 'redux-form-material-ui';

import map from 'lodash/map';

import { UserIsPatient, UserIsAuthenticated } from '../../utils/router';

import {
  getAuthUID,
  getMyData,
} from '../../selectors';

import './styles.css';

const dialogActions = (handleClose, handleSubmit) => ([
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

const MyDataDialog = ({ handleSubmit, handleClose, opened }) => (
  <Dialog
    title="Entrer une donnée"
    actions={dialogActions(handleClose, handleSubmit)}
    modal={false}
    open={opened}
    onRequestClose={handleClose}
  >
    <div
      id="my-data-dialog-inputs"
    >
      <div>
        <Field
          name="type"
          component={SelectField}
          hintText="..."
          floatingLabelText="Choisir le type de donnée"
        >
          <MenuItem value="measure" primaryText="Mesure glycémique"/>
          <MenuItem value="basal" primaryText="Basal"/>
          <MenuItem value="bolus" primaryText="Bolus"/>
        </Field>
      </div>
      <div>
        <Field
          name="date"
          component={DatePicker}
          floatingLabelText="Date"
          DateTimeFormat={global.Intl.DateTimeFormat}
          locale="fr"
        />
        <Field
          name="time"
          component={TimePicker}
          floatingLabelText="Heure"
          props={{ format: "24hr" }}
          cancelLabel="Annuler"
        />
      </div>
      <div>
        <Field
          name="value"
          component={TextField}
          floatingLabelText="Valeur"
          hintText="10"
        />
      </div>
    </div>
  </Dialog>
);

const MyDataDialogForm = reduxForm({
  form: 'myData',
})(MyDataDialog);

class MyDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'a',
    };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(v) {
    this.setState({ tab: v });
  }

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
      <Paper>
        <Tabs
          value={this.state.tab}
          onChange={this.changeTab}
        >
          <Tab label="Données" value="a">
            <div
              id="paper-data"
            >
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
                    <TableHeaderColumn>Actions</TableHeaderColumn>
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
                      <TableRowColumn>
                        <IconButton
                          iconClassName="mdi mdi-pencil"
                          tooltip="Editer"
                          onTouchTap={() => this.props.editMeasure(k)}
                        />
                        <IconButton
                          iconClassName="mdi mdi-delete"
                          tooltip="Supprimer"
                          onTouchTap={() => this.props.removeMeasure(k)}
                        />
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tab>
          <Tab label="Graphe" value="b">
            <div
              id="paper-graph"
            >
              Work in progress
            </div>
          </Tab>
        </Tabs>

      </Paper>
    );
  }
}

class MyData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openedDialog: false,
    };

    this.removeMeasure = this.removeMeasure.bind(this);
  }

  openDialog() {
    this.setState({ openedDialog: true });
  }

  closeDialog() {
    this.setState({ openedDialog: false });
  }

  handleSubmit(v) {
    const d = new Date(v.date);
    const t = new Date(v.time);

    d.setHours(t.getHours());
    d.setMinutes(t.getMinutes());

    this.props.firebase.push(`measures`, {
      timestamp: d.getTime(),
      value: v.value,
      user: this.props.authUID,
      type: v.type,
    });

    this.closeDialog();
  }

  removeMeasure(m) {
    this.props.firebase.remove(`measures/${m}`);
  }

  render() {
    return (
      <div
        id="my-data"
      >
        <MyDataTable
          data={this.props.data}
          removeMeasure={this.removeMeasure}
        />
        <MyDataDialogForm
          opened={this.state.openedDialog}
          handleClose={() => this.closeDialog()}
          onSubmit={(v) => this.handleSubmit(v)}
        />
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

const mapStateToProps = (state) => ({
  authUID: getAuthUID(state),
  data: getMyData(state),
});

export default connect(mapStateToProps)(
  firebaseConnect([
    'measures',
  ])(UserIsAuthenticated(UserIsPatient(MyData))));
