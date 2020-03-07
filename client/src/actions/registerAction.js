import axios from "axios";

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  USER_REGISTERED_FOR_CONFIRMATION
} from "./types";

// Register User
export const registerUser = userData => dispatch => {
  axios
    .post("/api/register/local", userData)
    .then(res => {
      dispatch({
        type: USER_REGISTERED_FOR_CONFIRMATION,
        payload: res.data
      });
      dispatch({
        type: CLEAR_ERRORS
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
