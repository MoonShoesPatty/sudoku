interface stateTypes {
	difficulty: number
}

const initialState: stateTypes = {
	difficulty: 0
};

export default (state = initialState, action: { type: string, payload: any }) => {
	switch (action.type) {
		case 'SET_DIFFICULTY':
			return {
				...state,
				difficulty: action.payload
			};
		default:
			return state;
	}
}
