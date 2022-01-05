// Set difficulty
export const setDifficulty = (level: number) => {
	return {
		type: 'SET_DIFFICULTY',
		payload: level
	}
}

export const toggleCandidateMode = () => {
	return {
		type: 'TOGGLE_CANDIDATE_MODE',
		payload: {}
	}
}

// Fetch a board of the appropriate level
export const resetBoard = () => {
	return {
		type: 'RESET_BOARD',
		payload: {}
	}
}

// Fetch a board of the appropriate level
export const solveBoard = () => {
	return {
		type: 'SOLVE_BOARD',
		payload: {}
	}
}

// Update a cell value
export const updateCellValue = (newVal: number) => {
	return {
		type: 'UPDATE_CELL_VALUE',
		payload: {
			newVal
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
export const updateCellFocus = (eventKey: string, coords: { x: number, y: number } | null) => {
	return {
		type: 'UPDATE_CELL_FOCUS',
		payload: {
			eventKey,
			coords
		}
	}
}
