import VisualDrumPatternContext from "./VisualDrumPatternContext";
import { visualDrumPatternReducer } from './visualDrumPatternReducer';
import * as React from 'react';

const VisualDrumPatternState = (props) => {
    const initialState = {
        selectCount: 0,
        touch: false,
    };

    const [state, dispatch] = React.useReducer(visualDrumPatternReducer, initialState);

    const unselectAllPoints = () => {
        dispatch({
            type: 'UNSELECT_ALL',
        });
    };

    const pointSelected = () => {
        dispatch({
            type: 'POINT_SELECTED',
        });
    };

    const increaseSelectCount = () => {
        dispatch({
            type: 'INCREASE_SELECT_COUNT',
        });
    };

    const decreaseSelectCount = () => {
        dispatch({
            type: 'DECREASE_SELECT_COUNT',
        });
    };

    const setTouch = (touch) => {
        dispatch({
            type: 'SET_TOUCH',
            payload: touch,
        });
    };

    return (
        <VisualDrumPatternContext.Provider
            value={{
                anyPointsSelected: state.anyPointsSelected,
                selectCount: state.selectCount,
                touch: state.touch,
                unselectAllPoints: unselectAllPoints,
                pointSelected: pointSelected,
                increaseSelectCount: increaseSelectCount,
                decreaseSelectCount: decreaseSelectCount,
                setTouch: setTouch,
            }}
        >
            {props.children}
        </VisualDrumPatternContext.Provider>
    );
}

export default VisualDrumPatternState;