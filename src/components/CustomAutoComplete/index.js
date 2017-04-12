import AutoComplete from 'material-ui/AutoComplete';

import createComponent from 'redux-form-material-ui/lib/createComponent';
import mapError from 'redux-form-material-ui/lib/mapError';

export default createComponent(
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