import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ThemeContext } from "./App";

export default function Header(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const {theme, setTheme} = useContext(ThemeContext);

  const AVATARURL = "http://localhost:4001/api/images/avatar/";

  const Avatar = () => {
    if (props.user) {
      return (
        <img alt="" onClick={() => setDropdownOpen(!dropdownOpen)} src={AVATARURL + props.user.avatar}></img>
      );
    }
    return (
      <button id="LogIn" onClick={() => navigate("/login")}>Log in</button>
    )
  }
  const Dropdown = () => {
    if (dropdownOpen) {
      return (
        <div id="Dropdown">
          <button onClick={() => {
            navigate("/profile")
            setDropdownOpen(!dropdownOpen)
          }}>Open Profile</button>
          <button onClick={() => {
            navigate("/create_product");
            setDropdownOpen(!dropdownOpen)
          }}>Create Product</button>
          <button onClick={() => {
            if (window.location.pathname === "/profile" || window.location.pathname === "/create_product")
              navigate("/");
            props.logOut();
            setDropdownOpen(!dropdownOpen)
          }}>Log Out</button>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>^</button>
        </div>
      )
    }
  }
  if (window.location.pathname !== "/login" && window.location.pathname !== "/registration") {
    return (
      <header>
        <button className="MainButton" onClick={() => navigate("/")}>Main</button>
        <button onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}>{}</button>
        <Avatar />
        <Dropdown />
      </header>
    );
  }
}

