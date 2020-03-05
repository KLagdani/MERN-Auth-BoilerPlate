import { USER_REGISTERED_FOR_CONFIRMATION } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  loadingConfirmation: true,
  isConfirmed: false,
  tickers: [],
  user: {},
  forgotPasswordSent: false,
  reset: {
    loadingReset: true,
    isResetTokenValid: false,
    resetSuccess: false,
    email: ""
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_REGISTERED_FOR_CONFIRMATION:
      return {
        ...state,
        isConfirmed: false
      };
    default:
      return state;
  }
};
