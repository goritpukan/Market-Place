import React from "react";
import "./auth.css";
import { useState } from "react";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";

export default function Auth(props) {
  const [nowPage, SetPage] = useState("LoginPage");

  const renderLogin = () => {
    SetPage("LoginPage");
  }

  const renderRegistration = () => {
    SetPage("RegistrationPage");
  }

  if (nowPage === "RegistrationPage") {
    return (
      <RegistrationPage
        renderLogin={renderLogin}
        sendUser={props.sendUser} />
    );
  }
  return (
    <LoginPage
      renderLogin={renderRegistration}
      sendUser={props.sendUser} />
  );
}