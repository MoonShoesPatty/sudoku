import React, { FC } from 'react';
import { connect } from 'react-redux';

import { updateCellValue } from '../../actions';

import './InputNumbers.scss';

interface Props {
    candidateMode: boolean;
    dispatch: (x: any) => {};
}

const InputNumbers: FC<Props> = ({ candidateMode, dispatch }) => {
    return (
        <div className='inputNumbersWrapper'>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(1)) }}>1</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(2)) }}>2</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(3)) }}>3</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(4)) }}>4</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(5)) }}>5</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(6)) }}>6</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(7)) }}>7</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(8)) }}>8</button>
            <button className='inputNumber' onClick={() => { dispatch(updateCellValue(9)) }}>9</button>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        candidateMode: state.board.candidateMode
    };
}

export default connect(mapStateToProps)(InputNumbers);