import {combineReducers} from 'redux';
import TurtleReducer from './turtle_reducer';

const RootReducer = combineReducers({
  turtle: TurtleReducer,
  // foots: {},
});

export default RootReducer;
