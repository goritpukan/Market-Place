import React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("NowUser") !== "undefined") {
      const user = JSON.parse(localStorage.getItem("NowUser"));

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
        body: (JSON.stringify(data))
      })
        .then(res => res.json())
        .then(result => {
          if (!result.isError) {
            setUser(result.message);
          }
        })
    }
  }, []);

  const login = (_User) => {
    setUser(_User);
    _User = JSON.stringify(_User);
    localStorage.setItem("NowUser", _User);
  }

  const logOut = () => {
    setUser(null);
    localStorage.setItem("NowUser", null);
  }

  const updateUser = (_User) => {
    setUser(_User);
    _User = JSON.stringify(_User);
    localStorage.setItem("NowUser", _User);
  }

  return (
    <>
      <Header User={user} logOut={logOut} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Login" element={<LoginPage sendUser={login} />} />
          <Route path="/Registration" element={<RegistrationPage sendUser={login} />} />
          <Route path="/Profile" element={<Profile User={user} UpdateUser={updateUser} />} />
          <Route path="/CreateProduct" element={<CreateProduct User={user} />} />
          <Route path="/Product/:id" element={<ProductPage User={user} />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Suspense>
    </>
  );
}