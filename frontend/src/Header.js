import React from "react";

function Header(props){
  return(
    <header>
      <button id="MainButton" className="HeaderButtons">Main</button>
      <button className="HeaderButtons" 
      id="Create Shop" 
      onClick={() => props.setPage(props.FirstButtonPage)}>{props.FirstButtonText}</button>
      <button className="HeaderButtons" id="logOut" onClick={() => props.logOut()}>Log out</button>
    </header>
  );
}

export default Header