import merge from 'lodash/merge';
import {RECEIVE_FOOT, RECEIVE_FOOTS, DELETE_FOOT, CLEAR_FOOTS} from '../actions/foots_actions';

const defaultState = {
  footsById: {},
  footsIdArr: [],
};

const FootsReducer = (state=defaultState, action) => {
  let newState;
  switch (action.type) {
    case RECEIVE_FOOTS: // this action shd only be dispatched at game start
      return action.payload;
    case RECEIVE_FOOT:
      newState = merge({}, state, {
        footsById: {
          [action.payload.id]: action.payload,
        }
      });
      return newState;
    case DELETE_FOOT:
      newState = merge({}, state);
      delete newState.footsById[action.footId];
      const i = newState.footsIdArr.indexOf(action.footId);
      if (i !== -1) {
        newState.footsIdArr.splice(i, 1);
      }
      return newState;
    case CLEAR_FOOTS:
      return defaultState;
    default:
      return state;
  }
};

export default FootsReducer;
