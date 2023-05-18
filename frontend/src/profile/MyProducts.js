import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyProducts(props) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoadede] = useState(false);
  const [products, setProducts] = useState(null);

  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";
  useEffect(() => {
    fetch("http://localhost:4001/api/products/GetProductbyOwnerID" + props.id, {
      method: "GET"
    })
      .then(res => res.json())
      .then(result => {
        if (!result.isError) {
          setProducts(result.message);
          setIsLoadede(true);
        } else {
          console.log(result.message);
        }
      });
      // eslint-disable-next-line
  }, []);

  if (isLoaded) {
    return (
      <ul id="MyProducts">
        {products.map((Product) => (
          <li id="MyProduct" key={Product["_id"]} onClick={() => navigate("/product/" + Product["_id"])}>
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
