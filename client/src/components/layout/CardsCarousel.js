import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";

const CardsCarousel = forwardRef(({ deckId, cardsources }, ref) => {
  /******************** HOOKS ******************************************/
  const [display, setDisplay] = useState(false);
  const [imageId, setImageId] = useState(-1);
  const { matches } = window.matchMedia("(max-width: 700px)");
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
  });
  const refCard = useRef();
  useEffect(() => {
    refCard.current = imageId;
  }, [imageId]);

  const handleKeyDown = async (e) => {
    if (e.keyCode === 27) close(e);
  };
  useImperativeHandle(ref, () => {
    return {
      openModal: () => open(),
    };
  });
  /******************** COMPONENT FUNCTIONS *****************************/
  const open = () => {
    setDisplay(true);
  };
  const close = (e) => {
    e.preventDefault();
    setDisplay(false);
  };
  const onClickCard = (e, i) => {
    e.preventDefault();

    setImageId(refCard.current === i ? -1 : i);
  };
  const getCarouselDeck =
    cardsources === null ? (
      <p>no cards to show</p>
    ) : (
      cardsources.map(({ cardId, src }, ind) => (
        <div className="carousel-card-container" key={cardId}>
          <p>{ind + 1}</p>
          {!matches ? (
            <img className="carousel-card-deviceLg" src={src} alt="No file" />
          ) : (
            <img
              onClick={(e) => onClickCard(e, cardId)}
              className={
                cardId === imageId
                  ? "carousel-card-deviceSm-big"
                  : "carousel-card-deviceSm"
              }
              src={src}
              alt="No file"
            />
          )}
        </div>
      ))
    );
  if (display) {
    return (
      <div className="modal-wrapper">
        <div onClick={close} className="modal-backdrop" />
        <div className="carousel-box">
          {" "}
          <div className="card-carousel">
            {getCarouselDeck}
            <div className="pseudo">.</div>
          </div>
        </div>
      </div>
    );
  }
  return null;
});

export default CardsCarousel;
