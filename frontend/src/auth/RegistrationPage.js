import React from "react";
import "./auth.css";
import { ThemeContext } from "../App";
import ErrorWindow from "../ErrorWindow.js";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const inputRef = useRef({});

  const getData = () => {
    const regData = {
      nickname: inputRef.current.nickname.value,
      email: inputRef.current.email.value,
      password: inputRef.current.password.value,
      confirmPassword: inputRef.current.confirmPassword.value,
    };
    validate(regData);
  }

  const validate = (regData) => {
    if (
      regData.nickname === "" ||
      regData.email === "" ||
      regData.password === "" ||
      regData.confirmPassword === ""
    ) {
      setErrorMessage("Не все поля заполнены");

    } else if (regData.nickname.length < 4) {

      setErrorMessage("Никнейм слишком короткий");

    } else if (regData.email.includes("@") === false
      || regData.email.split("@")[1].includes(".") === false) {

      setErrorMessage("Почта введена неправильно");

    } else if (regData.password !== regData.confirmPassword) {

      setErrorMessage("Пароли не совпадают");

    } else if (regData.password.length < 5) {
      setErrorMessage("Password is too short");
    } else {
      sendData(regData);
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
          navigate("/");
        }
      });
  }

  const closeWindow = () => {
    setErrorMessage(null);
  }

  return (
    <div id={theme}>
      <div className="auth-page">
        <ErrorWindow
          errorMessage={errorMessage}
          closeWindow={closeWindow} />

        <div>
          <div className="registration-form">
            <div className="forms" >
              <p>Nickname</p>
              <input type="text"
                ref={el => inputRef.current.nickname = el}
                name="Nickname"
                minLength="4"
                maxLength="20" />
            </div>
            <div className="forms">
              <p>Email</p>
              <input type="email"
                ref={el => inputRef.current.email = el}
                name="Email"
                minLength="5"
                maxLength="30" />
            </div>
            <div className="forms">
              <p>Password</p>
              <input
                ref={el => inputRef.current.password = el}
                type="password"
                name="Password"
                minLength="5"
                maxLength="30" />
            </div>
            <div className="forms">
              <p>Confirm Password</p>
              <input type="Password"
                ref={el => inputRef.current.confirmPassword = el}
                name="Confirm Password"
                minLength="5"
                maxLength="30" />
            </div>
            <button className="send-button" onClick={() => getData()}>Create Account</button>
            <div className="change-form">
              <p>Have already an account?</p>
              <button onClick={() => navigate("/login")}>Log in</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
