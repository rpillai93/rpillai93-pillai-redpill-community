import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, GAMENAME_SET } from "./types";

//Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
  /*   const res = await axios.get("//localhost:5000/api/profile/me");*/
      const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Set gamename
export const setGameName = (gamename) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ gamename });
  try {
      /*const res = await axios.post("//localhost:5000/api/profile", body, config);*/
      const res = await axios.post("/api/profile", body, config);
    dispatch({
      type: GAMENAME_SET,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error, i) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
