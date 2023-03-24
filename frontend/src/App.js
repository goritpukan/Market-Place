import React from "react";
import { useState } from "react";
import "./app.css";

import Header from "./Header.js";
import Auth from "./auth/Auth.js";
import Profile from "./profile/Profile.js";
import CreateProduct from "./Product/CreateProduct.js"
import ProductPage from "./Product/ProductPage.js";

export default function App(props) {
  const [NowPage, SetPage] = useState("Auth");
  const [User, SetUser] = useState();
  const [PageData, setPageData] = useState();

  const login = (_User) => {
    SetPage("Profile");
    SetUser(_User);
    _User = JSON.stringify(_User);
    localStorage.setItem("NowUser", _User);
  }

  const logOut = () => {
    SetPage("Auth");
    SetUser(null);
    localStorage.setItem("NowUser", null);
  }

  const setPage = (PageName, data = null) => {
    SetPage(PageName);
    if(data){
      setPageData(data);
    }
  }

  const UpdateUser = (_User) => {
    SetUser(_User);
    _User = JSON.stringify(_User);
    localStorage.setItem("NowUser", _User);
  }

  switch (NowPage) {
    case "Auth":
      return (
        <div>
          <Auth sendUser={login} />
        </div>
      );
    case "Profile":
      return (
        <div>
          <Header
            FirstButtonText="CreateProduct"
            FirstButtonPage="CreateProduct"
            logOut={logOut}
            setPage={setPage} />
          <Profile
            User={User}
            UpdateUser={UpdateUser}
            setPage={setPage} />
        </div>
      );
    case "CreateProduct":
      return (
        <div>
          <Header
            FirstButtonText="Profile"
            FirstButtonPage="Profile"
            logOut={logOut}
            setPage={setPage} />
          <CreateProduct
            setPage={setPage} />
        </div>
      );
    case "ProductPage":
      return (
        <div>
          <Header
            FirstButtonText="Profile"
            FirstButtonPage="Profile"
            logOut={logOut}
            setPage={setPage} />
          <ProductPage
          PageData={PageData}/>
        </div>
      )
    default:
      break;
  }
}