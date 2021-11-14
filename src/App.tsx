import
React, {
    FC,
    useEffect
} from 'react';
import { connect } from 'react-redux';

// Components
import Splash from './components/splash/Splash';
import Game from './components/game/Game';

// Actions
import { getBoard } from './actions';

// Styles
import './App.scss';

interface Props {
    difficulty: number;
    dispatch: (x: any) => {};
}

const App: FC<Props> = (props) => {
    useEffect(() => {
        if (props.difficulty > 0)
        {
            props.dispatch(getBoard(props.difficulty))
        }
    }, [props.difficulty]);

    return (
        <div className='appWrapper'>
            {
                props.difficulty === 0 ?
                    <Splash /> :
                    <Game />
            }
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        difficulty: state.gameState.difficulty
    };
}

export default connect(mapStateToProps)(App);