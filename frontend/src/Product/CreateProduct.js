import React from "react";
import "./Product.css";

import ImageList from "./ImageList";
import ErrorWindow from "../ErrorWindow";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct(props) {

  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState();

  const inputRef = useRef({});

  const getImage = () => {
    const image = document.getElementById("image").files[0];
    if (image) {
      const fr = new FileReader();
      fr.addEventListener("load", () => {
        setPhotos([
          ...photos, { Photo: image, PhotoUrl: fr.result }
        ]);
      }, false);
      fr.readAsDataURL(image);
    }
  }
  const deleteImage = (index) => {
    const arr = [...photos];
    arr.splice(index, 1);
    setPhotos(arr);
  }
  const getData = () => {
    const data = {
      name: inputRef.current.name.value,
      description: inputRef.current.description.value,
      cost: inputRef.current.cost.value,
      city: inputRef.current.city.value,
      category: inputRef.current.category.value,
      currency: inputRef.current.currency.value,
      owner: {
        email: props.user.email,
        nickname: props.user.nickname,
        avatar: props.user.avatar
      },

      ownerID: props.user["_id"]
    };
    validate(data);
  }
  const validate = (data) => {
    if (data.name.length >= 5 && data.cost && data.cost <= 1000000000 && data.cost > 0) {
      sendData(data);
    } else {
      setError("Щось не заповнено");
    }
  }
  const sendData = (data) => {
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
          if (photos) {
            sendPhoto(result.id);
          } else {
            navigate("/Profile");
          }
        } else {
          setError(result);
        }
      })
  }
  const sendPhoto = (id) => {
    const fd = new FormData();
    for (let i in photos) {
      fd.append("Images", photos[i].Photo)
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

  const closeErrorWindow = () => {
    setError(null);
  }

  return (
    <div id="CreateShopPage">
      <ErrorWindow
        errorMessage={error}
        closeWindow={closeErrorWindow} />
      <input
        ref={el => inputRef.current.image = el}
        type="file"
        id="image"
        accept="image/png, image/jpg"
        onChange={() => getImage()} />
      <input type="Text"
        ref={el => inputRef.current.name = el}
        className="ShopInput"
        id="ProductName"
        placeholder="Product Name"
        minLength="5"
        maxLength="30" />
      <textarea type="Text"
        ref={el => inputRef.current.description = el}
        className="ShopInput"
        id="ProductDescription"
        placeholder="Product Description"
        minLength="1"
        maxLength="2000" />
      <ImageList
        imageList={photos}
        deleteImage={deleteImage} />
      <div id="CostDiv">
        <input type="Number"
          ref={el => inputRef.current.cost = el}
          className="ShopInput"
          id="ProductCost"
          placeholder="Price"
          min="1"
          max="1000000000" />
        <select id="Currency" ref={el => inputRef.current.currency = el}>
          <option value="UAH">UAH</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
      </div>
      <div id="Selects">
        <select id="City" ref={el => inputRef.current.city = el}>
          <option value="Київ">Київ</option>
          <option value="Одеса">Одеса</option>
          <option value="Львів">Львів</option>
          <option value="Харків">Харків</option>
          <option value="Інше">Інше</option>
        </select>
        <select id="Category" ref={el => inputRef.current.category = el}>
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
      <button id="ChooseImage" onClick={() => { if (photos.length < 10) { inputRef.current.image.click() } }}>Add Image</button>
      <button id="CreateShopButton" onClick={() => getData()}>Create</button>
    </div>
  )
}