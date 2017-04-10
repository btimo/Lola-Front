import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {
  TextField,
  AutoComplete as RFAutoComplete,
} from 'redux-form-material-ui';
import createComponent from 'redux-form-material-ui/lib/createComponent';
import mapError from 'redux-form-material-ui/lib/mapError';

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

const fruit = [
  'Apple', 'Apricot', 'Avocado',
  'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
  'Boysenberry', 'Blood Orange',
  'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
  'Coconut', 'Cranberry', 'Clementine',
  'Damson', 'Date', 'Dragonfruit', 'Durian',
  'Elderberry',
  'Feijoa', 'Fig',
  'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
  'Honeydew', 'Huckleberry',
  'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
  'Kiwi fruit', 'Kumquat',
  'Lemon', 'Lime', 'Loquat', 'Lychee',
  'Nectarine',
  'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
  'Olive', 'Orange',
  'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
  'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
  'Quince',
  'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
  'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
  'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
  'Ugli fruit',
  'Watermelon',
];

const calculateGlucides = (form) => {
  console.log(form);

  return 100;
};

const Row = ({ id, index, deleteRowHandler }) => (
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
      filter={RFAutoComplete.fuzzyFilter}
      dataSource={fruit}
      maxSearchResults={5}
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
        </Toolbar>
      </div>
    );
  }
}

export default connect((state) => ({
  calc: calculateGlucides(state.form.estimator),
}))(reduxForm({
  form: 'estimator',
})(Estimator));
