import React from "react";

export default function Pages(props) {

  const MAXPRODUCTS = 10;

  const buttonsCount = Math.ceil(props.productsLength / MAXPRODUCTS);
  let buttonsArr = [];

  for (let i = 0; i < buttonsCount; i++) {
    if (i > 8) {
      buttonsArr[i] = buttonsCount - 1;
      break;
    }
    buttonsArr[i] = i;
  }

  return (
    <div className="page-buttons-container">
      {buttonsArr.map(el => (
        <button key={el} onClick={() => props.setPage(el)}>{el + 1}</button>
      ))}
    </div>
  );

}