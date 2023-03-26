import React from "react";
import "./Product.css";

import ImageList from "./ImageList";
import ErrorWindow from "../ErrorWindow";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct(props) {

  const navigate = useNavigate();

  const [Photos, SetPhotos] = useState([]);
  const [Error, setError] = useState();
  document.getElementsByTagName("title")[0].innerHTML = "Create Product";

  const GetImage = () => {
    const image = document.getElementById("image").files[0];
    if (image) {
      const fr = new FileReader();
      fr.addEventListener("load", () => {
        SetPhotos([
          ...Photos, { Photo: image, PhotoUrl: fr.result }
        ]);
      }, false);
      fr.readAsDataURL(image);
    }
  }
  const DeleteImage = (index) => {
    const arr = [...Photos];
    arr.splice(index, 1);
    SetPhotos(arr);
  }
  const GetData = () => {
    const data = {
      name: document.getElementById("ProductName").value,
      description: document.getElementById("ProductDescription").value,
      cost: document.getElementById("ProductCost").value,
      city: document.getElementById("City").value,
      category: document.getElementById("Category").value,
      currency: document.getElementById("Currency").value,
      owner: props.User,
      ownerID: props.User["_id"]
    };
    validate(data);
  }
  const validate = (data) => {
    if (data.name.length >= 5 && data.cost && data.cost <= 1000000000 && data.cost > 0) {
      SendData(data);
    } else {
      setError("Щось не заповнено");
    }
  }
  const SendData = (data) => {
    fetch("http://localhost:4001/api/products/CreateProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        if (!result.isError) {
          if (Photos) {
            SendPhoto(result.id);
          }else{
            navigate("/Profile");
          }
        } else {
          setError(result);
        }
      })
  }
  const SendPhoto = (id) => {
    const fd = new FormData();
    for (let i in Photos) {
      fd.append("Images", Photos[i].Photo)
    }
    fetch("http://localhost:4001/api/products/UploadProductImage" + id, {
      method: "POST",
      body: fd
    })
      .then(res => res.json())
      .then(result => {
        if (!result.ifError) {
          navigate("/Profile");
        } else {
          setError(result)
        }
      })
  }

  const CloseErrorWindow = () => {
    setError(null);
  }

  return (
    <div id="CreateShopPage">
      <ErrorWindow
      errorMessage={Error} 
      closeWindow={CloseErrorWindow}/>
      <input
        type="file"
        id="image"
        accept="image/png, image/jpg"
        onChange={() => GetImage()} />
      <input type="Text"
        className="ShopInput"
        id="ProductName"
        placeholder="Product Name"
        minLength="5"
        maxLength="30" />
      <textarea type="Text"
        className="ShopInput"
        id="ProductDescription"
        placeholder="Product Description"
        minLength="1"
        maxLength="2000" />
      <ImageList
        ImageList={Photos}
        DeleteImage={DeleteImage} />
      <div id="CostDiv">
        <input type="Number"
          className="ShopInput"
          id="ProductCost"
          placeholder="Price"
          min="1"
          max="1000000000" />
        <select id="Currency">
          <option value="UAH">UAH</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
      </div>
      <div id="Selects">
        <select id="City">
          <option value="Київ">Київ</option>
          <option value="Одеса">Одеса</option>
          <option value="Львів">Львів</option>
          <option value="Харків">Харків</option>
          <option value="Інше">Інше</option>
        </select>
        <select id="Category">
          <option value="Нерухомість">Нерухомість</option>
          <option value="Авто">Авто</option>
          <option value="Електроніка">Електроніка</option>
          <option value="Спорт">Спорт</option>
          <option value="Дім">Дім</option>
          <option value="Хобі">Хобі</option>
          <option value="Велосипеди">Велосипеди</option>
          <option value="Інше">Інше</option>
        </select>
      </div>
      <button id="ChooseImage" onClick={() => { if (Photos.length < 10) { document.getElementById("image").click() } }}>Add Image</button>
      <button id="CreateShopButton" onClick={() => GetData()}>Create</button>
    </div>
  )
}