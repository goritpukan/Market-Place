import React from "react";

export default function ErrorWindow(props) {
  if (props.errorMessage) {
    return (
      <div id="ErrorWindow">
        <h1 id="ErrorText">{props.errorMessage}</h1>
        <button id="ErrorButton" onClick={() => props.closeWindow()}>Close</button>
      </div>
    );
  }
}