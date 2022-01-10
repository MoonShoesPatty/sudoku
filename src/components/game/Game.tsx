import React, { FC, Fragment } from 'react';
import { connect } from 'react-redux';

// Components
import Board from '../board/Board';
import InputNumbers from '../inputNumbers/InputNumbers';
import DifficultyIndicator from '../difficultyIndicator/DifficultyIndicator';

// Actions
import { setDifficulty, resetBoard, solveBoard, toggleCandidateMode } from '../../actions';

import './Game.scss';

interface Props {
    isComplete: boolean;
    candidateMode: boolean;
    dispatch: (x: any) => {};
}

const Game: FC<Props> = ({ isComplete, candidateMode, dispatch }) => {
    return (
        <div className='gameWrapper'>
            <div className='gameTopSection'>
                <button className='buttonSecondary' onClick={() => { dispatch(setDifficulty(0)) }}>Back</button>
                <DifficultyIndicator/>
            </div>
            <Board />
            <div className='gameSubSection'>
                <div className='boardSpacer'></div>
                {
                    isComplete ?
                        <Fragment>
                            <div className='buttonsWrapper'>
                                <button className='buttonSecondary' onClick={() => { dispatch(resetBoard()) }}>Reset</button>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <InputNumbers />
                            <div className='buttonsWrapper'>
                                <button className='buttonSecondary'
                                    onClick={() => { dispatch(resetBoard()) }}>Reset</button>
                                <button className='buttonSecondary'
                                    onClick={() => { dispatch(solveBoard()) }}>Solve</button>
                                {/* <input
                                    id='candidateMode'
                                    type='checkbox'
                                    checked={candidateMode}
                                    onChange={() => { dispatch(toggleCandidateMode()) }}
                                />
                                <label
                                    htmlFor='candidateMode'
                                    className='candidateModeLabel'
                                    tabIndex={0}
                                /> */}
                                <button
                                    className={'buttonSecondary candidateModeButton ' + (candidateMode ? 'on' : 'off')}
                                    onClick={() => { dispatch(toggleCandidateMode()) }}>
                                    Candidates
                                    <div>
                                        {(candidateMode ? 'on' : 'off')}
                                    </div>
                                </button>
                            </div>
                        </Fragment>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isComplete: state.board.isComplete,
        candidateMode: state.board.candidateMode
    };
}

export default connect(mapStateToProps)(Game);