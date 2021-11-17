import React, { FC, useCallback, useEffect, useRef } from 'react';
import { updateCellValue, updateCellFocus, checkPuzzleComplete } from '../../actions';
import { ICell } from '../../reducers/boardStateReducer';

import './Board.scss';

interface Props {
    data: ICell;
    isFocused: boolean;
    dispatch: (x: any) => {};
}

const Cell: FC<Props> = ({ data, isFocused, dispatch }) => {
    const cellRef = useRef(null);

    // Do nothing, satisfies react's need for an onchange handler
    const handleChange = useCallback((_: React.ChangeEvent<HTMLInputElement>) => { }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            // If any number key, update cell
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': {
                if (data.initialValue === 0) {
                    const newVal = parseInt(e.key);
                    dispatch(updateCellValue(newVal, data.coords));
                    dispatch(checkPuzzleComplete());
                }
                break;
            }
            // If backspace or delete, clear cell
            case 'Backspace':
            case 'Delete': {
                dispatch(updateCellValue(0, data.coords));
                break;
            }
            case 'Enter': {
                break;
            }
            // If any of the arrow keys, try to navigate
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowRight':
            case 'ArrowLeft': {
                dispatch(updateCellFocus(e.key, data.coords));
                break;
            }
        }
    }, [data.coords]);

    useEffect(() => {
        if (isFocused)
            cellRef.current.focus();
    }, [isFocused]);

    const handleFocus = useCallback(() => {
        cellRef.current.setSelectionRange(1, 1);
        if (!isFocused)
            dispatch(updateCellFocus(null, data.coords));
    }, [isFocused, cellRef]);

    return (
        <input
            ref={cellRef}
            className={'cell' +
                (data.isValid ? '' : ' invalid') +
                (data.initialValue === 0 ? '' : ' disabled')}
            // disabled={data.initialValue !== 0}
            // readOnly
            value={data.value === 0 ? '' : data.value}
            onFocus={handleFocus}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    )
}

export default Cell;