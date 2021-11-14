interface stateTypes {
	board: number[][];
	initialBoard: number[][];
	// Coordinates of the focused cell
	// Null indicates no focus
	focusedCell: {x: number, y: number} | null;
}

const initialState: stateTypes = {
	board: [[]],
	initialBoard: [[]],
	focusedCell: null
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

export default (state = initialState, action: { type: string, payload: any }) => {
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
			return {
				...state,
				initialBoard: initialBoard,
				board: playableBoard
			}
		case 'UPDATE_CELL_VALUE':
			const board = state.board;
			const { coords, newVal } = action.payload;
			board[coords.y][coords.x] = newVal;
			return {
				...state,
				board: [...board]
			}
		case 'UPDATE_CELL_FOCUS':

			return {
				...state
			}
		default:
			return state;
	}
}
