export interface IBoardState {
	boardCells: ICell[][];
	focusedCell: ICoords;
	isComplete: boolean;
}

export interface ICell {
	value: number;
	initialValue: number;
	isValid: boolean;
	coords: ICoords;
}

export interface ICoords {
	x: number;
	y: number;
}

const initialState: IBoardState = {
	boardCells: [[]],
	focusedCell: null,
	isComplete: false
};

export default (state = initialState, action: { type: string, payload: any }): IBoardState => {
	let boardCells: ICell[][];
	switch (action.type) {
		case 'GET_BOARD':
			// Do this to dereference from initial array
			// And to decouple initial and playable board
			const initialBoard: number[][] = [];
			const playableBoard: number[][] = [];
			availableBoards[action.payload].forEach((row, rowIdx) => {
				initialBoard.push([]);
				playableBoard.push([]);
				row.forEach((cell) => {
					initialBoard[rowIdx].push(cell);
					playableBoard[rowIdx].push(cell);
				});
			});
			boardCells = availableBoards[action.payload].map((row, yIdx) => {
				return row.map((value, xIdx) => {
					return {
						value: value,
						initialValue: value,
						isValid: true,
						isFocused: false,
						coords: { x: xIdx, y: yIdx }
					} as ICell;
				});
			});
			return {
				...state,
				focusedCell: { x: 0, y: 0 },
				boardCells: [...boardCells]
			}
		case 'UPDATE_CELL_VALUE':
			const { coords, newVal } = action.payload;
			boardCells = state.boardCells;
			boardCells[coords.y][coords.x].value = newVal;
			boardCells[coords.y][coords.x].isValid = checkValidInput(coords, newVal, boardCells);
			return {
				...state,
				boardCells: [...boardCells]
			}
		case 'UPDATE_CELL_FOCUS':
			const nextCoords = moveCell(state.boardCells,
				action.payload.eventKey, action.payload.currentCoords);
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
		default:
			return state;
	}
}

const moveCell = (boardCells: ICell[][],
	eventKey: string,
	currentCoords: { x: number, y: number }): ICoords => {
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
 * 
 * @param coords 
 * @param input 
 * @param boardToCheck 
 * @returns {[]ICoords} List of cells conflicting with current input (including current input)
 */
const checkValidInput = (coords: ICoords, input: number, boardToCheck: ICell[][]): boolean/*ICoords[]*/ => {
	// const invalidCoords: ICoords[] = [];
	// Check row
	for (var i = 0; i < boardToCheck[coords.x].length; i++) {
		if (boardToCheck[i][coords.x].value === input) {
			// Skip self
			if (i !== coords.y) {
				return false;
				// invalidCoords.push({ x: coords.x, y: i });
			}
		}
	}
	// Check coords.y
	for (var i = 0; i < boardToCheck[coords.y].length; i++) {
		if (boardToCheck[coords.y][i].value === input) {
			// Skip self
			if (i !== coords.x) {
				return false;
				// invalidCoords.push({ x: i, y: coords.y });
			}
		}
	}
	// Box offset used for checking
	var boxAcross = Math.floor(coords.x / 3) * 3;
	var boxDown = Math.floor(coords.y / 3) * 3;
	// Check box
	for (var i = 0 + boxAcross; i < 3 + boxAcross; i++) {
		for (var j = 0 + boxDown; j < 3 + boxDown; j++) {
			if (boardToCheck[j][i].value === input) {
				// Skip self
				if (i !== coords.x && j !== coords.y) {
					return false;
					// invalidCoords.push({ x: i, y: j });
				}
			}
		}
	}
	return true;
	// if (invalidCoords.length > 0) {
	// 	invalidCoords.push(coords);
	// }
	// return invalidCoords;
};

/**
 * Check that the puzzle is complete and valid
 * 
 * @param {ICell[][]} board board to check
 * @returns true if board is entriely filled out and valid
 */
const checkPuzzleComplete = (board: ICell[][]): boolean => {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j].value === 0 || board[i][j].isValid === false) {
				return false;
			}
		}
	}
	return true;
};

const availableBoards: { [n: number]: number[][] } = {
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