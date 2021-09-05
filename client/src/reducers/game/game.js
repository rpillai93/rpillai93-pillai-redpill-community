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
} from "../../actions/types";
const initialState = {
  session: null,
  foundgames: [],
  userRegistered: false,
  loading: true,
  activeGame: null,
  playersInGame: 0,
  error: {},
};

const game = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case JOINGAME_SUCCESS:
        case CREATEGAME_SUCCESS:
            return {
                ...state,
                session: payload,
                loading: false,
                activeGame: null,
            };
        case JOINGAME_FAIL:
        case CREATEGAME_FAIL:
            return {
                ...state,
                error: payload,
                userRegistered: false,
                loading: false,
                activeGame: null,
            };

        case REG_GAMESESSIONS_FOUND:
        case REG_GAMESESSIONS_NOTFOUND:
            return {
                ...state,
                foundgames: payload,
                loading: false,
                activeGame: null,
            };

        case GAMESESSIONS_ERROR:
            return {
                ...state,
                error: payload,
                userRegistered: false,
                loading: false,
                activeGame: null,
            };

        case REGPROFTOGAME_SUCCESS:
            return {
                ...state,
                userRegistered: payload,
                loading: false,
                activeGame: null,
            };

        case REGPROFTOGAME_FAIL:
            return {
                ...state,
                error: payload,
                userRegistered: false,
                loading: false,
                activeGame: null,
            };

        case REMOVE_GAMESESSIONS:
            return {
                ...state,
                session: null,
                foundGames: [],
                userRegistered: false,
                activeGame: null,
                loading: false,
            };

        case SETLOCALSESSION_SUCCESS:
            return {
                ...state,
                activeGame: payload,
                loading: false,
            };

        case SETLOCALSESSION_FAIL:
            return {
                ...state,
                userRegistered: false,
                activeGame: null,
                loading: false,
            };

        default:
            return state;
    }
};

export default game;
