import React from "react"
import { useNavigate } from "react-router-dom";

import Pages from "./Pages";

export default function ProductList(props) {

  const navigate = useNavigate();

  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";
  const AVATARURL = "http://localhost:4001/api/images/avatar/";


  if (props.isLoaded && props.products) {
    return (
      <>
        <ul className="products">
          {props.products.map(Product => (
            <li key={Product["_id"]} onClick={() => navigate("/product/" + Product["_id"])}>
              <img className="product-photo" alt="" src={PHTOTURL + JSON.parse(Product.photos)[0]} />
              <div>
                <h1>{Product.name}</h1>
                <h2>{Product.cost} {Product.currency}</h2>
                <h3>{Product.city}</h3>
                <h3>{Product.category}</h3>
              </div>
              <div className="owner-info">
                <img alt="" src={AVATARURL + JSON.parse(Product.owner).avatar}></img>
                <h3>{JSON.parse(Product.owner).email}</h3>
                <h3>{JSON.parse(Product.owner).nickname}</h3>
              </div>
            </li>
          ))}
          <Pages
            setPage={props.setPage}
            productsLength={props.productsLength} />
        </ul>
      </>
    )
  }
}

//Make profile info updatable