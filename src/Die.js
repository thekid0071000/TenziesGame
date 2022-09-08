import React from "react";

export default function Die(props) {
  // Die component. This takes the values sent through props and chooses the correct style and value.
  return (
    <div
      className={props.isHeld === true ? "DieHeld" : "Die"}
      onClick={props.onHoldDice}
    >
      <h2 className="dieValue">{props.value}</h2>
    </div>
  );
}
