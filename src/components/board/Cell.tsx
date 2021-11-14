import React, { FC, SyntheticEvent, useCallback } from 'react';
import { updateCellValue } from '../../actions';

import './Board.scss';

interface Props {
    value: number;
    readOnly: boolean;
    coords: { x: number, y: number }
    dispatch: (x: any) => {};
}

const Cell: FC<Props> = ({ value, readOnly, coords, dispatch }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value);
        if (newVal > 0 && newVal < 10)
            dispatch(updateCellValue(newVal, coords));
    }, []);

    return (
        <input
            disabled={readOnly}
            onChange={handleChange}
            className='cell'
            value={value === 0 ? '' : value}
        />
    )
}

const mapStateToProps = (state: any) => {
    return {
        board: state.board.board
    };
}

export default Cell;