export const visualDrumPatternReducer = (state, action) => {
    switch(action.type) {
        case 'UNSELECT_ALL': 
            return {
                ...state,
                selectCount: 0,
            };
        case 'POINT_SELECTED':
            return {
                ...state,
                anyPointsSelected: true,
            };
        case 'INCREASE_SELECT_COUNT':
            return {
                ...state,
                selectCount: state.selectCount + 1,
            };        
        case 'DECREASE_SELECT_COUNT':
            return {
                ...state,
                selectCount: state.selectCount > 0 ? state.selectCount - 1 : 0,
            };
        case 'SET_TOUCH':
            return {
                ...state,
                touch: action.payload,
            };        
        default:
            return state;
    }
};