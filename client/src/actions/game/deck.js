import axios from "axios";
import { setAlert } from "../alert";
import {
  CREATEDECK_SUCCESS,
  CREATEDECK_FAIL,
  DECKS_LOADED,
  DECKS_LOADED_FAILED,
  REMOVE_ALLDECKS,
  ADDCARDTODECK_SUCCESS,
  ADDCARDTODECK_FAIL,
} from "../types";

//Create empty deck
export const createEmptyDeck = (deckname) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ deckname });
  try {
      const res = await axios.post("/api/deck/create", body, config);
     /* const res = await axios.post("//localhost:5000/api/deck/create", body, config); */
    dispatch({
      type: CREATEDECK_SUCCESS,
      payload: res.data,
    });
    dispatch(getAllDecks());
    dispatch(
      setAlert(
        'The deck "' + deckname + '" was created successfully!',
        "success",
        3000
      )
    );
  } catch (err) {
    dispatch({
      type: CREATEDECK_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    dispatch(
      setAlert('The deck "' + deckname + '" already exists!', "danger", 3000)
    );
  }
};

//Add card to deck
export const addCardToDeck = (cardId, cardsrc, deckId, deckname) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ cardId, cardsrc, deckId });
  try {
      const res = await axios.post("/api/deck/addcard", body, config);
/*      const res = await axios.post("//localhost:5000/api/deck/addcard", body, config); */
    dispatch({
      type: ADDCARDTODECK_SUCCESS,
      payload: res.data,
    });

    dispatch(
      setAlert(
        'Card was added to deck "' + deckname + '" successfully!',
        "success",
        3000
      )
    );
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error, i) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: ADDCARDTODECK_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//Get Decks
export const getAllDecks = () => async (dispatch) => {
  try {
      const res = await axios.get("/api/deck/get");
/*      const res = await axios.get("//localhost:5000/api/deck/get");*/
    dispatch({
      type: DECKS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DECKS_LOADED_FAILED,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//Remove decks
export const removeDecks = () => (dispatch) => {
  dispatch({ type: REMOVE_ALLDECKS });
};
