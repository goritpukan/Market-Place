import React from "react";
import { useState, useEffect, lazy, Suspense, createContext } from "react";
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


export const ThemeContext = createContext(null);

export default function App(props) {
  const [theme, setTheme] = useState("dark");

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("NowUser") !== "undefined" && localStorage.getItem("NowUser") !== "null") {
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

  const login = (_user) => {
    setUser(_user);
    _user = JSON.stringify(_user);
    localStorage.setItem("NowUser", _user);
  }

  const logOut = () => {
    setUser(null);
    localStorage.setItem("NowUser", null);
  }

  const updateUser = (_user) => {
    setUser(_user);
    _user = JSON.stringify(_user);
    localStorage.setItem("NowUser", _user);
  }

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Header user={user} logOut={logOut} />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage sendUser={login} />} />
            <Route path="/registration" element={<RegistrationPage sendUser={login} />} />
            <Route path="/profile" element={<Profile user={user} updateUser={updateUser} />} />
            <Route path="/create_product" element={<CreateProduct user={user} />} />
            <Route path="/product/:id" element={<ProductPage user={user} />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </Suspense>
      </ThemeContext.Provider>
    </>
  );
}