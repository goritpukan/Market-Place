import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

export default function MainPage(props) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [productsLength, setProductsLength] = useState(0);

  const prevFiltersRef = useRef({});
  const filtersRef = useRef({});

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
              <li key={Product["_id"]} onClick={() => navigate("/product/" + Product["_id"])}>
                <img id="MyProductPhoto" alt="" src={PHTOTURL + JSON.parse(Product.photos)[0]} />
                <h1>{Product.name}</h1>
                <h1>{Product.cost} {Product.currency}</h1>
                <h1>{Product.city}</h1>
                <h1>{Product.category}</h1>
                <div className="OwnerInfo">
                  <h1>{JSON.parse(Product.owner).email}</h1>
                  <h1>{JSON.parse(Product.owner).nickname}</h1>
                  <img alt="" src={AVATARURL + JSON.parse(Product.owner).avatar}></img>
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
        <select id="CurrencyFilter"
          onChange={() => updateFilters()}
          ref={el => filtersRef.current.currency = el}>
          <option value="">Валюта</option>
          <option value="UAH">UAH</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
        <select id="Category"
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
        <select id="City"
          onChange={() => updateFilters()}
          ref={el => filtersRef.current.city = el}>
          <option value="">Місто</option>
          <option value="Київ">Київ</option>
          <option value="Одеса">Одеса</option>
          <option value="Львів">Львів</option>
          <option value="Харків">Харків</option>
          <option value="Інше">Інше</option>
        </select>
        <input id="MinPrice"
          placeholder="Min"
          ref={el => filtersRef.current.minPrice = el}
          onBlur={() => {
            checkMinMax();
            updateFilters();
          }}
          maxLength="10" type="number" />
        <input id="MaxPrice"
          placeholder="Max"
          ref={el => filtersRef.current.maxPrice = el}
          onBlur={() => {
            checkMinMax();
            updateFilters();
          }}
          maxLength="10" type="number" />
        <div id="Search">
          <input type="text"
            ref={el => filtersRef.current.name = el}
            onBlur={() => handleBlur()}
            onFocus={() => handleFocus()} />
        </div>
        <button onClick={() => clearAll()}>Clear</button>
      </div>
      <ProductList />
    </div>
  )

}