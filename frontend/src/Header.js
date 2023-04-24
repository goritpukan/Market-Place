import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const AVATARURL = "http://localhost:4001/api/images/avatar/";

  const Avatar = () => {
    if (props.User) {
      return (
        <img alt="" onClick={() => setDropdownOpen(!dropdownOpen)} src={AVATARURL + props.User.avatar}></img>
      );
    }
    return (
      <button id="LogIn" onClick={() => navigate("/Login")}>Log in</button>
    )
  }
  const Dropdown = () => {
    if (dropdownOpen) {
      return (
        <div id="Dropdown">
          <button onClick={() => {
            navigate("/Profile")
            setDropdownOpen(!dropdownOpen)
          }}>Open Profile</button>
          <button onClick={() => {
            navigate("/CreateProduct");
            setDropdownOpen(!dropdownOpen)
          }}>Create Product</button>
          <button onClick={() => {
            if (window.location.pathname === "/Profile" || window.location.pathname === "/CreateProduct")
              navigate("/");
            props.logOut();
            setDropdownOpen(!dropdownOpen)
          }}>Log Out</button>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>^</button>
        </div>
      )
    }
  }
  if (window.location.pathname !== "/Login" && window.location.pathname !== "/Registration") {
    return (
      <header>
        <button className="MainButton" onClick={() => navigate("/")}>Main</button>
        <Avatar />
        <Dropdown />
      </header>
    );
  }
}

