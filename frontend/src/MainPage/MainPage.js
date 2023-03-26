import React from "react";
import { useState } from "react";
import "./MainPage.css";

export default function MainPage(props) {
  document.getElementsByTagName("title")[0].innerHTML = "Main Page";

  return (
    <div>
      <div id="FilterDiv">
        <select id="CurrencyFilter">
          <option value="UAH">UAH</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
        <select id="City">
          <option value="Київ">Київ</option>
          <option value="Одеса">Одеса</option>
          <option value="Львів">Львів</option>
          <option value="Харків">Харків</option>
          <option value="Інше">Інше</option>
        </select>
        <select id="Category">
          <option value="Нерухомість">Нерухомість</option>
          <option value="Авто">Авто</option>
          <option value="Електроніка">Електроніка</option>
          <option value="Спорт">Спорт</option>
          <option value="Дім">Дім</option>
          <option value="Хобі">Хобі</option>
          <option value="Велосипеди">Велосипеди</option>
          <option value="Інше">Інше</option>
        </select>
        <input type="range" min="0" max="1000" step="1" defaultValue="200"></input>
        <input type="range" min="0" max="1000" step="1" defaultValue="1000"></input>
      </div>

    </div>
  )

}