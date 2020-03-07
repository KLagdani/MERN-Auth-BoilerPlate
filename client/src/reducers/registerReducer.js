import {
  USER_REGISTERED_FOR_CONFIRMATION,
  USER_CONFIRMED,
  CHECK_USER_CONFIRMATION,
  NEW_CONFRIMATION_MAIL
} from "../actions/types";

const initialState = {
  user: {},
  confirmation: {
    emailSent: false,
    newEmailSent: false,
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
          emailSent: action.payload.emailSent,
          isConfirmed: false,
          newEmailSent: false
        }
      };
    case USER_CONFIRMED:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          isConfirmed: true
        },
        user: action.payload
      };
    case NEW_CONFRIMATION_MAIL:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          newEmailSent: action.payload.emailSent,
          isConfirmed: action.payload.user.confirmed
        },
        user: {
          ...state.user,
          email: action.payload.user.email
        }
      };
    case CHECK_USER_CONFIRMATION:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          isConfirmed: action.payload.isConfirmed
        }
      };
    default:
      return state;
  }
};
