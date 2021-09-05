import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { uploadCard } from "../../actions/game/upload";
import { setAlert } from "../../actions/alert";

const FileUpload = ({ uploadCard, setAlert }) => {
  const [formData, setFormData] = useState({
    uploaded_file: {},
    blobUrl: "",
    fileName: "",
    fileState: false,
  });
  const { fileName, blobUrl, fileState } = formData;
  const onChange = (e) => {
    var fileWasSent = e.target.files.length > 0 ? true : false;
    setFormData({
      uploaded_file: fileWasSent ? e.target.files[0] : {},
      fileName: fileWasSent ? e.target.files[0].name : "",
      blobUrl: fileWasSent ? URL.createObjectURL(e.target.files[0]) : "",
      fileState: fileWasSent,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fileState) {
      setAlert("You must select a file first!", "danger", 3000);
    } else {
      var fd = new FormData();
        fd.append("uploaded_file", formData.uploaded_file, formData.fileName);
      try {
        uploadCard(fd);
      } catch (err) {
        setAlert("The upload process failed!", "danger", 3000);
      }
    }
  };

  return (
    <Fragment>
      {" "}
      <form className="fileuploadform" onSubmit={(e) => onSubmit(e)}>
        <div className="fileuploadArea">
          {fileState ? (
            <div>
              {" "}
              <img name="blobUrl" src={blobUrl} alt="No file" />
              <p>{fileName}</p>
            </div>
          ) : (
            <p>Click in this area to upload</p>
          )}
        </div>
        <input
          className="fileuploadInput"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => onChange(e)}
        />{" "}
        <button className="btn btn-primary btn-fileupload" type="submit">
          <i className="fas fa-upload"></i>{" "}
          <span className="hide-sm">Upload</span>
        </button>
      </form>
      <hr />
    </Fragment>
  );
};

FileUpload.propTypes = {
  uploadCard: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, {
  setAlert,
  uploadCard,
})(FileUpload);
