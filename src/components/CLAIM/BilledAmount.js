import React, { Component } from "react";
import { Tooltip } from "react-tooltip";

const dateStyle = {
  fontSize: "14px",
  fontFace: "",
  color: "#1B2B41B0",
};

function BilledAmount(props) {
  return (
    <div>
      <span className="my-amount-tooltip">
        {props.data.amount}
        <Tooltip anchorSelect=".my-amount-tooltip" place="bottom">
          Total Amount
        </Tooltip>
      </span>
      <br />
      <span style={dateStyle} className="my-line_amt-tooltip">
        {props.data.line_amt}
        <Tooltip anchorSelect=".my-line_amt-tooltip" place="bottom">
          Min-max line amounts
        </Tooltip>
      </span>
    </div>
  );
}

export default BilledAmount;
