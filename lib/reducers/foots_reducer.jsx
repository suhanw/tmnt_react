import merge from 'lodash/merge';
import {RECEIVE_FOOT} from '../actions/foots_actions';

const defaultState = {
  footsById: {},
  footsIdArr: [],
};

const FootsReducer = (state=defaultState, action) => {
  let newState;
  switch (action.type) {
    case RECEIVE_FOOT:
      newState = merge({}, state, {
        footsById: {
          [action.payload.id]: action.payload,
        }
      });
      return newState;
    default:
      return state;
  }
};

export default FootsReducer;
