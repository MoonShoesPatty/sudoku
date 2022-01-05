import
React, {
    FC,
    Fragment,
    useEffect
} from 'react';
import { connect } from 'react-redux';

// Components
import Splash from './components/splash/Splash';
import Game from './components/game/Game';

// Actions
import { updateCellValue, updateCellFocus, checkPuzzleComplete } from './actions';

// Styles
import './App.scss';
import { IBoardState, ICoords } from './reducers/boardStateReducer';

interface Props {
    difficulty: number;
    dispatch: (x: any) => {};
}

const App: FC<Props> = ({ difficulty, dispatch }) => {

    useEffect(() => {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            console.log("Press: " + e.key);
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
                    const newVal = parseInt(e.key);
                    dispatch(updateCellValue(newVal));
                    dispatch(checkPuzzleComplete());
                    break;
                }
                // If backspace or delete, clear cell
                case 'Backspace':
                case 'Delete': {
                    dispatch(updateCellValue(0));
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
                    dispatch(updateCellFocus(e.key, null));
                    break;
                }
            }
        })
    }, []);

    return (
        <Fragment>
            <div className='background'></div>
            <div className='appWrapper'>
                {
                    difficulty === 0 ?
                        <Splash /> :
                        <Game />
                }
            </div>
        </Fragment>
    )
}

const mapStateToProps = (state: { board: IBoardState }) => {
    return {
        difficulty: state.board.difficulty
    };
}

export default connect(mapStateToProps)(App);