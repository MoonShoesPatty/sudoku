import React, { FC, useCallback } from 'react';
import { connect } from 'react-redux';

// Components
import Board from '../board/Board';

// Actions
import { setDifficulty } from '../../actions';

import './Game.scss';

interface Props {
    dispatch: (x: any) => {};
}

const Game: FC<Props> = ({ dispatch }: { [s: string]: any }) => {
    return (
        <div className='gameWrapper'>
            <button onClick={() => { dispatch(setDifficulty(0)) }}>Back</button>
            <Board/>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        // difficulty: state.gameState.difficulty
    };
}

export default connect(mapStateToProps)(Game);