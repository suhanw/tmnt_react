export const RESET_TURTLE = 'RECEIVE_TURTLE';

export const resetTurtle = () => {
  return {
    type: RESET_TURTLE,
    payload: {
      pos: {
        left: 0,
        bottom: 0,
      },
      size: {
        height: 0,
        width: 0,
      },
      health: 10,
      doing: 'stand',
    },
  };
};
