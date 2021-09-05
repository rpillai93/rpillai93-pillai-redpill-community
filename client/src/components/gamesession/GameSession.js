import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import PausedScreen from "./PausedScreen";
import io from "socket.io-client";
import { storeLocalSession } from "../../actions/game/game";
let socket;
const GameSession = ({
  storeLocalSession,
  profile: { profile },
  game: { userRegistered, session, activeGame },
}) => {
  const ENDPOINT = "/gamesession";

  const [gamePaused, setGamePaused] = useState(false);
  const [playersInGame, setPlayersInGame] = useState(0);
  useEffect(() => {
    if (session && profile) {
      storeLocalSession(session, profile);
      socket = io.connect(ENDPOINT);

      socket.emit("join", { profile, session }, () => {
        // console.log(socket.id);
      });
      socket.on("sessionData", (data) => {
        setPlayersInGame(data.players.length);
        // setSessionData(data);
      });
      return () => {
        socket.emit("disconnect");
        socket.off();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT]);
  useEffect(() => {
    const active = JSON.parse(localStorage.activeGame);

    setGamePaused(playersInGame !== active.pLim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playersInGame]);
  if (!userRegistered) return <Redirect to="/dashboard" />;

  return (
    <Fragment>
      <button className="btn btn-big">CLICK ME </button>
      <PausedScreen paused={gamePaused} />
    </Fragment>
  );
};

GameSession.propTypes = {
  profile: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
  storeLocalSession: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  game: state.game,
});

export default connect(mapStateToProps, {
  storeLocalSession,
})(GameSession);
