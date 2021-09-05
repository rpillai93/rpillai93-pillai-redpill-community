import React, { Fragment, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import CardsCarousel from "../layout/CardsCarousel";
import { connect } from "react-redux";
import { getAllDecks } from "../../actions/game/deck";
import hiddencard from "../../img/uu-unflipped.jpg";

const GameDecks = ({ getAllDecks, deck: { decks, loading } }) => {
  /**********************HOOKS  ******************************/

  var deckRef = useRef([]);
  useEffect(() => {
    getAllDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**********************CLICK EVENTS ******************************/
  const viewDeck = (e, i) => {
    e.preventDefault();
    // console.log(i);
    deckRef.current[i].openModal();
  };
  const listDecks = () => {
    if (decks !== null) {
      var deckItems = [];
      decks.forEach((deckItem, i) => {
        deckItems.push(
          <Fragment key={deckItem._id}>
            {" "}
            <div className="card-container">
              <img
                className="card-reg"
                src={hiddencard}
                alt="No file"
                onClick={(e) => viewDeck(e, i)}
              />{" "}
              <CardsCarousel
                deckId={deckItem._id}
                cardsources={deckItem.sources}
                ref={(el) => (deckRef.current[i] = el)}
              />
              <div className="deck-name">
                {" "}
                <h3>{deckItem.name}</h3>
              </div>
            </div>
          </Fragment>
        );
      });
      return deckItems;
    }
  };

  return loading && decks === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="cardgallery">{listDecks()}</div>
    </Fragment>
  );
};

GameDecks.propTypes = {
  deck: PropTypes.object.isRequired,
  getAllDecks: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  deck: state.deck,
});
export default connect(mapStateToProps, { getAllDecks })(GameDecks);
