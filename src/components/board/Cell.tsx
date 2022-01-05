import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { updateCellValue, updateCellFocus, checkPuzzleComplete } from '../../actions';
import { ICell } from '../../reducers/boardStateReducer';

import './Board.scss';

interface Props {
    data: ICell;
    isFocused: boolean;
    isComplete: boolean;
    dispatch: (x: any) => {};
}

const Cell: FC<Props> = ({ data, isFocused, isComplete, dispatch }) => {
    const cellRef = useRef(null);

    useEffect(() => {
        if (isFocused)
            // TODO: Is this an accessibility problem?
            cellRef.current.focus();
    }, [isFocused, cellRef]);

    const handleFocus = useCallback(() => {
        if (!isFocused)
            dispatch(updateCellFocus(null, data.coords));
    }, [isFocused, data.coords]);

    const buildPossibilities = useCallback((): ReactNode => {
        const allCells = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        return allCells.map((row, idx) => {
            return <div key={idx} className='possibilityRow'>{
                row.map((val) => {
                    return <div key={val} className='possibilityCell'>{
                        data.possibilities.indexOf(val) === -1 ? '' : val
                    }</div>
                })
            }</div>
        });
    }, [data.possibilities]);

    const delay: number = useMemo(() => {
        const xDelay: number = 0.15;
        return (data.coords.x + data.coords.y) * xDelay;
    }, [data.coords]);

    return (
        <div
            ref={cellRef}
            style={{ animationDelay: delay + 's' }}
            className={'cell' +
                (isFocused ? ' focus' : '') +
                (isComplete ? ' complete' : '') +
                (data.isValid ? '' : ' invalid') +
                (data.initialValue === 0 ? '' : ' disabled')}
            onFocus={handleFocus}
            // onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {data.value === 0 ?
                data.possibilities.length === 0 ?
                    ''
                    : buildPossibilities()
                : data.value}
        </div>
    )
}

export default Cell;