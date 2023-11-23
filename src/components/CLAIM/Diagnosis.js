import React, { Component } from "react";
import { Tooltip } from "react-tooltip";

function Diagnosis(props) {
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
              <Tooltip anchorSelect=".my-title-tooltip" place="bottom">
                {e.desc}
              </Tooltip>
            </span>
            <span>{e.desc}</span>
          </div>
        ))}
    </div>
  );
}

export default Diagnosis;
