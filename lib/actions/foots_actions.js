import {GROUND_X} from '../constants';
import * as FootsUtil from '../util/foots_util';

export const RECEIVE_FOOT = 'RECEIVE_FOOT';
export const RECEIVE_FOOTS = 'RECEIVE_FOOTS';
export const DELETE_FOOT = 'DELETE_FOOT';
export const CLEAR_FOOTS = 'CLEAR_FOOTS';

export const receiveFoot = (foot) => {
  return {
    type: RECEIVE_FOOT,
    payload: foot,
  };
};

export const deleteFoot = (footId) => {
  return {
    type: DELETE_FOOT,
    footId,
  };
};

export const receiveFoots = (foots) => {
  return {
    type: RECEIVE_FOOTS,
    payload: foots,
  };
};

export const clearFoots = () => {
  return {
    type: CLEAR_FOOTS,
  };
};

export const updateFoot = (foot) => {
  return (dispatch) => {
    return dispatch(receiveFoot(foot));
  };
};

export const resetFoots = () => {
  const foots = FootsUtil.randomizeFoots();
  return (dispatch) => {
    return dispatch(receiveFoots(foots));
  };
};
