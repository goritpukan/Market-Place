import React from "react";
import { useState, useEffect } from "react";
import "./profile.css"

import ChangePhoto from "./ChangePhoto";
import ChangeName from "./ChangeName";
import ChangeEmail from "./ChangeEmail";
import MyProducts from "./MyProducts";

export default function Profile(props) {
  const [User, SetUser] = useState(props.User);
  const [PhotoActiveState, SetPhotoActiveState] = useState(false);
  const [NameActiveState, SetNameActiveState] = useState(false);
  const [EmailActiveState, SetEmailActiveState] = useState(false);

  const AVATARURL = "http://localhost:4001/api/images/avatar/";

  document.getElementsByTagName("title")[0].innerHTML = "Profile";

  const UpdateUserInfo = () => {
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
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then(result => {
        if (!result.isError) {
          SetUser(result.message)
        } else {
          console.log(result.message)
        }
      });
    props.UpdateUser(User);

  }
  // eslint-disable-next-line
  useEffect(() => {UpdateUserInfo()}, []);

  const ChangePhotoActive = () => {
    SetPhotoActiveState(!PhotoActiveState);
    if (PhotoActiveState) {
      UpdateUserInfo();
    }
  }

  const ChangeNameActive = () => {
    SetNameActiveState(!NameActiveState);
    if (NameActiveState) {
      UpdateUserInfo();
    }
  }

  const ChangeEmailActive = () => {
    SetEmailActiveState(!EmailActiveState);
    if (EmailActiveState) {
      UpdateUserInfo();
    }
  }

  const UpdateUserEmail = (newEmail) => {
    const user = User;
    user.email = newEmail;
    SetUser(user);
    props.UpdateUser(User);
  }

  return (
    <div id="Profile">
      <MyProducts 
      id={User["_id"]}
      setPage={props.setPage}/>
      <ChangePhoto
        nickname={User.nickname}
        isActive={PhotoActiveState}
        CloseWindow={ChangePhotoActive} />
      <ChangeName
        nickname={User.nickname}
        isActive={NameActiveState}
        CloseWindow={ChangeNameActive} />
      <ChangeEmail
        nickname={User.nickname}
        email={User.email}
        isActive={EmailActiveState}
        UpdateUserEmail={UpdateUserEmail}
        CloseWindow={ChangeEmailActive} />
      <div id="Main">
        <div id="ProfileInfo">
          <img id="Avatar" alt="" src={AVATARURL + User.avatar} />
          <button id="ChangePhoto" onClick={() => ChangePhotoActive()}>Change Photo</button>
          <div id="InfoList">
            <ul>
              <li
                className="Info"
                id="ProfileName"
                onClick={() => { ChangeNameActive() }}>Name: {User.nickname}</li>
              <li
                className="Info"
                id="ProfileEmail"
                onClick={() => ChangeEmailActive()}>Email: {User.email}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}