import React from "react"
import { useState, useRef } from "react";
import ErrorWindow from "../ErrorWindow";

export default function ChangePhoto(props) {
  const [error, setError] = useState();

  const imgRef = useRef();

  const sendImage = () => {
    const image = imgRef.current.files[0];
    if (image) {
      const URI = "http://localhost:4001/api/images/changeAvatar" + props.nickname;
      const formData = new FormData();
      formData.append("Avatar", image);
      fetch(URI, {
        method: "POST",
        body: formData,
      })
        .then(res => res.json)
        .then(result => {
          if (!result.isError) {
            props.CloseWindow()
          } else {
            setError(result.message);
          }
        })
    } else {
      setError("Фото не обрано")
    }
  }
  const closeErrorWindow = () => {
    setError(null);
  }
  if (props.isActive) {
    return (
      <div id="ChangePhotoWindow" className="ChangeSmth">
        <ErrorWindow
          errorMessage={error}
          closeWindow={closeErrorWindow} />
        <button className="Exit" onClick={() => props.CloseWindow()}>Exit</button>
        <input
          ref={imgRef}
          type="file"
          name="Avatar"
          id="FileInput"
          accept="image/png, image/jpg" />
        <button id="SendFile" onClick={() => sendImage()}>SendFile</button>
      </div>
    );
  }
}
