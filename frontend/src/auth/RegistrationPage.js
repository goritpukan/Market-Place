import React from "react";
import "./auth.css";
import ErrorWindow from "../ErrorWindow.js";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage(props) {

  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef({});

  const navigate = useNavigate();

  useEffect(() => {

    if (localStorage.getItem("NowUser") !== "undefined") {

      const user = JSON.parse(localStorage.getItem("NowUser"));
      if (user) {
        const data = {
          email: user.email,
          password: user.password
        };
        fetch("http://localhost:4001/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: (JSON.stringify(data))
        })
          .then(res => res.json())
          .then(result => {
            if (!result.isError) {
              props.sendUser(result.message);
              navigate("/");
            }
          })
      }
    }
    // eslint-disable-next-line
  }, []);




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
    <div id="RegistrationPage">
      <ErrorWindow
        errorMessage={errorMessage}
        closeWindow={closeWindow} />

      <div>
        <div id="RegistrationForm">
          <div className="Forms" id="Name">
            <p>Nickname</p>
            <input type="text"
              ref={el => inputRef.current.nickname = el}
              id="nicknameInput"
              name="Nickname"
              minLength="4"
              maxLength="20" />
          </div>
          <div className="Forms" id="Email">
            <p>Email</p>
            <input type="email"
              ref={el => inputRef.current.email = el}
              id="emailInput"
              name="Email"
              minLength="5"
              maxLength="30" />
          </div>
          <div className="Forms" id="Password">
            <p>Password</p>
            <input
              ref={el => inputRef.current.password = el}
              id="passwordInput"
              type="password"
              name="Password"
              minLength="5"
              maxLength="30" />
          </div>
          <div className="Forms" id="Password">
            <p>Confirm Password</p>
            <input type="Password"
              ref={el => inputRef.current.confirmPassword = el}
              id="confirmpasswordInput"
              name="Confirm Password"
              minLength="5"
              maxLength="30" />
          </div>
          <button id="SendButton" onClick={() => getData()}>Create Account</button>
          <p id="GotoLogin">Have an account?
            <button id="Login-Reg" onClick={() => navigate("/Login")}>Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
