import React, { FC, useCallback, Fragment } from 'react';
import { connect } from 'react-redux';

import { updateCellValue } from '../../actions';

import './DifficultyIndicator.scss';

interface Props {
    difficulty: number;
    dispatch: (x: any) => {};
}

const difficultyLabels: {[n: number]: string} = {
    0: 'None',
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
}

const DifficultyIndicator: FC<Props> = ({ difficulty, dispatch }) => {

    return (
        <div className='difficultyIndicator'>
            <div className={'indicator ' + (difficultyLabels[difficulty]?.toLowerCase())}></div>
            <p className='indicatorLabel'>{difficultyLabels[difficulty]}</p>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        difficulty: state.board.difficulty
    };
}

export default connect(mapStateToProps)(DifficultyIndicator);