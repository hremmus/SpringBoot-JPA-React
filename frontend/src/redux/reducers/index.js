import { combineReducers } from 'redux';
import baseReducer from './baseReducer';

const reducers = combineReducers({
  base: baseReducer
});

export default reducers;