import React from "react";
import { useState, useEffect } from "react";
import "./profile.css"

import ChangePhoto from "./ChangePhoto";
import ChangeName from "./ChangeName";
import ChangeEmail from "./ChangeEmail";
import MyProducts from "./MyProducts";

export default function Profile(props) {
  const [user, setUser] = useState(props.user);
  const [photoActiveState, setPhotoActiveState] = useState(false);
  const [nameActiveState, setNameActiveState] = useState(false);
  const [emailActiveState, setEmailActiveState] = useState(false);

  const AVATARURL = "http://localhost:4001/api/images/avatar/";

  const updateUserInfo = () => {
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
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then(result => {
          if (!result.isError) {
            setUser(result.message);
          }
        });
      props.updateUser(user);
    }

  }
  useEffect(() => {
    if (user) {
      updateUserInfo();
    }

    // eslint-disable-next-line
  }, []);

  const changePhotoActive = () => {
    setPhotoActiveState(!photoActiveState);
    if (photoActiveState) {
      updateUserInfo();
    }
  }

  const changeNameActive = () => {
    setNameActiveState(!nameActiveState);
    if (nameActiveState) {
      updateUserInfo();
    }
  }

  const changeEmailActive = () => {
    setEmailActiveState(!emailActiveState);
    if (emailActiveState) {
      updateUserInfo();
    }
  }

  const updateUserEmail = (newEmail) => {
    const _user = user;
    _user.email = newEmail;
    setUser(_user);
    props.UpdateUser(_user);
  }
  if (user) {
    return (
      <div id="Profile">
        <MyProducts
          id={user["_id"]}
          setPage={props.setPage} />
        <ChangePhoto
          nickname={user.nickname}
          isActive={photoActiveState}
          CloseWindow={changePhotoActive} />
        <ChangeName
          nickname={user.nickname}
          isActive={nameActiveState}
          CloseWindow={changeNameActive} />
        <ChangeEmail
          nickname={user.nickname}
          email={user.email}
          isActive={emailActiveState}
          UpdateUserEmail={updateUserEmail}
          CloseWindow={changeEmailActive} />
        <div id="Main">
          <div id="ProfileInfo">
            <img id="Avatar" alt="" src={AVATARURL + user.avatar} />
            <button id="ChangePhoto" onClick={() => changePhotoActive()}>Change Photo</button>
            <div id="InfoList">
              <ul>
                <li
                  className="Info"
                  id="ProfileName"
                  onClick={() => { changeNameActive() }}>Name: {user.nickname}</li>
                <li
                  className="Info"
                  id="ProfileEmail"
                  onClick={() => changeEmailActive()}>Email: {user.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}