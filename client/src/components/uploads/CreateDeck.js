import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { createEmptyDeck } from "../../actions/game/deck";
import { setAlert } from "../../actions/alert";

const CreateDeck = ({ createEmptyDeck, setAlert }) => {
  const [formData, setFormData] = useState({
    deckname: "",
  });
  const { deckname } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.deckname === "") {
      setAlert("Enter a deck name first!", "danger", 3000);
    } else {
      createEmptyDeck(deckname);
    }
  };

  return (
    <Fragment>
      {" "}
      <form className="form deck" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Deck name"
            name="deckname"
            value={deckname}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button className="btn btn-primary btn-fileupload" type="submit">
          <i className="fas fa-folder-plus"></i>{" "}
          <span className="hide-sm">Create Deck</span>
        </button>
      </form>
      <hr />
    </Fragment>
  );
};

CreateDeck.propTypes = {
  setAlert: PropTypes.func.isRequired,
  createEmptyDeck: PropTypes.func.isRequired,
};

export default connect(null, {
  setAlert,
  createEmptyDeck,
})(CreateDeck);
