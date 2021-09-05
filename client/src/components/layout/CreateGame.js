import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  Fragment,
} from "react";
import PropTypes from "prop-types";
import hiddencard from "../../img/uu-unflipped.jpg";
import CardsCarousel from "../layout/CardsCarousel";
const CreateGame = forwardRef(({ decks, setGame }, ref) => {
  /******************** HOOKS ***************************************/
  const [createGameDisplay, setCreateGameDisplay] = useState(false);
  const [playernos, setPlayerNos] = useState(2);
  const [createEnabled, setCreateEnabled] = useState(true);
  const [carouseArrows, setCarouseArrows] = useState({
    prev: false,
    next: true,
  });
  const [deckIndex, setDeckIndex] = useState(0);
  useEffect(() => {
    setCarouseArrows(
      deckIndex === 0
        ? { prev: false, next: true }
        : deckIndex === decks.length - 1
        ? { prev: true, next: false }
        : { prev: true, next: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckIndex]);
  const deckRef = useRef([]);
  useImperativeHandle(ref, () => {
    return {
      openWindow: () => open(),
    };
  });
  /**************************EVENT HANDLERS *******************************/
  const open = (e) => {
    setCreateGameDisplay(true);
  };

  const close = (e) => {
    setCreateGameDisplay(false);
  };

  const viewDeck = (e, i) => {
    e.preventDefault();
    // console.log(i);
    deckRef.current[i].openModal();
  };

  const showDeck = () => {
    var deckItem = decks[deckIndex];
    return (
      <Fragment key={deckItem._id}>
        {" "}
        <div className="deck-container">
          <img
            className="card-reg"
            src={hiddencard}
            alt="No file"
            onClick={(e) => viewDeck(e, deckIndex)}
          />{" "}
          <CardsCarousel
            deckId={deckItem._id}
            cardsources={deckItem.sources}
            ref={(el) => (deckRef.current[deckIndex] = el)}
          />
          <div className="deck-name light-grey">
            {" "}
            <h3>{deckItem.name}</h3>
          </div>
        </div>
      </Fragment>
    );
  };

  const onChangePlayerNos = (e) => {
    e.preventDefault();
    var val = Math.trunc(parseInt(e.target.value));
    setPlayerNos(val);
    if (val >= 2 && val <= 8) setCreateEnabled(true);
    else setCreateEnabled(false);
    // if (val >= 2 && val <= 8)
  };

  const onClickPrevArrow = (e) => {
    if (deckIndex > 0) setDeckIndex((p) => p - 1);
  };

  const onClickNextArrow = (e) => {
    if (deckIndex < decks.length - 1) setDeckIndex((p) => p + 1);
  };

  const setGameSettings = (e) => {
    setGame({ playerLimit: playernos, deckId: decks[deckIndex]._id });
    close();
  };

  if (createGameDisplay)
    return (
      <div className="modal-wrapper">
        <div className="modal-backdrop" />
        <div className="creategame-box">
          <div className="title-div">
            {" "}
            <h1>GAME SETTINGS</h1>{" "}
            <span className="close">
              <i className="fas fa-times" onClick={(e) => close(e)}></i>
            </span>
          </div>
          <div className="creategame-box-content">
            <div className="rollover-decks">
              {" "}
              <i
                className={
                  carouseArrows.prev
                    ? "fas fa-angle-left prevAdjust"
                    : "fas fa-angle-left prevAdjust-disabled"
                }
                onClick={(e) => onClickPrevArrow(e)}
              />{" "}
              {showDeck()}
              <i
                className={
                  carouseArrows.next
                    ? "fas fa-angle-right nextAdjust"
                    : "fas fa-angle-right nextAdjust-disabled"
                }
                onClick={(e) => onClickNextArrow(e)}
              />
            </div>
            <label>Number of players (2 to 8):</label>
            <input
              name="playernos"
              value={playernos}
              className="numberfield"
              type="number"
              min="2"
              max="8"
              onChange={(e) => onChangePlayerNos(e)}
            />
            <div className="buttons-div">
              <button
                className={
                  createEnabled
                    ? "btn btn-primary my-sides"
                    : "btn btn-primary my-sides btn-disabled"
                }
                disabled={!createEnabled}
                onClick={(e) => setGameSettings(e)}
              >
                <i className="fas fa-plus"></i>{" "}
                <span className="hide-sm">Create</span>
              </button>
              <button
                className="btn btn-light my-sides"
                onClick={(e) => close(e)}
              >
                <i className="fas fa-times"></i>{" "}
                <span className="hide-sm">Cancel</span>
              </button>
            </div>{" "}
          </div>
        </div>
      </div>
    );
  return null;
});

CreateGame.propTypes = {
  decks: PropTypes.array.isRequired,
};

export default CreateGame;
