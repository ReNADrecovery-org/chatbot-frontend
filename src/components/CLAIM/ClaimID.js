import React, { Component } from "react";
import { Tooltip } from "react-tooltip";

const dateStyle = {
  fontSize: "14px",
  fontFace: "",
  color: "#1B2B41B0",
};

function ClaimID(props) {
  return (
    <div>
      <span className="my-cid-tooltip">
        {props.data.cid}
        <Tooltip anchorSelect=".my-cid-tooltip" place="bottom">
          Patient Control Number
        </Tooltip>
      </span>
      <br />
      <span style={dateStyle} className="my-date-tooltip">
        {props.data.date}
        <Tooltip anchorSelect=".my-date-tooltip" place="bottom">
          Submit date(transaction creation date)
        </Tooltip>
      </span>
    </div>
  );
}

export default ClaimID;
