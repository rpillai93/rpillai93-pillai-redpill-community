import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GENERATETOKEN_SUCCESS,
  GENERATETOKEN_FAIL,
} from "../actions/types";
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  isAdmin: false,
  accesstoken: null,
};

const auth = function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
                isAdmin: payload.isAdmin,
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("token", payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                isAdmin: payload.isAdmin,
            };
        case GENERATETOKEN_SUCCESS:
            return {
                ...state,
                accesstoken: payload.tokenval,
            };
        case GENERATETOKEN_FAIL:
            return {
                ...state,
                accesstoken: null,
            };
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                isAdmin: false,
                accesstoken: null,
            };
        default:
            return state;
    }
};

export default auth;
