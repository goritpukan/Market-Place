import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./app.css";

import Header from "./Header.js";
import LoginPage from "./auth/LoginPage";
import RegistrationPage from "./auth/RegistrationPage";
import Profile from "./profile/Profile.js";
import CreateProduct from "./Product/CreateProduct.js"
import ProductPage from "./Product/ProductPage.js";
import MainPage from "./MainPage/MainPage";

export default function App(props) {
  const [User, SetUser] = useState(JSON.parse(localStorage.getItem("NowUser")));

  const login = (_User) => {
    SetUser(_User);
    _User = JSON.stringify(_User);
    localStorage.setItem("NowUser", _User);
  }

  const logOut = () => {
    SetUser(null);
    localStorage.setItem("NowUser", null);
  }

  const UpdateUser = (_User) => {
    SetUser(_User);
    _User = JSON.stringify(_User);
    localStorage.setItem("NowUser", _User);
  }

  return (
    <>
      <Header User={User} logOut={logOut} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Login" element={<LoginPage sendUser={login} />} />
        <Route path="/Registration" element={<RegistrationPage sendUser={login} />} />
        <Route path="/Profile" element={<Profile User={User} UpdateUser={UpdateUser} />} />
        <Route path="/CreateProduct" element={<CreateProduct User={User} />} />
        <Route path="/Product/:id" element={<ProductPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );

  // switch (NowPage) {
  //   case "Auth":
  //     return (
  //       <div>
  //         <Auth sendUser={login} />
  //       </div>
  //     );
  //   case "Main":
  //     return(
  //       <div>
  //         <Header
  //           FirstButtonText="Profile"
  //           FirstButtonPage="Profile"
  //           logOut={logOut}
  //           setPage={setPage} />
  //         <MainPage/>
  //       </div>
  //     )
  //   case "Profile":
  //     return (
  //       <div>
  //         <Header
  //           FirstButtonText="CreateProduct"
  //           FirstButtonPage="CreateProduct"
  //           logOut={logOut}
  //           setPage={setPage} />
  //         <Profile
  //           User={User}
  //           UpdateUser={UpdateUser}
  //           setPage={setPage} />
  //       </div>
  //     );
  //   case "CreateProduct":
  //     return (
  //       <div>
  //         <Header
  //           FirstButtonText="Profile"
  //           FirstButtonPage="Profile"
  //           logOut={logOut}
  //           setPage={setPage} />
  //         <CreateProduct
  //           setPage={setPage} />
  //       </div>
  //     );
  //   case "ProductPage":
  //     return (
  //       <div>
  //         <Header
  //           FirstButtonText="Profile"
  //           FirstButtonPage="Profile"
  //           logOut={logOut}
  //           setPage={setPage} />
  //         <ProductPage
  //         PageData={PageData}/>
  //       </div>
  //     )
  //   default:
  //     break;
  // }
}