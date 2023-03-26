import React from "react";
import { FastAverageColor } from 'fast-average-color';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductPage(props) {
  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";

  const navigate = useNavigate();
  const { id } = useParams();

  const [Product, setProduct] = useState(null);
  const [PhotoArrayLength, setPhotoArrayLength] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [PhotoIndex, setPhotoIndex] = useState(0);
  const [ScrollColor, setScrollColor] = useState();

  useEffect(() => {
    fetch("http://localhost:4001/api/products/GetProductbyID/" + id)
      .then(res => res.json)
      .then(result => {
        if (result.isError) {
          navigate("*");
          return;
        }
        setProduct(JSON.parse(result.message));
        setPhotoArrayLength(JSON.parse(Product.photos).length - 1);
        setIsLoaded(true);
      })
  }, [setProduct, setPhotoArrayLength, setIsLoaded])


  const CheckColor = async () => {
    let fac = new FastAverageColor();
    const color = await fac.getColorAsync(PHTOTURL + JSON.parse(Product.photos)[PhotoIndex]);
    if (color.isDark) {
      setScrollColor("white");
    } else {
      setScrollColor("black");
    }
  }

  useEffect(() => {
    CheckColor();
  });

  const ScrollButtons = () => {
    if (PhotoArrayLength > 1) {
      return (
        <div>
          <button
            className="ScrollImage"
            id="ScrollPhotoForward"
            onClick={() => ScrollPhoto("Forward")}
            style={{ color: ScrollColor }}>&#8250;</button>
          <button
            className="ScrollImage"
            id="ScrollPhotoBack"
            onClick={() => ScrollPhoto("Back")}
            style={{ color: ScrollColor }}>&#8249;</button>
        </div>
      );
    }
  }

  const ScrollPhoto = (direction) => {
    if (direction === "Forward" && PhotoIndex < PhotoArrayLength) {
      setPhotoIndex(PhotoIndex + 1);
    }

    if (direction === "Back" && PhotoIndex > 0) {
      setPhotoIndex(PhotoIndex - 1);
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
        <h1>{Product.name}</h1>
        <h2>{Product.cost} {Product.currency}</h2>
        <button>
          <a rel="noreferrer" href={"mailto:https://" + (JSON.parse(Product.owner).email)} target="_blank">send mail</a>
        </button>
      </div>
      <div id="ProductPageDescription">
        <h3>{"|Місто : " + Product.city + " Категорія: " + Product.category + " |" + Product.description}</h3>
      </div>
      <div>{ScrollButtons()}</div>
      <div id="ProductImage">  <img alt="" src={PHTOTURL + JSON.parse(Product.photos)[PhotoIndex]} /></div>
    </div>
  );
}