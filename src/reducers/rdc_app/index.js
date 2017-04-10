import {
  SET_PAGE_TITLE
} from '../../actions/act_app';

export default (state = { title: '' }, action = { type: null }) => {
  switch (action.type) {
    case SET_PAGE_TITLE:
      return {
        ...state,
        title: action.payload,
      };
    default:
      return state;
  }
};