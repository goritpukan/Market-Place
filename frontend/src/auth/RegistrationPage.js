import React from "react";
import ErrorWindow from "../ErrorWindow.js";
import { useState } from "react";

export default function RegistrationPage(props) {

  const [errorMessage, setErrorMessage] = useState("");

  document.getElementsByTagName("title")[0].innerHTML = "Registration";

  

  const GetData = () => {
    const RegData = {
      nickname: document.getElementById("nicknameInput").value,
      email: document.getElementById("emailInput").value,
      password: document.getElementById("passwordInput").value,
      confirmPassword: document.getElementById("confirmpasswordInput").value,
    };
    validate(RegData);
  }

  const validate = (RegData) => {
    if (
      RegData.nickname === "" ||
      RegData.email === "" ||
      RegData.password === "" ||
      RegData.confirmPassword === ""
    ) {
      setErrorMessage("Не все поля заполнены");

    } else if (RegData.nickname.length < 4) {

      setErrorMessage("Никнейм слишком короткий");

    } else if (RegData.email.includes("@") === false
      || RegData.email.split("@")[1].includes(".") === false) {

      setErrorMessage("Почта введена неправильно");

    } else if (RegData.password !== RegData.confirmPassword) {

      setErrorMessage("Пароли не совпадают");

    } else if (RegData.password.length < 5) {
      setErrorMessage("Пароль спишком короткий");
    } else {
      sendData(RegData);
    }
  }

  const sendData = async (RegData) => {
    const data = {
      nickname: RegData.nickname,
      email: RegData.email,
      password: RegData.password
    };
    await fetch("http://localhost:4001/api/auth/regisration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        if (result.isError) {
          setErrorMessage(result.message);
        } else {
          props.sendUser(result.message);
        }
      });
  }

  const closeWindow = () => {
    setErrorMessage(null);
  }

  return (
    <div id="RegistrationPage">
      <ErrorWindow
        errorMessage={errorMessage}
        closeWindow={closeWindow} />

      <div>
        <div id="RegistrationForm">
          <div className="Forms" id="Name">
            <p>Nickname</p>
            <input type="text"
              id="nicknameInput"
              name="Nickname"
              minLength="4"
              maxLength="20"/>
          </div>
          <div className="Forms" id="Email">
            <p>Email</p>
            <input type="email"
              id="emailInput"
              name="Email"
              minLength="5"
              maxLength="30"/>
          </div>
          <div className="Forms" id="Password">
            <p>Password</p>
            <input
              id="passwordInput"
              type="password"
              name="Password"
              minLength="5"
              maxLength="30" />
          </div>
          <div className="Forms" id="Password">
            <p>Confirm Password</p>
            <input type="Password"
              id="confirmpasswordInput"
              name="Confirm Password"
              minLength="5"
              maxLength="30" />
          </div>
          <button id="SendButton" onClick={() => GetData()}>Create Account</button>
          <p id="GotoLogin">Have an account?
            <button id="Login-Reg" onClick={() => props.renderLogin()}>Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
