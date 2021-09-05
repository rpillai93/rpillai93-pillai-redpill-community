import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GAMENAME_SET,
} from "../actions/types";
const initialState = {
  profile: null,
  loading: true,
  error: {},
};

const profile = function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
      return { ...state, profile: payload, loading: false };

    case PROFILE_ERROR:
      return { ...state, error: payload, loading: false };

    case CLEAR_PROFILE:
      return { ...state, profile: null, loading: false };
    case GAMENAME_SET:
      return { ...state, profile: payload, loading: false };
    default:
      return state;
  }
};

export default profile;
