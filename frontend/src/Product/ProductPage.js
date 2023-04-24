import React from "react";
import "./Product.css";
import { FastAverageColor } from 'fast-average-color';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductPage(props) {
  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";

  const navigate = useNavigate();

  const { id } = useParams();
  const [photoArrayLength, setPhotoArrayLength] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [scrollColor, setScrollColor] = useState();

  const checkColor = async () => {
    if (isLoaded) {
      let fac = new FastAverageColor();
      const color = await fac.getColorAsync(PHTOTURL + JSON.parse(product.photos)[photoIndex]);
      if (color.isDark) {
        setScrollColor("white");
      } else {
        setScrollColor("black");
      }
    }
  }

  const getData = async () => {
    const res = await fetch("http://localhost:4001/api/products/GetProductbyID/" + id);
    const reuslt = await res.json();
    setProduct(reuslt.message);
    setIsLoaded(true);
  }

  const deleteProdoct = () => {
    fetch("http://localhost:4001/api/products/DeleteProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerID: product.ownerID,
        productID: product["_id"]
      })
    }).then(res => res.json())
      .then(result => {
        if (!result.isError) {
          navigate("/");
        }
      });
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setPhotoArrayLength(JSON.parse(product.photos).length - 1);
    }
    // eslint-disable-next-line
  }, [isLoaded])

  useEffect(() => {
    checkColor();
    // eslint-disable-next-line
  }, [photoIndex]);

  const ScrollButtons = () => {
    if (photoArrayLength > 1) {
      return (
        <div>
          <button
            className="ScrollImage"
            id="ScrollPhotoForward"
            onClick={() => scrollPhoto("Forward")}
            style={{ color: scrollColor }}>&#8250;</button>
          <button
            className="ScrollImage"
            id="ScrollPhotoBack"
            onClick={() => scrollPhoto("Back")}
            style={{ color: scrollColor }}>&#8249;</button>
        </div>
      );
    }
  }

  const scrollPhoto = (direction) => {
    if (direction === "Forward" && photoIndex < photoArrayLength) {
      setPhotoIndex(photoIndex + 1);
    }

    if (direction === "Back" && photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  }

  const deleteButton = () => {
    if (props.User["_id"] === product.ownerID) {
      return (
        <button id="DeleteButton" onClick={() => deleteProdoct()}>Delete</button>
      )
    }
  }

  if (!isLoaded) {
    return (
      <h1>Loadind...</h1>
    );
  }

  return (
    <div id="ProductPage">
      <div id="ProductPrice">
        <h1>{product.name}</h1>
        <h2>{product.cost} {product.currency}</h2>
        <button>
          <a rel="noreferrer" href={"mailto:https://" + (JSON.parse(product.owner).email)} target="_blank">send mail</a>
        </button>
      </div>
      <div id="ProductPageDescription">
        <h3>{"|Місто : " + product.city + " Категорія: " + product.category + " |" + product.description}</h3>
      </div>
      <ScrollButtons/>
      <div id="ProductImage">  <img alt="" src={PHTOTURL + JSON.parse(product.photos)[photoIndex]} /></div>
      <deleteButton/>
    </div>
  );

}