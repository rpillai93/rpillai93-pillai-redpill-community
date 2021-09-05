import axios from "axios";
import { setAlert } from "../alert";
import {
  CREATEGAME_SUCCESS,
  CREATEGAME_FAIL,
  JOINGAME_SUCCESS,
  JOINGAME_FAIL,
  REG_GAMESESSIONS_FOUND,
  REG_GAMESESSIONS_NOTFOUND,
  GAMESESSIONS_ERROR,
  REGPROFTOGAME_SUCCESS,
  REGPROFTOGAME_FAIL,
  REMOVE_GAMESESSIONS,
  SETLOCALSESSION_SUCCESS,
  SETLOCALSESSION_FAIL,
} from "../types";

//Create game session
export const createSession = (playerLimit, deckId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ deckId, playerLimit });
  try {
      const res = await axios.post("/api/game/create", body, config);
/*     const res = await axios.post("//localhost:5000/api/game/create", body, config);*/
    dispatch({
      type: CREATEGAME_SUCCESS,
      payload: res.data,
    });
    dispatch(
      setAlert(
        "Game created successfully! Redirecting....Please Wait",
        "success",
        1000
      )
    );
    setTimeout(
      () =>
        dispatch(
          registerProfileToSession(
            res.data.createdBy.profileId,
            res.data.createdBy.gamename,
            res.data._id
          )
        ),
      1000
    );
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error, i) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: CREATEGAME_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Join session based on games found:
export const joinSession = (ind, foundgames, profile) => async (dispatch) => {
  try {
    if (profile && foundgames.length > 0 && ind > -1) {
      dispatch({
        type: JOINGAME_SUCCESS,
        payload: foundgames[ind],
      });
      dispatch(setAlert("Redirecting to game....Please Wait", "success", 1000));
      setTimeout(
        () =>
          dispatch(
            registerProfileToSession(
              profile._id,
              profile.gamename,
              foundgames[ind]._id
            )
          ),
        1000
      );
    } else {
      throw new Error("Error: Could not join session."); // (*)
    }
  } catch (err) {
    dispatch({
      type: JOINGAME_FAIL,
      payload: { msg: err.message },
    });
  }
};

//Register profile to session
export const registerProfileToSession = (
  profileId,
  gamename,
  sessionId
) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ profileId, gamename, sessionId });
  try {
      const res = await axios.post("/api/game/register", body, config);
      /*const res = await axios.post("//localhost:5000/api/game/register", body, config); */

    dispatch({
      type: REGPROFTOGAME_SUCCESS,
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
      type: REGPROFTOGAME_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get game sessions
export const findGameSessions = () => async (dispatch) => {
  try {
      const res = await axios.get("/api/game/findgames");
/*      const res = await axios.get("//localhost:5000/api/game/findgames"); */
    if (res.data.length !== 0) {
      dispatch({
        type: REG_GAMESESSIONS_FOUND,
        payload: res.data,
      });
    } else {
      dispatch({
        type: REG_GAMESESSIONS_NOTFOUND,
        payload: [],
      });
    }
  } catch (err) {
    dispatch({
      type: GAMESESSIONS_ERROR,
      payload: { msg: err.response, status: err.response.status },
    });
  }
};

export const storeLocalSession = (localSession, profile) => async (
  dispatch
) => {
  try {
    var activeGame = null;
    if (localStorage.getItem("activeGame") || localSession) {
      if (localStorage.getItem("activeGame"))
        activeGame = JSON.parse(localStorage.getItem("activeGame"));
      else {
        const { _id, deck, playerLimit } = localSession;
        activeGame = {
          sessionID: _id,
          deckID: deck,
          pLim: playerLimit,
          meID: profile._id,
          me: profile.gamename,
        };
        localStorage.setItem("activeGame", JSON.stringify(activeGame));
      }
      dispatch({
        type: SETLOCALSESSION_SUCCESS,
        payload: activeGame,
      });
    } else {
      throw new Error("Error: Could not join session");
    }
  } catch (err) {
    dispatch({
      type: SETLOCALSESSION_FAIL,
      payload: { msg: err.message },
    });
  }
};

//Remove game sessions
export const removeGameSessions = () => (dispatch) => {
  dispatch({ type: REMOVE_GAMESESSIONS });
};
