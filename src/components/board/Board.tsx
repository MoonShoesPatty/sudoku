import React, { FC, useCallback } from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';

import './Board.scss';

interface Props {
    dispatch: (x: any) => {};
    board: number[][];
    initialBoard: number[][];
}

const Board: FC<Props> = ({ board, initialBoard, dispatch }) => {
    const handleCellChange = useCallback(() => {

    }, []);

    return (
        <div className='boardWrapper'>
            {
                board.map((row, yIdx) => {
                    return (
                        <div className='row' key={yIdx}>
                            {
                                row.map((cell, xIdx) => {
                                    return (
                                        <Cell
                                            dispatch={dispatch}
                                            value={cell}
                                            readOnly={initialBoard[yIdx][xIdx] != 0}
                                            coords={{ x: xIdx, y: yIdx }}
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

const mapStateToProps = (state: any) => {
    return {
        board: state.board.board,
        initialBoard: state.board.initialBoard
    };
}

export default connect(mapStateToProps)(Board);