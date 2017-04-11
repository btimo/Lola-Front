import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Field, reduxForm } from 'redux-form';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import {
  TextField,
  AutoComplete as RFAutoComplete,
} from 'redux-form-material-ui';
import createComponent from 'redux-form-material-ui/lib/createComponent';
import mapError from 'redux-form-material-ui/lib/mapError';

import filter from 'lodash/filter';
import keys from 'lodash/keys';
import get from 'lodash/get';
import compact from 'lodash/compact';

// Material UI elements
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle'
//

const CustomAutoComplete = createComponent(
  AutoComplete,
  ({ input: { onChange, value, ...inputProps }, ...props }) => ({
    ...mapError(props),
    ...inputProps,
    searchText: value,
    onBlur: () => {},
    onUpdateInput: value => onChange(value),
    onNewRequest: value => onChange(value),
  }),
);

const Row = ({ id, index, deleteRowHandler, data }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'baseline',
      minHeight: 86,
      paddingLeft: 10,
      paddingRight: 10,
    }}
  >
    <div style={{
      flex: 1,
      textAlign: 'center',
    }}>
      {`#${index + 1}`}
    </div>
    <Field
      style={{ flex: 2 }}
      name={`aliments-${id}`}
      component={CustomAutoComplete}
      floatingLabelText="Taper le nom de votre aliments"
      filter={AutoComplete.fuzzyFilter}
      dataSource={data}
      maxSearchResults={5}
      fullWidth
    />
    <Field
      style={{ flex: 2 }}
      name={`amount-${id}`}
      component={TextField}
      floatingLabelText="Quantité de votre aliment (en g)"
      type="number"
    />
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconButton
        tooltip="supprimer"
        tooltipPosition="bottom-center"
        onTouchTap={() => deleteRowHandler()}
      >
        <FontIcon className="mdi mdi-delete" />
      </IconButton>
    </div>

  </div>
);

class Estimator extends Component {
  constructor(props){
    super(props);

    this.state = {
      counter : 1,
      rows: [0],
    };

    this.addRow = this.addRow.bind(this);
    this.reset = this.reset.bind(this);
  }

  addRow() {
    this.setState({
      rows: [...this.state.rows, this.state.counter++],
    });
  }

  removeRow(id) {
    this.setState({
      rows: this.state.rows.filter(r => r !== id),
    });
  }

  reset() {
    this.setState({
      rows: [this.state.counter++],
    });
    this.props.reset();
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
            marginBottom: 76,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '20px',
              backgroundColor: 'rgb(232, 232, 232)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <RaisedButton
              label="Ajouter un aliment"
              onTouchTap={this.addRow}
              primary
            />
            <FlatButton
              label="Réinitialiser la grille"
              onTouchTap={this.reset}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'scroll',
              paddingBottom: 10,
            }}
          >
            {this.state.rows.map((r, index) => (
              <Row
                key={`row${r}`}
                id={r}
                index={index}
                deleteRowHandler={() => this.removeRow(r)}
                data={this.props.alimentsDisplay}
              />
            ))}
          </div>
        </Paper>
        <Toolbar
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            zIndex: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <ToolbarTitle text="Quantité de glucides consommés"/>
            <div
              style={{
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {this.props.calc}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FontIcon
              className="mdi mdi-arrow-right"
            />
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            <ToolbarTitle text="Dose bolus conseillée"/>
            <div
              style={{
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {(this.props.calc * 1.5) / 100}
            </div>
          </div>
        </Toolbar>
      </div>
    );
  }
}

const getAliments = state => dataToJS(state.firebase, 'aliments') || [];

const getAlimentsDisplay  = createSelector(
  getAliments,
  aliments => aliments && aliments.map(a => `${a.name} - ${a.glucides} / 100g`),
);

const getFormValues = state => get(state, 'form.estimator.values', {});

const calculateGlucides = createSelector(
  [getFormValues, getAlimentsDisplay, getAliments],
  (values, display, data) => {
    // keys of the form 'aliments-X', x being a number
    const alimentValues = filter(keys(values), k => k.includes('aliments-'));

    const cleanedValues = alimentValues.map(a => {
      // finding X
      const r = a.replace('aliments-', '');
      // finding amount corresponding to X
      const amount = values[`amount-${r}`];

      if (amount) {
        return {
          'aliment': data[display.findIndex(d => d === values[a])],
          amount,
        }
      }
      return null;
    });

    const cleanse = compact(cleanedValues);

    return cleanse && cleanse.reduce((acc, elem) => ((elem.aliment.glucides * elem.amount) / 100) + acc, 0);
  }
);

export default connect((state) => {
  const aliments = getAliments(state);
  const alimentsDisplay = getAlimentsDisplay(state);

  return {
    calc: calculateGlucides(state),
    aliments,
    alimentsDisplay,
  }
})(firebaseConnect([
  '/aliments',
])(reduxForm({
  form: 'estimator',
})(Estimator)));
