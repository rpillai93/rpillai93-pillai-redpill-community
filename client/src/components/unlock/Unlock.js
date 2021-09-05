import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { generateToken } from "../../actions/auth";
const Unlock = ({ generateToken, auth: { accesstoken } }) => {
  return (
    <Fragment>
      <section className="unlock-div">
        <div className="accesstoken-box">
          {accesstoken ? <p>{accesstoken}</p> : <p>Click to generate.</p>}
        </div>

        <button
          className="btn btn-big"
          type="submit"
          onClick={(e) => generateToken()}
        >
          <i className="fas fa-unlock-alt"></i>{" "}
          <span className="hide-sm">Generate Token</span>
        </button>
      </section>
    </Fragment>
  );
};

Unlock.propTypes = {
  auth: PropTypes.object.isRequired,
  generateToken: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { generateToken })(Unlock);
