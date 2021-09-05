import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import devimg from "./dev2.jpg";
import PropTypes from "prop-types";

const Developers = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <Fragment>
            <div className="uudevelopers">
                <img src={devimg} alt="No file" />
            </div>
            <div>
                <br></br>
                <p className="lead">
                    Red Pill is a project of Rahul Pillai, a web developer based out
                    of Vancouver, BC. Rahul has been working on the idea to create a community site
                    for friends and family to get access to family games online since the Covid-19 pandemic.
        </p>
                <br></br>
                <p className="lead">
                    Rahul works as a Full Stack Web Developer for Altair Engineering, a
                    company headquartered in Michigan, USA. He is passionate about video games, software development, game development and VR/AR.
        </p>
                <br></br>
                <p className="usual">
                    (Latest update: August 5th, 2021. The site is still under construction.)
              </p>
            </div>
        </Fragment>
    );
};

Developers.propTypes = {
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Developers);
