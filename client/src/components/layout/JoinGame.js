import React, { forwardRef, useImperativeHandle, useState } from "react";
import Table from "react-bootstrap/Table";
// import PropTypes from "prop-types";

const JoinGame = forwardRef(({ foundgames, setSessionToJoinIndex }, ref) => {
  /******************** HOOKS ***************************************/
  const [joinGameDisplay, setJoinGameDisplay] = useState(false);
  const [selectedSession, setSelectedSession] = useState(0);
  // const [joinButtonStatus, setJoinButtonStatus] = useState(false);
  useImperativeHandle(ref, () => {
    return {
      openWindow: () => open(),
    };
  });
  /**************************EVENT HANDLERS *******************************/
  const open = (e) => {
    setJoinGameDisplay(true);
  };

  const close = (e) => {
    setJoinGameDisplay(false);
  };

  const getTimeInET = (timeInDataBase) => {
    var hms = timeInDataBase.split("T")[1].split(".")[0];
    var h = parseInt(hms.split(":")[0]) - 4;
    if (h < 0) h = h + 24;
    var suf = "";
    var hString = "";
    if (h >= 12) {
      suf = " p.m.";
      h = h - 12;
    } else suf = " a.m.";
    if (h < 10) hString = "0" + h.toString();
    else hString = h.toString();
    var fin = hString + ":" + hms.split(":")[1] + suf;
    return fin;
  };

  const onSelectSessionRow = (e, ind) => setSelectedSession(ind);

  const loadSessionTd = foundgames.map((game, ind) => (
    <tr
      key={game._id}
      className={
        ind === selectedSession
          ? "session-table-active"
          : "session-table-inactive"
      }
      onClick={(e) => onSelectSessionRow(e, ind)}
    >
      <td>{ind + 1}</td>
      <td>{game.createdBy.gamename}</td>
      <td>{getTimeInET(game.createdAt)}</td>
      <td>{game.playerLimit}</td>
      <td>{game.players.length}</td>
    </tr>
  ));

  const setSession = (e, ind) => {
    setSessionToJoinIndex(ind);
    close();
  };

  if (joinGameDisplay)
    return (
      <div className="modal-wrapper">
        <div className="modal-backdrop" />
        <div className="joingame-box">
          <div className="title-div">
            {" "}
            <h1>GAME SESSIONS</h1>{" "}
            <span className="close">
              <i className="fas fa-times" onClick={(e) => close(e)}></i>
            </span>
          </div>
          <div className="creategame-box-content">
            <div className="gameslist">
              <Table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CREATED BY:</th>
                    <th>TIME CREATED</th>
                    <th>
                      PLAYER <br /> LIMIT
                    </th>
                    <th>
                      PLAYERS <br /> JOINED
                    </th>
                  </tr>
                </thead>
                <tbody>{loadSessionTd}</tbody>
              </Table>
            </div>
            <div className="buttons-div">
              <button
                className={
                  foundgames.length > 0
                    ? "btn btn-primary my-sides"
                    : "btn btn-primary my-sides btn-disabled"
                }
                disabled={foundgames.length === 0}
                onClick={(e) => setSession(e, selectedSession)}
              >
                <i className="fas fa-plus"></i>{" "}
                <span className="hide-sm">Join</span>
              </button>
              <button
                className="btn btn-light my-sides"
                onClick={(e) => close(e)}
              >
                <i className="fas fa-times"></i>{" "}
                <span className="hide-sm">Close</span>
              </button>
            </div>{" "}
          </div>
        </div>
      </div>
    );
  return null;
});

export default JoinGame;
