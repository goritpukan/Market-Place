import React from "react";
import "./auth.css";
import ErrorWindow from "../ErrorWindow.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    if (localStorage.getItem("NowUser") !== "undefined") {
      const User = JSON.parse(localStorage.getItem("NowUser"));

      if (User) {
        const data = {
          email: User.email,
          password: User.password
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
      email: document.getElementById("emailInput").value,
      password: document.getElementById("passwordInput").value,
    };
    validate(regData);
  }

  const validate = (regData) => {
    if (
      regData.email === "" ||
      regData.password === ""
    ) {
      setErrorMessage("Не все поля заполнены");

    } else if (regData.email.includes("@") === false
      || regData.email.split("@")[1].includes(".") === false) {
      setErrorMessage("Почта введена неправильно");
    }
    else if (regData.password.length < 5) {
      setErrorMessage("Пароль спишком короткий");
    } else {
      sendData(regData);
    }
  }

  const sendData = async (RegData) => {
    const data = {
      email: RegData.email,
      password: RegData.password
    };
    await fetch("http://localhost:4001/api/auth/login", {
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
    <div id="LoginPage">
      <ErrorWindow
        errorMessage={errorMessage}
        closeWindow={closeWindow} />
      <div>
        <div id="LoginForm">
          <div className="Forms" id="Email">
            <p>Email</p>
            <input type="email"
              id="emailInput"
              name="Email"
              minLength="5"
              maxLength="30" />
          </div>
          <div className="Forms" id="Password">
            <p>Password</p>
            <input
              id="passwordInput"
              type="Password"
              name="Password"
              minLength="5"
              maxLength="30" />
          </div>
          <button id="SendButton" onClick={() => getData()}>Log in</button>
          <p id="GotoLogin">Don't have an account? <button id="Login-Reg" onClick={() => navigate("/Registration")}>Create account</button></p>
        </div>
      </div>
    </div>
  );
}
