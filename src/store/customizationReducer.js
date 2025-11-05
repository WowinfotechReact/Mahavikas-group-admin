// action - state management
import * as actionTypes from './actions';

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

export const initialState = {
  isOpen: 'dashboard', //for active default menu
  navType: ''
};

const customizationReducer = (state = initialState, action) => {
  console.log('Action:', action);
  console.log('State before:', state);
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      console.log('State after:', { ...state, isOpen: action.isOpen });
      return {
        ...state,
        isOpen: action.isOpen
      };
    case actionTypes.MENU_TYPE:
      return {
        ...state,
        navType: action.navType
      };
    default:
      return state;
  }
};

export default customizationReducer;
