import {GROUND_X} from '../constants';
import * as FootsUtil from '../util/foots_util';

export const RECEIVE_FOOT = 'RECEIVE_FOOT';
export const RECEIVE_FOOTS = 'RECEIVE_FOOTS';

export const receiveFoot = (foot) => {
  return {
    type: RECEIVE_FOOT,
    payload: foot,
  };
};

export const receiveFoots = (foots) => {
  return {
    type: RECEIVE_FOOTS,
    payload: foots,
  };
};

export const updateFoot = (foot) => {
  return (dispatch) => {
    return dispatch(receiveFoot(foot));
  };
};

export const resetFoots = () => {
  const foots = FootsUtil.randomizeFoots(); //NOTE: START HERE
  return (dispatch) => {
    return dispatch(receiveFoots(foots));
  };
};
