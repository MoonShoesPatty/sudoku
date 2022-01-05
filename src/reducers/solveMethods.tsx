import { ICell, ICoords } from "./boardStateReducer";

/**
 * Solve a board (ignores user inputs)
 * @param boardCells 
 * @returns solved board
 */
export const solveBoard = (boardCells: ICell[][]): ICell[][] => {
    // Reset first to ensure user input doesn't affect anything we do here
    boardCells = resetBoard(boardCells);
    // Indicates whether a number has bee solved this round, indicating that new information
    // exists and we want to run through the solve algorithm again with that new number included
    let hasNewInformation = true;
    while (hasNewInformation) {
        hasNewInformation = false;
        // ========================== //
        //     Solve the easy way     //
        // ========================== //
        // #region Easy
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (boardCells[i][j].value === 0) {
                    boardCells[i][j].possibilities = getCellPossibilities({ x: j, y: i }, boardCells);
                    if (boardCells[i][j].possibilities.length === 1) {
                        boardCells[i][j].value = boardCells[i][j].possibilities[0];
                        hasNewInformation = true;
                    }
                }
            }
        }
        // #endregion Easy

        // ========================== //
        //    Solve the medium way    //
        // ========================== //
        // Take all the cell possiblities and find which exist alone in ther row or column
        //  i.e. look at all cells in a row, and look for the only place a '5' can go in that row
        // #region Medium
        // TODO: Performance test. Is it better to continue to solve the easy way only or is
        //       it better to use the possiblity information we figured out above to solve more
        if (!hasNewInformation) {
            // Each row from top to bottom
            // And column from left to right in the second chunk below (as 'j')
            for (let i = 0; i < 9; i++) {
                const rowCheckedNumbers: number[] = [];
                const colCheckedNumbers: number[] = [];
                // Each cell in the row left to right
                for (let j = 0; j < 9; j++) {
                    // This if ensures that numbers solved within the last go around are appropriately excluded from
                    // the possible numbers, since the number possibilities are only calculated at the top once per iteration
                    if (boardCells[i][j].value !== 0) {
                        rowCheckedNumbers.push(boardCells[i][j].value);
                    } else {
                        boardCells[i][j].possibilities.forEach((possibleNumber: number) => {
                            // true if the number is found to be possible in another cell in the row
                            let numberFound = false;
                            // Skip any number we've already checked for this row
                            if (rowCheckedNumbers.indexOf(possibleNumber) === -1) {
                                // We are now checking this number, don't need to do it again
                                rowCheckedNumbers.push(possibleNumber);
                                // Each other cell in the row to the right of the current one
                                // We start at j + 1 because we've checked all the cells to the
                                // left and stored the numbers that don't work in rowCheckedNumbers
                                for (let k = j + 1; k < 9; k++) {
                                    if (boardCells[i][k].value === 0) {
                                        if (boardCells[i][k].possibilities.indexOf(possibleNumber) !== -1) {
                                            numberFound = true;
                                            break;
                                        }
                                    } else if (boardCells[i][k].value === possibleNumber) {
                                        numberFound = true;
                                        break;
                                    }
                                }
                                // Number is not found in any other array, meaning this is the only place it can go in this row
                                if (!numberFound) {
                                    boardCells[i][j].value = possibleNumber;
                                    hasNewInformation = true;
                                }
                            }
                        });
                    }
                    // Break the row loop if we've checked every number
                    if (rowCheckedNumbers.length === boardCells.length) {
                        break;
                    }
                }

                // Each cell in the column from top to bottom
                for (let j = 0; j < 9; j++) {
                    // This if ensures that numbers solved within the last go around are appropriately excluded from
                    // the possible numbers, since the number possibilities are only calculated at the top once per iteration
                    if (boardCells[j][i].value !== 0) {
                        colCheckedNumbers.push(boardCells[j][i].value);
                    } else {
                        boardCells[j][i].possibilities.forEach((possibleNumber: number) => {
                            let numberFound = false;
                            if (colCheckedNumbers.indexOf(possibleNumber) === -1) {
                                // We are now checking this number, don't need to do it again
                                colCheckedNumbers.push(possibleNumber);
                                // Each other cell in the row to the right of the current one
                                // We start at j + 1 because we've checked all the cells to the left and stored the numbers that don't work in colCheckedNumbers
                                for (let k = j + 1; k < 9; k++) {
                                    if (boardCells[k][i].value === 0) {
                                        // Another empty space on the board, i.e. has numbers that can possibly go there
                                        if (boardCells[k][i].possibilities.indexOf(possibleNumber) != -1) {
                                            numberFound = true;
                                            break;
                                        }
                                    } else if (boardCells[k][i].value === possibleNumber) {
                                        numberFound = true;
                                        break;
                                    }
                                }
                                // Number is not found in any other array, meaning this is the only place it can go
                                if (!numberFound) {
                                    boardCells[j][i].value = possibleNumber;
                                    hasNewInformation = true;
                                }
                            }
                        });
                    }
                    // Break the column loop if we've checked every number
                    if (colCheckedNumbers.length === boardCells.length) {
                        break;
                    }
                }
            }
            // Do the box possibilities the same way (i.e. see if there are numbers that only have one home)
            // a = box offset horizontal
            for (let a = 0; a < 9; a += 3) {
                // b = box offset vertical
                for (let b = 0; b < 9; b += 3) {
                    let boxCheckedNumbers: number[] = [];
                    // Each row inside the box
                    for (let i = 0 + a; i < 3 + a; i++) {
                        // Each cell inside the row inside the box
                        for (let j = 0 + b; j < 3 + b; j++) {
                            // Finally we get to solving things
                            if (boardCells[i][j].value !== 0) {
                                boxCheckedNumbers.push(boardCells[i][j].value);
                            } else {
                                boardCells[i][j].possibilities.forEach((possibleNumber) => {
                                    let numberFound = false;
                                    if (boxCheckedNumbers.indexOf(possibleNumber) === -1) {
                                        boxCheckedNumbers.push(possibleNumber);
                                        // To check the boxes is a little tougher
                                        // for now, just check all other cells in the box
                                        // TODO: Figure out how to get the 'all cells to the right' concept going
                                        for (let k = 0 + a; k < 3 + a; k++) {
                                            for (let m = 0 + b; m < 3 + b; m++) {
                                                if (!(i === k && j === m)) {
                                                    if (boardCells[k][m].value === 0) {
                                                        if (boardCells[k][m].possibilities.indexOf(possibleNumber) !== -1) {
                                                            numberFound = true;
                                                        }
                                                    } else if (boardCells[k][m].value === possibleNumber) {
                                                        numberFound = true;
                                                    }
                                                }
                                                // Break both loops
                                                if (numberFound) {
                                                    k = 10;
                                                    m = 10;
                                                }
                                            }
                                        }
                                        // Number is not found in any other array, meaning this is the only place it can go
                                        if (!numberFound) {
                                            boardCells[i][j].value = possibleNumber;
                                            hasNewInformation = true;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        // #endregion Medium
    }

    return boardCells;
}

/**
 * Gets all numbers possible in a given cell
 * @param coords 
 * @param boardCells 
 * @returns array of possible numbers
 */
const getCellPossibilities = (coords: ICoords, boardCells: ICell[][]): number[] => {
    const possibleArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Row and column possibilities
    for (let i = 0; i < 9; i++) {
        if (i != coords.x && possibleArray.indexOf(boardCells[coords.y][i].value) != -1) {
            possibleArray.splice(possibleArray.indexOf(boardCells[coords.y][i].value), 1);
        }
        if (i != coords.y && possibleArray.indexOf(boardCells[i][coords.x].value) != -1) {
            possibleArray.splice(possibleArray.indexOf(boardCells[i][coords.x].value), 1);
        }
    }

    // Box possibilities
    const boxAcrossOffset = Math.floor(coords.x / 3) * 3;
    const boxDownOffset = Math.floor(coords.y / 3) * 3;
    // Check box
    for (let i = 0 + boxAcrossOffset; i < 3 + boxAcrossOffset; i++) {
        for (let j = 0 + boxDownOffset; j < 3 + boxDownOffset; j++) {
            if ((i != coords.x || j != coords.y) && possibleArray.indexOf(boardCells[j][i].value) != -1) {
                possibleArray.splice(possibleArray.indexOf(boardCells[j][i].value), 1);
            }
        }
    }
    return possibleArray;
};

/**
 * Reset values of board to initial state
 * @param boardCells 
 * @returns The reset board
 */
const resetBoard = (boardCells: ICell[][]): ICell[][] => {
    for (let i = 0; i < boardCells.length; i++) {
        for (let j = 0; j < boardCells.length; j++) {
            if (boardCells[i][j].initialValue === 0) {
                boardCells[i][j].value = 0;
                boardCells[i][j].possibilities = [];
            }
        }
    }
    return boardCells;
}

// const bruteForce = (boardCells: ICell[][]): {boardCells: ICell[][], isSuccess: boolean} => {
//     if (tryAllCellOptions({ x: 0, y: 0 }, boardCells)) {
//     }
//     else {
//         console.log('Nah, B');
//         console.timeEnd('Brute Force');
//     }
//     return true;
// }

// const advanceCoords = (coords: ICoords): ICoords => {
//     const nextCoords: ICoords = {
//         x: coords.x + 1,
//         y: coords.y
//     };

//     if (nextCoords.x >= 9) {
//         nextCoords.y++;
//         nextCoords.x = 0;
//     }

//     return nextCoords;
// }

// const tryAllCellOptions = (coords: ICoords, boardCells: ICell[][]): boolean => {
//     if (boardCells[coords.row][coords.col].initialValue === 0) {
//         boardCells[coords.row][coords.col].classList.add('change');
//         for (let i = 1; i <= 9; i++) {
//             boardCells[coords.row][coords.col].value = i;
//             if (checkValidInput(coords, i, board)) {
//                 board[coords.row][coords.col] = i;
//                 const nextCoords = advanceCoords(coords);
//                 if (nextCoords.row == 7) {
//                     console.log('hi');
//                 }

//                 if (nextCoords.row < 9 && nextCoords.col < 9) {
//                     boardCells[coords.row][coords.col].classList.remove('change');
//                     if (tryAllCellOptions(nextCoords)) {
//                         return true;
//                     }
//                     boardCells[coords.row][coords.col].classList.add('change');
//                 }
//                 else {
//                     return true;
//                 }
//             }
//         }
//         boardCells[coords.row][coords.col].value = '';
//         board[coords.row][coords.col] = 0;
//     }
//     else {
//         const nextCoords = advanceCoords(coords);
//         if (nextCoords.row < 9 && nextCoords.col < 9) {
//             if (tryAllCellOptions(nextCoords)) {
//                 return true;
//             }
//         }
//         else {
//             return true;
//         }
//     }
//     return false;
// }