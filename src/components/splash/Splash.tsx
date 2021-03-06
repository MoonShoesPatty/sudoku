import React, { FC } from 'react';
import { connect } from 'react-redux';

import { setDifficulty } from '../../actions';

import './Splash.scss';

interface Props {
    dispatch: (x: any) => {};
}

const Splash: FC<Props> = ({ dispatch }: { [s: string]: any }) => {
    return (
        <div className='splashWrapper'>
            <div className='splashDecal top'></div>
            <div className='titleWrapper'>
                <h1>Sudoku</h1>
                <div className='titleDecal'></div>
            </div>
            <button onClick={() => { dispatch(setDifficulty(1)) }}>Easy</button>
            <button onClick={() => { dispatch(setDifficulty(2)) }}>Medium</button>
            <button onClick={() => { dispatch(setDifficulty(3)) }}>Hard</button>
            <div className='splashDecal bottom'></div>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        // difficulty: state.gameState.difficulty
    };
}

export default connect(mapStateToProps)(Splash);