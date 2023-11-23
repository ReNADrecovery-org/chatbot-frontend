import React, { Component } from "react";
import { Tooltip } from "react-tooltip";
import { Button } from "react-bootstrap";

function Patient(props) {
  return (
    <div>
      <span
        role="button"
        className="fs-1 my-patient-tooltip badge text-light bg-primary"
        onClick={() => {
          props.setData(props.data);
          props.openDialog(true);
        }}
      >
        {props.data.memberid}
        <Tooltip anchorSelect=".my-patient-tooltip" place="bottom">
          Member ID:{props.data.memberid}
          <br />
          {props.data.name}
        </Tooltip>
      </span>
      <span>{props.data.name}</span>
      <br />
      <span>{props.data.birth}</span>&nbsp;&nbsp;&nbsp;
      <span>{props.data.gender}</span>
      <br />
      <span>{props.data.addr}</span>
    </div>
  );
}

export default Patient;
