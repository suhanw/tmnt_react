import {RESET_TURTLE} from '../actions/turtle_actions';

const defaultState = {};

const TurtleReducer = (state=defaultState, action) => {
  switch (action.type) {
    case RESET_TURTLE:
      return action.payload;
    default:
      return state;
  }
};

export default TurtleReducer;
