import React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../App";
import "./MainPage.css";

import ProductList from "./ProductList";

export default function MainPage(props) {

  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [productsLength, setProductsLength] = useState(0);

  const { theme } = useContext(ThemeContext);

  const prevFiltersRef = useRef({});
  const filtersRef = useRef({});


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
    if (JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current)) {
      getProducts();
    }
    // eslint-disable-next-line
  }, [filters]);


  const updateFilters = () => {
    prevFiltersRef.current = filters;
    const _filters = {
      city: filtersRef.current.city.value || null,
      currency: filtersRef.current.currency.value || null,
      category: filtersRef.current.category.value || null,
      minPrice: filtersRef.current.minPrice.value || null,
      maxPrice: filtersRef.current.maxPrice.value || null,
      name: filtersRef.current.name.value || null,
      page: page
    };
    setFilters(_filters);

  }

  const clearAll = () => {
    for (let i in filtersRef.current) {
      filtersRef.current[i].value = "";
    }
    updateFilters();
  }

  const checkMinMax = () => {
    const minInput = filtersRef.current.minPrice;
    const maxInput = filtersRef.current.maxPrice;
    if (+minInput.value > +maxInput.value && maxInput.value) {
      [minInput.value, maxInput.value] = [maxInput.value, minInput.value];
    }
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      updateFilters();
    }
  }

  const handleFocus = () => {
    filtersRef.current.name.addEventListener("keydown", handleKeyDown);
  }

  const handleBlur = () => {
    updateFilters();
    filtersRef.current.name.removeEventListener("keydown", handleKeyDown);
  }

  const Loading = () => {
    if (!isLoaded) {
      return (
        <div className="loader"></div>
      )
    }
  }



  return (
    <div className="main-page" id={theme}>
      <Loading />
      <div className="filter-div">
        <div className="selects">
          <select className="currency-filter"
            onChange={() => updateFilters()}
            ref={el => filtersRef.current.currency = el}>
            <option value="">Валюта</option>
            <option value="UAH">UAH</option>
            <option value="$">$</option>
            <option value="€">€</option>
          </select>
          <select className="category"
            onChange={() => updateFilters()}
            ref={el => filtersRef.current.category = el}>
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
          <select className="city"
            onChange={() => updateFilters()}
            ref={el => filtersRef.current.city = el}>
            <option value="">Місто</option>
            <option value="Київ">Київ</option>
            <option value="Одеса">Одеса</option>
            <option value="Львів">Львів</option>
            <option value="Харків">Харків</option>
            <option value="Інше">Інше</option>
          </select>
        </div>
        <div>
          <input className="min-price"
            placeholder="Min"
            ref={el => filtersRef.current.minPrice = el}
            onBlur={() => {
              checkMinMax();
              updateFilters();
            }}
            maxLength="10" type="number" />
          <input className="max-price"
            placeholder="Max"
            ref={el => filtersRef.current.maxPrice = el}
            onBlur={() => {
              checkMinMax();
              updateFilters();
            }}
            maxLength="10" type="number" />
        </div>
        <div className="search">
          <input type="text"
            ref={el => filtersRef.current.name = el}
            onBlur={() => handleBlur()}
            onFocus={() => handleFocus()} />
        </div>
        <button onClick={() => clearAll()}>Clear</button>
      </div>
      <ProductList
        isLoaded={isLoaded}
        products={products}
        setPage={setPage}
        productsLength={productsLength} />
    </div>
  )

}