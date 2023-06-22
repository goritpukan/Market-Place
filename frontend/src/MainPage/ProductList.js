import React from "react"
import { useNavigate } from "react-router-dom";

import Pages from "./Pages";

export default function ProductList(props){

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
              <h1>{Product.name}</h1>
              <h1>{Product.cost} {Product.currency}</h1>
              <h1>{Product.city}</h1>
              <h1>{Product.category}</h1>
              <div className="owner-info">
                <h1>{JSON.parse(Product.owner).email}</h1>
                <h1>{JSON.parse(Product.owner).nickname}</h1>
                <img alt="" src={AVATARURL + JSON.parse(Product.owner).avatar}></img>
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