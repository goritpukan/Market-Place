import React from "react";

export default function BuyForm(props) {
  if (props.isActive) {
    return ( 
      <div className="buy-form">
        <button onClick={() => props.exit()}>EXIT</button>
        <input type="text" placeholder="phone number"></input>
        <input type="text" placeholder="adress"></input>
      </div>
    )
  }
}