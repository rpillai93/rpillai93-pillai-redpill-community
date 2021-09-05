import React, { forwardRef, useImperativeHandle, useState } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { deleteCard } from "../../actions/game/upload";
const DeleteConfirm = forwardRef(({ deleteFlag }, ref) => {
  /***************************** HOOKS *******************************/
  const [display, setDisplay] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      openConfirm: () => open(),
    };
  });

  /**************** EVENT CLICKS **********************************/
  const confirmDelete = (e) => {
    deleteFlag(true);
    close();
  };
  const cancelDelete = (e) => {
    deleteFlag(false);
    close();
  };

  const open = () => {
    setDisplay(true);
  };
  const close = () => {
    setDisplay(false);
  };
  if (display)
    return (
      <div className="modal-wrapper">
        <div className="modal-backdrop" />
        <div className="confirm-box">
          <div className="confirm-box-child">
            <h2> Are you sure you want to delete card ?</h2>

            <div className="buttons-div" style={{ position: "relative" }}>
              <button
                className="btn btn-primary"
                onClick={(e) => confirmDelete(e)}
              >
                Confirm
              </button>
              {"        "}
              <button
                className="btn btn-light"
                onClick={(e) => cancelDelete(e)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  return null;
});

export default DeleteConfirm;
