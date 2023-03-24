import React from "react";
import { useState } from "react";
import ErrorWindow from "../ErrorWindow";

export default function ChangeName(props) {
  const [Error, setError] = useState();

  if (props.isActive) {

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        ChangeName();
      }
    });
    const ChangeName = () => {
      const data = {
        nickname: props.nickname,
        newnickname: document.getElementById("ChangeNameInput").value
      }
      if (props.nickname !== data.newnickname && data.newnickname.length >= 4 && data.newnickname.length <= 20) {
        fetch("http://localhost:4001/api/auth/ChangeName", {
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
              props.CloseWindow();
            } else {
              setError(result.message);
            }
          })
      } else {
        setError("Не всі поля заповнені");
      }
    }

    const CloseErrorWindow = () => {
      setError(null);
    }

    return (
      <div id="ChangeNameWindow" className="ChangeSmth">
        <ErrorWindow
          errorMessage={Error}
          closeWindow={CloseErrorWindow} />
        <button className="Exit" onClick={props.CloseWindow}>Exit</button>
        <input
          type="text"
          id="ChangeNameInput"
          className="ChangeInput"
          minLength="4"
          maxLength="20"
          placeholder="Type new name"></input>
        <button className="ChangeButton" id="ChangeNameButton" onClick={() => ChangeName()}>Change Name</button>
      </div>
    );
  }
}
