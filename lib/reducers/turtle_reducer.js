import {RECEIVE_TURTLE} from '../actions/turtle_actions';

const defaultState = {};

const TurtleReducer = (state=defaultState, action) => {
  switch (action.type) {
    case RECEIVE_TURTLE:
      return action.payload;
    default:
      return state;
  }
};

export default TurtleReducer;
