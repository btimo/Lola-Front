import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  setPageTitle,
} from '../../actions/act_app';

export default (title) => (C) => (
  connect(
    null,
    {
      setPageTitleAct: setPageTitle,
    }
  )(class E extends Component {

    componentWillMount() {
      this.props.setPageTitleAct(title);
    }

    render() {
      return (
        <C
          {...this.props}
        />
      );
    }
  })
);
