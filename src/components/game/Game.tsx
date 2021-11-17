import React, { FC, useCallback } from 'react';
import { connect } from 'react-redux';

// Components
import Board from '../board/Board';

// Actions
import { setDifficulty } from '../../actions';

import './Game.scss';

interface Props {
    isComplete: boolean;
    dispatch: (x: any) => {};
}

const Game: FC<Props> = ({ isComplete, dispatch }: { [s: string]: any }) => {
    return (
        <div className='gameWrapper'>
            <button onClick={() => { dispatch(setDifficulty(0)) }}>Back</button>
            <Board/>
            {
                isComplete &&
                <p>YOOOOOOOO</p>
            }
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        // difficulty: state.gameState.difficulty
        isComplete: state.board.isComplete
    };
}

export default connect(mapStateToProps)(Game);