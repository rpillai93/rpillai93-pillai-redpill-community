import React from "react";
import Spinner from "../layout/Spinner";
const PausedScreen = ({ paused }) => {
  if (paused) {
    return (
      <div className="modal-wrapper">
        <div className="modal-backdrop" />
        <div className="gamepaused-container">
          <p> One or more players are not in the game.</p>
          <p> Please wait for players to connect..... </p>
          <p> (Do not refresh the browser)</p>
          <br />
          <Spinner />
        </div>
      </div>
    );
  }

  return null;
};

export default PausedScreen;
