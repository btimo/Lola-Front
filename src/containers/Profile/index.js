import React from 'react';
import { UserIsAuthenticated } from '../../utils/router';

const Profile = () => (
  <div>Page Profile</div>
);

export default UserIsAuthenticated(Profile);
