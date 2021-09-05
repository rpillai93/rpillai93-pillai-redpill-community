import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import FileUpload from "./FileUpload";
import GameCards from "./GameCards";
import CreateDeck from "./CreateDeck";
import GameDecks from "./GameDecks";
import Alert from "../layout/Alert";

const Upload = ({ auth: { isAdmin, isAuthenticated } }) => {
  if (!isAdmin) {
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      {" "}
      <Alert />
      <Tabs
        className="container-navtabs"
        defaultIndex={0}
        selectedTabClassName="nav-item active"
        selectedTabPanelClassName="tab-content active"
      >
        <TabList className="nav nav-tabs nav-fill">
          <Tab className="nav-item">
            <a className="nav-link" href="#!">
              Cards
            </a>
          </Tab>
          <Tab className="nav-item">
            <a className="nav-link" href="#!">
              Decks
            </a>
          </Tab>
        </TabList>

        <div className="tab-content">
          {" "}
          <TabPanel className="tab-pane">
            <div>
              <FileUpload />
            </div>
            <div>
              {" "}
              <GameCards />
            </div>
          </TabPanel>
          <TabPanel className="tab-pane">
            <div>
              <CreateDeck />
            </div>
            <div>
              <GameDecks />
            </div>
          </TabPanel>
        </div>
      </Tabs>
    </Fragment>
  );
};

Upload.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, null)(Upload);
