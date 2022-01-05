import React, { FC, useCallback } from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';

import './Board.scss';
import { IBoardState } from '../../reducers/boardStateReducer';

interface Props extends IBoardState {
    dispatch: (x: any) => {};
}

const Board: FC<Props> = ({ boardCells, focusedCell, isComplete, dispatch }) => {
    console.log(focusedCell);
    return (
        <div className='boardWrapper'>
            {
                boardCells.map((row, yIdx) => {
                    return (
                        <div className='row' key={yIdx}>
                            {
                                row.map((data, xIdx) => {
                                    return (
                                        <Cell
                                            dispatch={dispatch}
                                            isComplete={isComplete}
                                            isFocused={focusedCell != null && focusedCell.x === xIdx && focusedCell.y === yIdx}
                                            data={data}
                                            key={xIdx + '/' + yIdx}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

const mapStateToProps = (state: { board: IBoardState }): IBoardState => {
    return {
        ...state.board
    };
}

export default connect(mapStateToProps)(Board);