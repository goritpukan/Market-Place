import React from "react";
import { useState } from "react";
import ErrorWindow from "../ErrorWindow";

export default function ChangeEmail(props) {
  const [error, setError] = useState();
  if (props.isActive) {

    const changeEmail = () => {
      const data = {
        password: document.getElementById("ChangeEmailPasswordInput").value,
        email: props.email,
        newemail: document.getElementById("ChangeEmailInput").value
      }
      if (props.email !== data.newemail && data.password) {
        fetch("http://localhost:4001/api/auth/ChangeEmail", {
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
              props.UpdateUserEmail(data.newemail);
              props.CloseWindow();
            } else {
              setError(result.message);
            }
          })
      } else {
        setError("Не всі поля заповнені");
      }
    }
    const closeErrorWindow = () => {
      setError(null);
    }
    return (
      <div id="ChangeEmailWindow" className="ChangeSmth">
        <ErrorWindow
          errorMessage={error}
          closeWindow={closeErrorWindow} />
        <button className="Exit" onClick={props.CloseWindow}>Exit</button>
        <input
          type="email"
          className="ChangeInput"
          id="ChangeEmailInput"
          minLength="5"
          maxLength="30"
          placeholder="Type new email" />
        <input
          id="ChangeEmailPasswordInput"
          className="ChangeInput"
          type="Password"
          name="Password"
          minLength="5"
          maxLength="30"
          placeholder="Type your password" />
        <button className="ChangeButton" id="ChangeEmailButton" onClick={() => changeEmail()}>Change Email</button>
      </div>
    );
  }
}