import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

export default function MainPage(props) {
  document.getElementsByTagName("title")[0].innerHTML = "Main Page";
  const navigate = useNavigate();

  const [Filters, setFilters] = useState({});
  const [Products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [Page, setPage] = useState(0);
  const [ProductsLength, setProductsLength] = useState(0);

  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";
  const MAXPRODUCTS = 10;

  const getProducts = () => {
    setIsLoaded(false);
    fetch("http://localhost:4001/api/products/GetProducts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(Filters)
    })
      .then(res => res.json())
      .then(result => {
        if (!result.isError && result.message) {
          setProducts(result.message);
          setProductsLength(result.length);
          setIsLoaded(true);

        } else {
          setProducts(null);
          setIsLoaded(true);
        }
      })
  }
  useEffect(() => {
    UpdateFilters();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilters({
      ...Filters,
      page: Page
    });

    // eslint-disable-next-line
  }, [Page]);

  useEffect(() => {
    if (Filters) {
      getProducts();
    }
    // eslint-disable-next-line
  }, [Filters]);


  const UpdateFilters = () => {
    const filters = {
      city: document.getElementById("City").value || null,
      currency: document.getElementById("CurrencyFilter").value || null,
      category: document.getElementById("Category").value || null,
      minPrice: document.getElementById("MinPrice").value || null,
      maxPrice: document.getElementById("MaxPrice").value || null,
      page: Page
    };
    setFilters(filters);

  }

  const clearAll = () => {
    const Selects = document.getElementsByTagName("select");
    const Inputs = document.getElementsByTagName("input");
    for (let i of Selects) {
      i.value = "";
    }
    for (let i of Inputs) {
      i.value = "";
    }

    UpdateFilters();
  }
  const CheckMinMax = () => {
    const minInput = document.getElementById("MinPrice");
    const maxInput = document.getElementById("MaxPrice");
    if (+minInput.value > +maxInput.value && maxInput.value) {
      [minInput.value, maxInput.value] = [maxInput.value, minInput.value];
    }
  }

  const Loading = () => {
    if (!isLoaded) {
      return (
        <div className="loader"></div>
      )
    }
  }
  const Pages = () => {
    const buttonsCount = Math.ceil(ProductsLength / MAXPRODUCTS);
    let buttonsArr = [];

    for (let i = 0; i < buttonsCount; i++) {
      buttonsArr[i] = i;
    }

    return (
      <div id="PageButtonsContainer">
        {buttonsArr.map(el => (
          <button key={el} onClick={() => setPage(el)}>{el + 1}</button>
        ))}
      </div>
    );

  }
  const ProductList = () => {
    if (isLoaded && Products) {
      return (
        <>
          <ul id="Products">
            {Products.map(Product => (
              <li key={Product["_id"]} onClick={() => navigate("/Product/" + Product["_id"])}>
                <img id="MyProductPhoto" alt="" src={PHTOTURL + JSON.parse(Product.photos)[0]} />
                <h1>{Product.name}</h1>
                <h1>{Product.cost} {Product.currency}</h1>
                <h2>{Product.city}</h2>
                <h2>{Product.category}</h2>
              </li>
            ))}
            <Pages />
          </ul>
        </>
      )
    }
  }

  return (
    <div id="MainPage">
      {Loading()}
      <div id="FilterDiv">
        <select id="CurrencyFilter" onChange={() => UpdateFilters()}>
          <option value="">Валюта</option>
          <option value="UAH">UAH</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
        <select id="Category" onChange={() => UpdateFilters()}>
          <option value="">Категорія</option>
          <option value="Нерухомість">Нерухомість</option>
          <option value="Авто">Авто</option>
          <option value="Електроніка">Електроніка</option>
          <option value="Спорт">Спорт</option>
          <option value="Дім">Дім</option>
          <option value="Хобі">Хобі</option>
          <option value="Велосипеди">Велосипеди</option>
          <option value="Інше">Інше</option>
        </select>
        <select id="City" onChange={() => UpdateFilters()}>
          <option value="">Місто</option>
          <option value="Київ">Київ</option>
          <option value="Одеса">Одеса</option>
          <option value="Львів">Львів</option>
          <option value="Харків">Харків</option>
          <option value="Інше">Інше</option>
        </select>
        <input id="MinPrice" placeholder="Min"
          onBlur={() => {
            CheckMinMax();
            UpdateFilters();
          }}
          maxLength="10" type="number" />
        <input id="MaxPrice" placeholder="Max"
          onBlur={() => {
            CheckMinMax();
            UpdateFilters();
          }}
          maxLength="10" type="number" />
        <button onClick={() => clearAll()}>Clear</button>
      </div>
      {ProductList()}
    </div>
  )

}