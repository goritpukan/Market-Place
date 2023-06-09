import React from "react";
import { useState, useRef } from "react";
import ErrorWindow from "../ErrorWindow";

export default function ChangeName(props) {
  const [error, setError] = useState();

  const inputRef = useRef(null);

  if (props.isActive) {

    const ChangeName = () => {
      const data = {
        nickname: props.nickname,
        newnickname: inputRef.current.value
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
          errorMessage={error}
          closeWindow={CloseErrorWindow} />
        <button className="Exit" onClick={props.CloseWindow}>Exit</button>
        <input
          ref={inputRef}
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
