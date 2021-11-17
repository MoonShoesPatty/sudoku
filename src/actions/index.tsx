// Set difficulty
export const setDifficulty = (level: number) => {
	return {
		type: 'SET_DIFFICULTY',
		payload: level
	}
}

// Fetch a board of the appropriate level
export const getBoard = (difficulty: number) => {
	return {
		type: 'GET_BOARD',
		payload: difficulty
	}
}

// Update a cell value
export const updateCellValue = (newVal: number, coords: { x: number, y: number }) => {
	return {
		type: 'UPDATE_CELL_VALUE',
		payload: {
			newVal,
			coords
		}
	}
}

// Check whether the puzzle is complete and valid
export const checkPuzzleComplete = () => {
	return {
		type: 'CHECK_PUZZLE_COMPLETE',
		payload: {}
	}
}

// Update a cell value
export const updateCellFocus = (eventKey: string, currentCoords: { x: number, y: number }) => {
	return {
		type: 'UPDATE_CELL_FOCUS',
		payload: {
			eventKey,
			currentCoords
		}
	}
}
