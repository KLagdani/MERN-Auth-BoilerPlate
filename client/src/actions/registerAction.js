import axios from "axios";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  USER_REGISTERED_FOR_CONFIRMATION,
  USER_CONFIRMED
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

//Confirm User
export const confirmUser = token => dispatch => {
  axios
    .post("/api/register/confirmation", token)
    .then(res => {
      const decoded = jwt_decode(token.token);
      dispatch({
        type: USER_CONFIRMED,
        payload: decoded
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
