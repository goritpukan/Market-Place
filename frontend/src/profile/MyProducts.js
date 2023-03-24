import React from "react";
import { useState, useEffect } from "react";

export default function MyProducts(props) {
  const [IsLoaded, setLoad] = useState(false);
  const [Products, setProducts] = useState();

  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";
  useEffect(() => {
    fetch("http://localhost:4001/api/products/GetProductbyID" + props.id, {
      method: "GET"
    })
      .then(res => res.json())
      .then(result => {
        if (!result.isError) {
          setProducts(result.message);
          setLoad(true);
        } else {
          console.log(result.message)
        }
      });
      // eslint-disable-next-line
  }, []);

  if (IsLoaded) {
    return (
      <ul id="MyProducts">
        {Products.map((Product) => (
          <li id="MyProduct" key={Product["_id"]} onClick={() => props.setPage("ProductPage", Product)}>
            <h1>{Product.name}</h1>
            <h2 id="ProductProfilePrice">{Product.cost} {Product.currency}</h2>
            <img id="MyProductPhoto" alt="" src={PHTOTURL + JSON.parse(Product.photos)[0]}/>
          </li>
        ))}
      </ul >
    );
  } else {
    <div id="MyProducts">

    </div>
  }
}
