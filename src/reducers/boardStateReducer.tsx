import { ContextExclusionPlugin } from 'webpack';
import { solveBoard } from './solveMethods';

export interface IBoardState {
	boardCells: ICell[][];
	focusedCell: ICoords;
	isComplete: boolean;
	difficulty: number;
	candidateMode: boolean;
}

export interface ICell {
	value: number;
	initialValue: number;
	isValid: boolean;
	coords: ICoords;
	possibilities: number[];
}

export interface ICoords {
	x: number;
	y: number;
}

const initialState: IBoardState = {
	candidateMode: false,
	boardCells: [[]],
	focusedCell: { x: 0, y: 0 },
	isComplete: false,
	difficulty: 0
};

export default (state = initialState, action: { type: string, payload: any }): IBoardState => {
	let boardCells: ICell[][];
	let coords: ICoords;
	let newVal: number;
	switch (action.type) {
		case 'SET_DIFFICULTY':
			let difficulty = action.payload as number;
			boardCells = availableBoards[action.payload].map((row, yIdx) => {
				return row.map((value, xIdx) => {
					return {
						value: value,
						initialValue: value,
						isValid: true,
						isFocused: false,
						coords: { x: xIdx, y: yIdx },
						possibilities: []
					} as ICell;
				});
			});
			return {
				...initialState,
				difficulty: difficulty,
				boardCells: [...boardCells]
			}
		case 'RESET_BOARD':
			boardCells = state.boardCells.map((row) => {
				return row.map((cell) => {
					return {
						...cell,
						value: cell.initialValue,
						isValid: true,
						possibilities: []
					};
				});
			});
			return {
				...initialState,
				difficulty: difficulty,
				boardCells: [...boardCells],
			}
		case 'SOLVE_BOARD':
			boardCells = solveBoard(state.boardCells);
			boardCells = validateBoard(state.boardCells);
			let isSolved = checkPuzzleComplete(boardCells);
			return {
				...state,
				boardCells: [...boardCells],
				isComplete: isSolved,
				focusedCell: null
			}
		case 'UPDATE_CELL_VALUE':
			boardCells = state.boardCells;
			coords = state.focusedCell;
			newVal = action.payload.newVal;

			if (state.isComplete ||
				state.difficulty === 0 ||
				state.boardCells[coords.y][coords.x].initialValue !== 0) {
				return state;
			}
			// Set candidates vs. actual value
			if (state.candidateMode) {
				// Save whether a value existed in the cell so we can 
				//  a. Set to 0 and validate
				//  b. Know whether to remove a number from the possibilities array, which,
				//     if the cell DID have a value, was hidden. So keep the input number
				//     in the possiblities regardless.
				let hadValue: boolean = (boardCells[coords.y][coords.x].value !== 0);
				let itemIdx: number = boardCells[coords.y][coords.x].possibilities.indexOf(newVal);
				if (itemIdx === -1) {
					boardCells[coords.y][coords.x].possibilities.push(newVal);
				} else if (!hadValue) {
					boardCells[coords.y][coords.x].possibilities.splice(itemIdx, 1);
				}
				// Set cell value to 0 so that setting a possibility on a filled cell
				// clears that cell and shows the possibilities
				if (hadValue) {
					boardCells[coords.y][coords.x].value = 0;
					boardCells = validateBoard(state.boardCells);
				}
			} else {
				boardCells[coords.y][coords.x].value = newVal;
				boardCells = validateBoard(state.boardCells);
			}
			return {
				...state,
				boardCells: [...boardCells]
			}
		case 'UPDATE_CELL_FOCUS':
			let nextCoords: ICoords;
			if (action.payload.coords != null) {
				nextCoords = action.payload.coords;
			} else {
				nextCoords = moveCell(
					state.boardCells,
					action.payload.eventKey,
					state.focusedCell
				);
			}
			return {
				...state,
				focusedCell: nextCoords
			}
		case 'CHECK_PUZZLE_COMPLETE':
			let isComplete = checkPuzzleComplete(state.boardCells);
			return {
				...state,
				isComplete
			}
		case 'TOGGLE_CANDIDATE_MODE':
			return {
				...state,
				candidateMode: !state.candidateMode
			}
		default:
			return state;
	}
}

/**
 * Calculate the next cell based on current position, boundaries, and input eventKey
 * @param boardCells 
 * @param eventKey 
 * @param currentCoords 
 * @returns 
 */
const moveCell = (boardCells: ICell[][],
	eventKey: string,
	currentCoords: { x: number, y: number }): ICoords => {
	if (currentCoords == null) {
		return initialState.focusedCell;
	}
	const nextCoords = { ...currentCoords };
	switch (eventKey) {
		// LEFT
		case 'ArrowLeft': {
			if (nextCoords.x > 0) {
				nextCoords.x -= 1;
			}
			break;
		}
		// UP
		case 'ArrowUp': {
			if (nextCoords.y > 0) {
				nextCoords.y -= 1;
			}
			break;
		}
		// RIGHT
		case 'ArrowRight': {
			if (nextCoords.x < boardCells.length) {
				nextCoords.x += 1;
			}
			break;
		}
		// DOWN
		case 'ArrowDown': {
			if (nextCoords.y < boardCells.length) {
				nextCoords.y += 1;
			}
			break;
		}
	}
	if (nextCoords.x < boardCells.length &&
		nextCoords.y < boardCells.length &&
		nextCoords.x >= 0 &&
		nextCoords.y >= 0) {
		return nextCoords;
	}
	return currentCoords;
};

/**
 * @deprecated Calculate the next cell based on current position, boundaries, and input eventKey
 * 			   ** Skipping disabled cells which contained an initial value
 * @param boardCells 
 * @param eventKey 
 * @param currentCoords 
 * @returns 
 */
const moveCellSkippingDisabled = (boardCells: ICell[][],
	eventKey: string,
	currentCoords: { x: number, y: number }): ICoords => {
	const nextCoords = { ...currentCoords };
	switch (eventKey) {
		// LEFT
		case 'ArrowLeft': {
			nextCoords.x -= 1;
			while (nextCoords.x > 0 &&
				boardCells[nextCoords.y][nextCoords.x].initialValue !== 0) {
				nextCoords.x -= 1;
			}
			break;
		}
		// UP
		case 'ArrowUp': {
			nextCoords.y -= 1;
			while (nextCoords.y > 0 &&
				boardCells[nextCoords.y][nextCoords.x].initialValue !== 0) {
				nextCoords.y -= 1;
			}
			break;
		}
		// RIGHT
		case 'ArrowRight': {
			nextCoords.x += 1;
			while (nextCoords.x < boardCells.length - 1 &&
				boardCells[nextCoords.y][nextCoords.x].initialValue !== 0) {
				nextCoords.x += 1;
			}
			break;
		}
		// DOWN
		case 'ArrowDown': {
			nextCoords.y += 1;
			while (nextCoords.y < boardCells.length - 1 &&
				boardCells[nextCoords.y][nextCoords.x].initialValue !== 0) {
				nextCoords.y += 1;
			}
			break;
		}
	}
	if (nextCoords.x < boardCells.length &&
		nextCoords.y < boardCells.length &&
		nextCoords.x >= 0 &&
		nextCoords.y >= 0 &&
		boardCells[nextCoords.y][nextCoords.x].initialValue === 0) {
		return nextCoords;
	}
	return currentCoords;
};

/**
 * Update the valid property on every cell
 * @param boardCells 
 * @returns boardCells back with isValid appropriately set on all cells
 */
const validateBoard = (boardCells: ICell[][]): ICell[][] => {
	for (let i = 0; i < boardCells.length; i++) {
		for (let j = 0; j < boardCells.length; j++) {
			if (boardCells[i][j].value !== 0) {
				boardCells[i][j].isValid = checkValidInput(
					boardCells[i][j].coords,
					boardCells[i][j].value,
					boardCells
				);
			} else {
				boardCells[i][j].isValid = true;
			}
		}
	}
	return boardCells;
}

/**
 * Check that a given input to a cell is valid
 * 
 * @param coords 
 * @param input 
 * @param boardToCheck 
 * @returns {boolean} is valid
 */
const checkValidInput = (coords: ICoords, input: number, boardToCheck: ICell[][]): boolean => {
	// Check row
	for (let i = 0; i < boardToCheck[coords.x].length; i++) {
		if (boardToCheck[i][coords.x].value === input) {
			// Skip self
			if (i !== coords.y) {
				return false;
			}
		}
	}
	// Check coords.y
	for (let i = 0; i < boardToCheck[coords.y].length; i++) {
		if (boardToCheck[coords.y][i].value === input) {
			// Skip self
			if (i !== coords.x) {
				return false;
			}
		}
	}
	// Box offset used for checking
	let boxAcross = Math.floor(coords.x / 3) * 3;
	let boxDown = Math.floor(coords.y / 3) * 3;
	// Check box
	for (let i = 0 + boxAcross; i < 3 + boxAcross; i++) {
		for (let j = 0 + boxDown; j < 3 + boxDown; j++) {
			if (boardToCheck[j][i].value === input) {
				// Skip self
				if (i !== coords.x && j !== coords.y) {
					return false;
				}
			}
		}
	}
	return true;
};

/**
 * Check that the puzzle is complete and valid
 * 
 * @param {ICell[][]} board board to check
 * @returns true if board is entriely filled out and valid
 */
const checkPuzzleComplete = (board: ICell[][]): boolean => {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j].value === 0 || board[i][j].isValid === false) {
				return false;
			}
		}
	}
	return true;
};

const availableBoards: { [n: number]: number[][] } = {
	0: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
	],
	1: [
		[5, 3, 0, 0, 7, 0, 0, 0, 0],
		[6, 0, 0, 1, 9, 5, 0, 0, 0],
		[0, 9, 8, 0, 0, 0, 0, 6, 0],
		[8, 0, 0, 0, 6, 0, 0, 0, 3],
		[4, 0, 0, 8, 0, 3, 0, 0, 1],
		[7, 0, 0, 0, 2, 0, 0, 0, 6],
		[0, 6, 0, 0, 0, 0, 2, 8, 0],
		[0, 0, 0, 4, 1, 9, 0, 0, 5],
		[0, 0, 0, 0, 8, 0, 0, 7, 9],
	],
	2: [
		[0, 0, 8, 0, 3, 0, 2, 6, 5],
		[0, 0, 0, 0, 0, 0, 0, 0, 3],
		[0, 0, 7, 9, 0, 0, 0, 0, 0],
		[0, 5, 0, 0, 8, 0, 0, 0, 0],
		[6, 8, 0, 3, 0, 5, 0, 1, 4],
		[0, 0, 0, 0, 4, 0, 0, 7, 0],
		[0, 0, 0, 0, 0, 7, 6, 0, 0],
		[8, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 3, 9, 0, 6, 0, 8, 0, 0],
	],
	3: [
		[0, 5, 8, 0, 0, 2, 0, 7, 9],
		[0, 7, 0, 9, 4, 0, 0, 3, 5],
		[0, 0, 0, 0, 8, 0, 6, 0, 2],
		[0, 0, 0, 2, 0, 0, 0, 5, 0],
		[9, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 6, 0, 0, 0, 0],
		[6, 0, 7, 5, 9, 0, 3, 0, 0],
		[0, 3, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 4, 0, 0, 7, 9, 0],
	]
}