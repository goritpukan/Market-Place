import React from "react";

export function ConfirmWindow(props){
  if(props.confirmMessage){
    return(
      <div id="ConfirmWindow">
        <h1 id="ConfirmText">{props.confirmMessage}</h1>
        <button id="ConfirmButton" onClick={() => props.nextPage()}>Continue</button>
      </div>
    );
  }
}