import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { reduxForm } from 'redux-form';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import filter from 'lodash/filter';
import keys from 'lodash/keys';
import get from 'lodash/get';
import compact from 'lodash/compact';

import EstimatorComponent from '../../components/Estimator';

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

    const dose = (this.props.calc * 1.5) / 10;

    return (
      <EstimatorComponent
        addRow={this.addRow}
        reset={this.reset}
        rows={this.state.rows}
        removeRow={(id) => this.removeRow(id)}
        alimentsDisplay={this.props.alimentsDisplay}
        calc={this.props.calc}
        dose={dose}
      />
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

    return (cleanse && cleanse.reduce((acc, elem) => ((elem.aliment.glucides * elem.amount) / 100) + acc, 0)) || 0;
  }
);

Estimator.defaultProps = {
  calc: 0,
};

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
