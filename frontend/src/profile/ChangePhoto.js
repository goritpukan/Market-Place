import React from "react"
import { useState, useEffect } from "react";
import ErrorWindow from "../ErrorWindow";

export default function ChangePhoto(props) {
  const [Error, setError] = useState();

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        SendImage();
      }
    });
    return () => {
      document.removeEventListener("keydown", () => {});
    }
  });

  const SendImage = () => {
    const Image = document.getElementById("FileInput").files[0];
    if (Image) {
      const URI = "http://localhost:4001/api/images/changeAvatar" + props.nickname;
      const formData = new FormData();
      formData.append("Avatar", Image);
      fetch(URI, {
        method: "POST",
        body: formData,
      })
        .then(res => res.json)
        .then(result => {
          if (!result.isError) {
            props.CloseWindow()
          }else{
            setError(result.message);
          }
        })
    }else{
      setError("Фото не обрано")
    }
  }
  const CloseErrorWindow = () => {
    setError(null);
  }
  if (props.isActive) {
    return (
      <div id="ChangePhotoWindow" className="ChangeSmth">
         <ErrorWindow
          errorMessage={Error}
          closeWindow={CloseErrorWindow} />
        <button className="Exit" onClick={() => props.CloseWindow()}>Exit</button>
        <input
          type="file"
          name="Avatar"
          id="FileInput"
          accept="image/png, image/jpg"/>
        <button id="SendFile" onClick={() => SendImage()}>SendFile</button>
      </div>
    );
  }
}
