import React from 'react';
import { UserIsPatient, UserIsAuthenticated } from '../../utils/router';

const MyData = () => (
  <div>Page MyData</div>
);

export default UserIsAuthenticated(UserIsPatient(MyData));
