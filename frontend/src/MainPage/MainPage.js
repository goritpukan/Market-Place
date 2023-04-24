import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

export default function MainPage(props) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [productsLength, setProductsLength] = useState(0);

  const PHTOTURL = "http://localhost:4001/api/images/ProductImage/";
  const AVATARURL = "http://localhost:4001/api/images/avatar/";
  const MAXPRODUCTS = 10;

  const getProducts = () => {
    setIsLoaded(false);
    fetch("http://localhost:4001/api/products/GetProducts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(filters)
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
    updateFilters();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilters({
      ...filters,
      page: page
    });

    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (filters) {
      getProducts();
    }
    // eslint-disable-next-line
  }, [filters]);


  const updateFilters = () => {
    const filters = {
      city: document.getElementById("City").value || null,
      currency: document.getElementById("CurrencyFilter").value || null,
      category: document.getElementById("Category").value || null,
      minPrice: document.getElementById("MinPrice").value || null,
      maxPrice: document.getElementById("MaxPrice").value || null,
      name: document.querySelector("#Search input").value || null,
      page: page
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

    updateFilters();
  }

  const checkMinMax = () => {
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
    const buttonsCount = Math.ceil(productsLength / MAXPRODUCTS);
    let buttonsArr = [];

    for (let i = 0; i < buttonsCount; i++) {
      if (i > 8) {
        buttonsArr[i] = buttonsCount - 1;
        break;
      }
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
    if (isLoaded && products) {
      return (
        <>
          <ul id="Products">
            {products.map(Product => (
              <li key={Product["_id"]} onClick={() => navigate("/Product/" + Product["_id"])}>
                <img id="MyProductPhoto" alt="" src={PHTOTURL + JSON.parse(Product.photos)[0]} />
                <h1>{Product.name}</h1>
                <h1>{Product.cost} {Product.currency}</h1>
                <h1>{Product.city}</h1>
                <h1>{Product.category}</h1>
                <div className="OwnerInfo">
                  <h1>{JSON.parse(Product.owner).email}</h1>
                  <h1>{JSON.parse(Product.owner).nickname}</h1>
                  <img src={AVATARURL + JSON.parse(Product.owner).avatar}></img>
                </div>
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
      <Loading />
      <div id="FilterDiv">
        <select id="CurrencyFilter" onChange={() => updateFilters()}>
          <option value="">Валюта</option>
          <option value="UAH">UAH</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
        <select id="Category" onChange={() => updateFilters()}>
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
        <select id="City" onChange={() => updateFilters()}>
          <option value="">Місто</option>
          <option value="Київ">Київ</option>
          <option value="Одеса">Одеса</option>
          <option value="Львів">Львів</option>
          <option value="Харків">Харків</option>
          <option value="Інше">Інше</option>
        </select>
        <input id="MinPrice" placeholder="Min"
          onBlur={() => {
            checkMinMax();
            updateFilters();
          }}
          maxLength="10" type="number" />
        <input id="MaxPrice" placeholder="Max"
          onBlur={() => {
            checkMinMax();
            updateFilters();
          }}
          maxLength="10" type="number" />
        <div id="Search">
          <input type="text" onBlur={() => updateFilters()} />
        </div>
        <button onClick={() => clearAll()}>Clear</button>
      </div>
      <ProductList />
    </div>
  )

}