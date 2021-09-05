import axios from "axios";
import { setAlert } from "../alert";
import {
  CARDUPLOAD_SUCCESS,
  CARDUPLOAD_FAIL,
  CARDS_LOADED,
  CARDS_LOADED_FAILED,
  REMOVECARD_SUCCESS,
  REMOVECARD_FAIL,
  REMOVE_ALLCARDS,
} from "../types";

//Upload card
export const uploadCard = (formData) => async (dispatch) => {

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

    try {
  
        const res = await axios.post("/api/upload/card", formData, config);
/*        const res = await axios.post("//localhost:5000/api/upload/card", formData, config); */

    dispatch({
      type: CARDUPLOAD_SUCCESS,
      payload: res.data,
    });
    dispatch(getAllCards());
    dispatch(setAlert("Successfully uploaded card!", "success", 3000));
    } catch (err) {

        if (err && err.response) {
            const errors = err.response.data.errors;
      errors.forEach((error, i) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: CARDUPLOAD_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get Cards
export const getAllCards = () => async (dispatch) => {

  try {
      const res = await axios.get("/api/upload/cards");
/*      const res = await axios.get("//localhost:5000/api/upload/cards"); */
  
    dispatch({
      type: CARDS_LOADED,
      payload: res.data,
    });
  } catch (err) {
      if (err.response) {
          dispatch({
              type: CARDS_LOADED_FAILED,
              payload: { msg: err.response.statusText, status: err.response.status },
          });
      }
  }
};
//Delete single card by id
export const deleteCard = (id, stID) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = { data: { id, stID } };

  try {
      const res = await axios.delete("/api/upload/card", body, config);
/*      const res = await axios.delete("//localhost:5000/api/upload/card", body, config); */
    dispatch({
      type: REMOVECARD_SUCCESS,
    });
    dispatch(setAlert(res.data.msg, "success", 3000));
    dispatch(getAllCards());
  } catch (err) {
    dispatch({
      type: REMOVECARD_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//Remove cards
export const removeCards = () => (dispatch) => {
  dispatch({ type: REMOVE_ALLCARDS });
};
