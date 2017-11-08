import {combineReducers} from 'redux';
import TurtleReducer from './turtle_reducer';
import FootsReducer from './foots_reducer';

const RootReducer = combineReducers({
  turtle: TurtleReducer,
  foots: FootsReducer,
});

export default RootReducer;
