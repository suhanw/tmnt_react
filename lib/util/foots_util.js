import {FOOTS_COUNT, FRAME_WIDTH, GROUND_X, ENEMY_START} from '../constants.js';
import {randomizer} from './randomizer';

export const randomizeFoots = () => {
  // create a number of foots (based on difficulty levels?)
  let footsIdArr = [];
  let footsById = {};
  for (let i = 1; i <= FOOTS_COUNT; i++) {
    // randomize each foot's pos
    let randomPosLeft = randomizer(FRAME_WIDTH, ENEMY_START);
    footsIdArr.push(i);
    // init each foot's health, height and width
    footsById[i] = {
      id: i,
      pos: {
        left: randomPosLeft,
        bottom: GROUND_X,
      },
      health: 10,
      doing: 'stand',
      size: {
        height: 0,
        width: 0,
      },
    };
  }
  return {
    footsById,
    footsIdArr,
  };
};
