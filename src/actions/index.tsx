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

// Update a cell value
export const updateCellFocus = (direction: number, currentCoords: { x: number, y: number }) => {
	return {
		type: 'UPDATE_CELL_FOCUS',
		payload: {
			direction,
			currentCoords
		}
	}
}
