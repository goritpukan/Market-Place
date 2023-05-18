import React from "react";
import "./auth.css";
import { ThemeContext } from "../App";
import ErrorWindow from "../ErrorWindow.js";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const inputRef = useRef({});

  const getData = () => {
    const regData = {
      email: inputRef.current.email.value,
      password: inputRef.current.password.value,
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
    <div className="auth-page" id={theme}>
      <ErrorWindow
        errorMessage={errorMessage}
        closeWindow={closeWindow} />
      <div>
        <div className="login-form">
          <div className="forms" >
            <p>Email</p>
            <input type="email"
              ref={el => inputRef.current.email = el}
              name="Email"
              minLength="5"
              maxLength="30" />
          </div>
          <div className="forms" >
            <p>Password</p>
            <input
              ref={el => inputRef.current.password = el}
              type="Password"
              name="Password"
              minLength="5"
              maxLength="30" />
          </div>
          <button className="send-button" onClick={() => getData()}>Log in</button>
          <div className="forms">
            <p>Don't have an account? </p>
            <button onClick={() => navigate("/registration")}>Create account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
