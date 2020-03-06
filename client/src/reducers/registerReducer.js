import { USER_REGISTERED_FOR_CONFIRMATION } from "../actions/types";

const initialState = {
  user: {},
  confirmation: {
    emailSent: false,
    loadingConfirmation: true,
    isConfirmed: false
  },
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
        user: {
          ...state.user,
          email: action.payload.user.email
        },
        confirmation: {
          ...state.confirmation,
          emailSent: action.payload.emailSent
        }
      };
    default:
      return state;
  }
};
