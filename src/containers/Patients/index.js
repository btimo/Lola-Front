import React from 'react';
import { UserIsAuthenticated, UserIsDoctor } from '../../utils/router'

const Patients = () => (
  <div>Page Patients</div>
);

export default UserIsAuthenticated(UserIsDoctor(Patients));
