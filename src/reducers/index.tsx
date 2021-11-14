import { combineReducers } from 'redux';

import gameStateReducer from './gameStateReducer';
import boardReducer from './boardStateReducer';

const rootReducer = combineReducers({
	gameState: gameStateReducer,
	board: boardReducer
});

export default rootReducer;
