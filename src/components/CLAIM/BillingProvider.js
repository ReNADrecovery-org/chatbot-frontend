import React, { Component } from "react";
import { Tooltip } from "react-tooltip";
import { Button } from "react-bootstrap";

function BillingProvider(props) {
  return (
    <div>
      <span
        role="button"
        className="fs-1 my-billing-tooltip badge text-light bg-primary"
        onClick={() => {
          props.setData(props.data);
          props.openDialog(true);
        }}
      >
        {props.data.NPI}
        <Tooltip anchorSelect=".my-billing-tooltip" place="bottom">
          NPI:{props.data.NPI}
          <br />
          {props.data.bus_name}
        </Tooltip>
      </span>
      <span>{props.data.bus_name}</span>
      <br />
      <span>{props.data.detail}</span>
      <br />
      <span>{props.data.addr}</span>
    </div>
  );
}

export default BillingProvider;
