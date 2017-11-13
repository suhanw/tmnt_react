import {GROUND_X} from '../constants';

export const RESET_TURTLE = 'RESET_TURTLE';
export const RECEIVE_TURTLE = 'RECEIVE_TURTLE';

export const receiveTurtle = (turtle) => {
  return {
    type: RECEIVE_TURTLE,
    payload: turtle,
  };
};

export const resetTurtle = () => {
  return (dispatch) => {
    const turtle = {
      pos: {
        left: 0,
        bottom: GROUND_X,
      },
      size: {
        height: 65,
        width: 55,
      },
      health: 12,
      // health: 4,
      doing: 'stand',
      hasCollided: false,
      score: 0,
    };
    return dispatch(receiveTurtle(turtle));
  };
};

export const updateTurtle = (turtle) => {
  return (dispatch) => {
    return dispatch(receiveTurtle(turtle));
  };
};
