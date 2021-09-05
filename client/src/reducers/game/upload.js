import {
  CARDUPLOAD_SUCCESS,
  CARDUPLOAD_FAIL,
  CARDS_LOADED,
  CARDS_LOADED_FAILED,
  REMOVE_ALLCARDS,
  REMOVECARD_SUCCESS,
  REMOVECARD_FAIL,
} from "../../actions/types";
const initialState = {
  uploadedCard: null,
  cards: null,
  loading: true,
  error: {},
};

const upload = function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case CARDUPLOAD_SUCCESS:
            return { ...state, uploadedCard: payload, error: {}, loading: false };
        case CARDUPLOAD_FAIL:
            return { ...state, error: payload, uploadedCard: null, loading: false };
        case CARDS_LOADED:
            return { ...state, cards: payload, error: {}, loading: false };
        case CARDS_LOADED_FAILED:
            return { ...state, error: payload, loading: false };
        case REMOVE_ALLCARDS:
            return { ...state, uploadedCard: null, cards: null, loading: false };
        case REMOVECARD_SUCCESS:
            return { ...state, loading: false };
        case REMOVECARD_FAIL:
            return { ...state, error: payload, loading: false };
        default:
            return state;
    }
};
export default upload;
