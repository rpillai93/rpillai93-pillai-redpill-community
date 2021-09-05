import React, { Fragment, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import DeleteConfirm from "../layout/DeleteConfirm";
import { connect } from "react-redux";
import { getAllCards, deleteCard } from "../../actions/game/upload";
import { getAllDecks, addCardToDeck } from "../../actions/game/deck";
const GameCards = ({
  getAllCards,
  getAllDecks,
  addCardToDeck,
  deleteCard,
  upload: { cards, loading },
  deck: { decks },
}) => {
  useEffect(() => {
    getAllCards();
    getAllDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /********************* UPDATE HOOKS **********************/
  const [imageId, setImageId] = useState(-1);
  const [hideDropDown, setHideDropDown] = useState(-1);
  const [deleteCardObj, setDeleteCardObj] = useState({});
  const delref = useRef();
  const ref = useRef();
  useEffect(() => {
    ref.current = imageId;
  }, [imageId]);
  const ref2 = useRef();
  useEffect(() => {
    ref2.current = hideDropDown;
  }, [hideDropDown]);

  /******************** EVENT CLICKS *************************/
  const onDeleteCard = (e, itemId, stID) => {
    e.preventDefault();
    setDeleteCardObj({ itemId, stID });
    delref.current.openConfirm();
  };
  const onDeleteConfirm = (confirm) => {
    if (confirm) deleteCard(deleteCardObj.itemId, deleteCardObj.stID);
  };
  const onClickCard = (e, i) => {
    e.preventDefault();

    setImageId(ref.current === i ? -1 : i);
  };

  const onAddToDeckMenu = (e, i) => {
    setHideDropDown(ref2.current === i ? -1 : i);
  };
  const onAddToDeck = (e, cardId, cardsrc, deckId, deckname) => {
    addCardToDeck(cardId, cardsrc, deckId, deckname);
    setHideDropDown(-1);
  };
  const loadCardsByCategory = (catcards) => {
    var allCards = [];

    if (catcards)
      catcards.forEach((item, i) => {
        allCards.push(
          <div key={item._id} className="card-container">
            <img
              onClick={(e) => onClickCard(e, item._id)}
              className={item._id === imageId ? "card-big" : "card-reg"}
              src={item.src}
              alt="No file"
            />{" "}
            <div className="card-icons-container">
              {" "}
              <i
                onClick={(e) => onAddToDeckMenu(e, item._id)}
                className="fab fa-creative-commons-share"
              ></i>{" "}
              <div
                className={
                  item._id === hideDropDown
                    ? "dropdown-menu"
                    : "dropdown-menu hidden"
                }
              >
                {decks === null ? (
                  <p> No deck</p>
                ) : (
                  decks.map((itemdeck) => (
                    <div className="dropdown-item" key={itemdeck._id}>
                      {" "}
                      <a
                        onClick={(e) =>
                          onAddToDeck(
                            e,
                            item._id,
                            item.src,
                            itemdeck._id,
                            itemdeck.name
                          )
                        }
                        href="#!"
                      >
                        <p>{itemdeck.name}</p>{" "}
                      </a>
                    </div>
                  ))
                )}
              </div>
           {/*   <i className="fas fa-edit"></i>{" "}*/}
              {/*<i*/}
              {/*  onClick={(e) => onDeleteCard(e, item._id, item.stID)}*/}
              {/*  className="fas fa-trash-alt"*/}
              {/*></i>*/}
            </div>
          </div>
        );
      });
    return allCards;
  };

  const loadCards = (cards) => {
    if (!cards || cards.length === 0) return <p>No cards to show</p>;
    var baby = cards[0].cards;
    var basic = cards[1].cards;
    var magical = cards[2].cards;
    var ultimate = cards[3].cards;
    var downgrade = cards[4].cards;
    var upgrade = cards[5].cards;
    var instant = cards[6].cards;
    var magic = cards[7].cards;

    return (
      <Fragment>
        <div className="cardgallery-holder">
          <h1>BABY UNICORNS</h1>
          <div className="cardgallery">{loadCardsByCategory(baby)}</div>
          <h1>BASIC UNICORNS</h1>
          <div className="cardgallery">{loadCardsByCategory(basic)}</div>
          <h1>MAGICAL UNICORNS</h1>
          <div className="cardgallery">{loadCardsByCategory(magical)}</div>
          <h1>ULTIMATE UNICORNS</h1>
          <div className="cardgallery">{loadCardsByCategory(ultimate)}</div>
          <h1>DOWNGRADE CARDS</h1>
          <div className="cardgallery">{loadCardsByCategory(downgrade)}</div>
          <h1>UPGRADE CARDS</h1>
          <div className="cardgallery">{loadCardsByCategory(upgrade)}</div>
          <h1>INSTANT CARDS</h1>
          <div className="cardgallery">{loadCardsByCategory(instant)}</div>
          <h1>MAGIC CARDS</h1>
          <div className="cardgallery">{loadCardsByCategory(magic)}</div>
        </div>
      </Fragment>
    );
  };
  /********************** RETURN COMPONENT **********************************/
  return loading && cards === null ? (
    <Spinner />
  ) : (
    <Fragment>
      {loadCards(cards)}{" "}
      <DeleteConfirm
        ref={delref}
        deleteFlag={(confirm) => onDeleteConfirm(confirm)}
      />
    </Fragment>
  );
};

GameCards.propTypes = {
  upload: PropTypes.object.isRequired,
  deck: PropTypes.object.isRequired,
  getAllCards: PropTypes.func.isRequired,
  getAllDecks: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired,
  addCardToDeck: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  upload: state.upload,
  deck: state.deck,
});
export default connect(mapStateToProps, {
  getAllCards,
  getAllDecks,
  deleteCard,
  addCardToDeck,
})(GameCards);
