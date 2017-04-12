import React from 'react';
import { Field } from 'redux-form';

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

import {
  TextField,
} from 'redux-form-material-ui';
import CustomAutoComplete from '../../components/CustomAutoComplete';

import './styles.css';

const EstimatorRow = ({ id, index, deleteRowHandler, data }) => (
  <div
    className="estimator-row"
  >
    <div style={{
      flex: 1,
      textAlign: 'center',
      alignItems: 'center',
    }}>
      {`#${index + 1}`}
    </div>
    <div
      className="estimator-row-inputs"
    >
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
    </div>
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

const Estimator = ({ addRow, reset, rows, removeRow, alimentsDisplay, calc, dose }) => (
  <div
    id="estimator"
  >
    <Paper
      id="estimator-paper"
    >
      <div
        id="estimator-paper-actions"
      >
        <RaisedButton
          label="Ajouter un aliment"
          onTouchTap={addRow}
          primary
        />
        <FlatButton
          label="Réinitialiser la grille"
          onTouchTap={reset}
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
        {rows.map((r, index) => (
          <EstimatorRow
            key={`row${r}`}
            id={r}
            index={index}
            deleteRowHandler={() => removeRow(r)}
            data={alimentsDisplay}
          />
        ))}
      </div>
    </Paper>
    <Toolbar
      id="estimator-toolbar"
    >
      <div
        className="estimator-toolbar-part"
      >
        <ToolbarTitle text="Glucides"/>
        <div
          style={{
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {calc.toLocaleString('fr', { maximumFractionDigits: 1 })} g
        </div>
      </div>
      <div
        id="estimator-toolbar-arrow"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FontIcon
          className="mdi mdi-arrow-right"
        />
      </div>
      <div
        className="estimator-toolbar-part"
      >
        <ToolbarTitle text="Dose bolus conseillée"/>
        <div
          style={{
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {dose.toLocaleString('fr', { maximumFractionDigits: 1 })} U
        </div>
      </div>
    </Toolbar>
  </div>
);

export default Estimator;