import axios from "axios";
import { setAlert } from "./alert";
import { removeCards } from "./game/upload";
import { removeDecks } from "./game/deck";
import { removeGameSessions } from "./game/game";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  GENERATETOKEN_SUCCESS,
  GENERATETOKEN_FAIL,
} from "./types";
import setAuthToken from "../utils/setAuthToken";
// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
      const res = await axios.get("/api/auth");
/*      const res = await axios.get("//localhost:5000/api/auth"); */
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//generate accesstoken for user registration
export const generateToken = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = {};
  try {
      const res = await axios.post("/api/accesstokens/generate", body, config);
/*      const res = await axios.post("//localhost:5000/api/accesstokens/generate", body, config); */

    dispatch({
      type: GENERATETOKEN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert("Generate Token failed", "danger"));
    dispatch({
      type: GENERATETOKEN_FAIL,
    });
  }
};

//Register User
export const register = ({ name, email, password, tokenval }) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password, tokenval });

  try {
      const res = await axios.post("/api/users", body, config);
/*      const res = await axios.post("//localhost:5000/api/users", body, config); */

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert("Registration success.", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error, i) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });
  try {
      const res = await axios.post("/api/auth", body, config);
/*      const res = await axios.post("//localhost:5000/api/auth", body, config);*/
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
  
      if (err && err.response) {
      const errors = err.response.data.errors;

          errors.forEach((error, i) => {
              dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout / Clear profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
  dispatch(removeCards());
  dispatch(removeDecks());
  dispatch(removeGameSessions());
};
