import React, { PropTypes } from 'react'
import CircularProgress from 'material-ui/CircularProgress'

export const LoadingSpinner = ({ size }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '7rem',
      height: '100%',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%'
      }}
    >
      <CircularProgress mode='indeterminate' size={size || 80} />
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.number
};

export default LoadingSpinner