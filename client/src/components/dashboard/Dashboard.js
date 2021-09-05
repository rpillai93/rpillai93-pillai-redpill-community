import React, { Fragment, useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";
import CreateGame from "../layout/CreateGame";
import JoinGame from "../layout/JoinGame";
import Alert from "../layout/Alert";

import { setGameName, getCurrentProfile } from "../../actions/profile";
import { getAllDecks } from "../../actions/game/deck";
import {
  findGameSessions,
  createSession,
  joinSession,
  registerProfileToSession,
} from "../../actions/game/game";
/****************************************************************************
 ******************************* FUNCTION HEADER *****************************
 ****************************************************************************/
const Dashboard = ({
  setGameName,
  getCurrentProfile,
  getAllDecks,
  findGameSessions,
  createSession,
  joinSession,
  registerProfileToSession,

  profile: { profile, loading },
  deck: { decks },
  game: { session, foundgames, userRegistered },
}) => {
  /****************************************************************************
   ******************************* HOOKS ***************************************
   ****************************************************************************/
  useEffect(() => {
    getCurrentProfile();
    getAllDecks();
    findGameSessions();
    if (localStorage.getItem("activeGame"))
      localStorage.removeItem("activeGame");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createGameRef = useRef();
  const joinGameRef = useRef();
  const [formData, setFormData] = useState({
    gamename: "",
  });

  /****************************************************************************
   ******************************* EVENT HANDLERS ****************************
   ****************************************************************************/
  const { gamename } = formData;

  const onGamenameChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setGameName(gamename);
  };

  const openCreateGame = (e) => {
    e.preventDefault();
    createGameRef.current.openWindow();
  };
  const openJoinGame = (e) => {
    e.preventDefault();
    joinGameRef.current.openWindow();
  };
  /****************************************************************************
   ******************************* RETURN COMPONENT ****************************
   ****************************************************************************/

  /******************************* GAME SESSION REDIRECT ****************************/

  if (userRegistered && session) {
    return <Redirect to="/gamesession" />;
  }
  /******************************* DASHBOARD PAGE RETURN ****************************/
  if (loading && profile === null) return <Spinner />;

  return (
    <Fragment>
      <Alert />
      <p className="large">
        <i className="fas fa-gamepad" /> Welcome {profile && profile.gamename}!
      </p>
      {!loading && profile === null ? (
        <div className="dashboard-playername-incomplete">
          <h1>
            {" "}
            Please enter a player name to continue. Your player name will be
            visible during all games you play with other players.
          </h1>
          <br />
          <h2>
            (Player names should not exceed 10 characters and may not contain
            spaces)
          </h2>
          <form className="form" onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Player name"
                name="gamename"
                value={gamename}
                onChange={(e) => onGamenameChange(e)}
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Continue" />
          </form>
        </div>
      ) : (
        <div>
          <p className="lead">
            Red Pill is a private website with access exclusive to close friends
            and family.
          </p>

          <p className="lead">
            Click to get started on Unstable Unicorns (due to Copyright, for
            private use only):
          </p>
          <section className="uulanding">
            <div className="dark-overlay">
              <div className="landing-inner">
                <p className="lead"></p>
                <div className="buttons">
                  <button
                    className="btn-big btn-primary"
                    onClick={(e) => openCreateGame(e)}
                  >
                    <i className="fas fa-plus"></i>{" "}
                    <span className="hide-sm">Create game</span>
                  </button>
                  <button
                    className="btn-big btn-primary"
                    onClick={(e) => openJoinGame(e)}
                  >
                    <i className="fas fa-sign-in-alt"></i>{" "}
                    <span className="hide-sm">Join game</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <CreateGame
            ref={createGameRef}
            decks={decks || []}
            setGame={({ playerLimit, deckId }) =>
              createSession(playerLimit, deckId)
            }
          />
          <JoinGame
            ref={joinGameRef}
            foundgames={foundgames}
            setSessionToJoinIndex={(ind) =>
              joinSession(ind, foundgames, profile)
            }
          />
        </div>
      )}
    </Fragment>
  );
};

/****************************************************************************
 ******************************* FOOTER **************************************
 ****************************************************************************/
Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  deck: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,

  setGameName: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getAllDecks: PropTypes.func.isRequired,
  findGameSessions: PropTypes.func.isRequired,
  createSession: PropTypes.func.isRequired,
  joinSession: PropTypes.func.isRequired,
  registerProfileToSession: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  deck: state.deck,
  game: state.game,
});
export default connect(mapStateToProps, {
  setGameName,
  getCurrentProfile,
  getAllDecks,
  findGameSessions,
  createSession,
  joinSession,
  registerProfileToSession,
})(Dashboard);
