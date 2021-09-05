import {
  CREATEDECK_SUCCESS,
  CREATEDECK_FAIL,
  DECKS_LOADED,
  DECKS_LOADED_FAILED,
  REMOVE_ALLDECKS,
  ADDCARDTODECK_SUCCESS,
  ADDCARDTODECK_FAIL,
} from "../../actions/types";
const initialState = {
  decks: null,
  createdDeck: null,
  loading: true,
  error: {},
};

const deck = function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case CREATEDECK_SUCCESS:
            return { ...state, createdDeck: payload, loading: false };

        case CREATEDECK_FAIL:
            return { ...state, error: payload, loading: false };

        case DECKS_LOADED:
            return { ...state, decks: payload, loading: false };

        case DECKS_LOADED_FAILED:
            return { ...state, error: payload, loading: false };

        case REMOVE_ALLDECKS:
            return { ...state, decks: null, createdDeck: null, loading: false };

        case ADDCARDTODECK_SUCCESS:
            return { ...state, loading: false };

        case ADDCARDTODECK_FAIL:
            return { ...state, error: payload, loading: false };

        default:
            return state;
    }
};

export default deck;
