import React, { Component } from "react";
import { Tooltip } from "react-tooltip";
import { Button } from "react-bootstrap";

function Service(props) {
  return (
    <div>
      {props.data != undefined &&
        props.data.map((e, index) => (
          <div key={index}>
            <span
              role="button"
              className="fs-1 my-title-tooltip badge text-light bg-primary"
              onClick={() => {
                props.setData(e);
                props.openDialog(true);
              }}
            >
              {e.code}
            </span>
          </div>
        ))}
    </div>
  );
}

export default Service;
