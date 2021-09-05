import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import upload from "./game/upload";
import deck from "./game/deck";
import game from "./game/game";

export default combineReducers({
  alert,
  auth,
  profile,
  upload,
  deck,
  game,
});
