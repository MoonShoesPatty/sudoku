import React, { FC, useCallback, Fragment } from 'react';
import { connect } from 'react-redux';

import { updateCellValue } from '../../actions';

import './InputNumbers.scss';

interface Props {
    candidateMode: boolean;
    dispatch: (x: any) => {};
}

const InputNumbers: FC<Props> = ({ candidateMode, dispatch }) => {
    const buildButtonJsx = useCallback((): React.ReactNode => {
        const inputNums: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return <Fragment>
            {
                inputNums.map((val: number) => {
                    return <button
                        key={val}
                        className='inputNumber'
                        onClick={() => { dispatch(updateCellValue(val)) }}>
                        {
                            candidateMode ?
                                buildCandidateHtml(val) :
                                val
                        }
                    </button>
                })
            }
        </Fragment>
    }, [candidateMode]);

    const buildCandidateHtml = useCallback((number: number): React.ReactNode => {
        const allCells = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        return allCells.map((row, rowIdx) => {
            return <div key={rowIdx} className='possibilityRow'>{
                row.map((val, colIdx) => {
                    return <div key={val} className='possibilityCell'>{
                        number === ((rowIdx * 3) + (colIdx + 1)) ? val : ''
                    }</div>
                })
            }</div>
        });
    }, []);

    return (
        <div className='inputNumbersWrapper'>
            {buildButtonJsx()}
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        candidateMode: state.board.candidateMode
    };
}

export default connect(mapStateToProps)(InputNumbers);