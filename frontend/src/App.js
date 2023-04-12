import React from "react";
import { useState, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./app.css";

import Loader from "./Loader/Loader";
import Header from "./Header.js";
import MainPage from "./MainPage/MainPage.js";

const LoginPage = lazy(() => import("./auth/LoginPage"));
const RegistrationPage = lazy(() => import("./auth/RegistrationPage"));
const ProductPage = lazy(() => import("./Product/ProductPage.js"));
const Profile = lazy(() => import("./profile/Profile.js"));
const CreateProduct = lazy(() => import("./Product/CreateProduct.js"));

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
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Login" element={<LoginPage sendUser={login} />} />
          <Route path="/Registration" element={<RegistrationPage sendUser={login} />} />
          <Route path="/Profile" element={<Profile User={User} UpdateUser={UpdateUser} />} />
          <Route path="/CreateProduct" element={<CreateProduct User={User} />} />
          <Route path="/Product/:id" element={<ProductPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Suspense>
    </>
  );
}