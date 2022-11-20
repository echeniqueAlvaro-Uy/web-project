let DOMINIO = 'https://japceibal.github.io/emercado-api/';

// Descomentar la línea de abajo si se quiere ir contra la API en servidor node local
//DOMINIO = 'http:localhost:3000/'

const CATEGORIES_URL = DOMINIO + 'cats/cat.json';
const PUBLISH_PRODUCT_URL = DOMINIO + 'sell/publish.json';
const PRODUCTS_URL = DOMINIO + 'cats_products/';
const PRODUCT_INFO_URL = DOMINIO + 'products/';
const PRODUCT_INFO_COMMENTS_URL = DOMINIO + 'products_comments/';
const CART_INFO_URL = DOMINIO + 'user_cart/';
const CART_BUY_URL = DOMINIO + 'cart/buy.json';
const USER_PROFILE = DOMINIO + 'profile/';

const EXT_TYPE = ".json";
const DOLLAR_PRICE = 40.0;
const PAGO_TARJETA = 'tarjeta';
const PAGO_BANCO = 'banco';
const FORMA_PAGO_TARJETA = 'Tarjeta de crédito';
const FORMA_PAGO_BANCO = 'Transferencia bancaria';
const FORMA_PAGO_DEFAULT = 'No has seleccionado';

let usuario = localStorage.getItem("usuario");

if (localStorage.getItem('formaPago') === null) {
  localStorage.setItem('formaPago', FORMA_PAGO_DEFAULT);
}

function cerrar() {
  limpiarRegistrosDelLocalStorage();  
  window.location.href = 'index.html';
}

function limpiarRegistrosDelLocalStorage() {
  //localStorage.clear();
  localStorage.removeItem("usuario");
  localStorage.removeItem("productsInCart");
}

function cargarMenu() {
  let htmlContentToAppend =
    `
    <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    ` +
    usuario +
    `
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a id="link-carrito" class="dropdown-item" href="cart.html">Mi Carrito</a></li>
    <li><a id="link-perfil" class="dropdown-item" href="my-profile.html">Mi Perfil</a></li>
    <li><a id="link-logout" class="dropdown-item" href="#">Cerrar Sesión</a></li>
    </ul>
    `;
  document.getElementById("perfil").innerHTML = htmlContentToAppend;
  document.getElementById("link-logout").addEventListener("click", () => cerrar());
}

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  console.log('URL: ' + url)
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

document.addEventListener("DOMContentLoaded", function () {
  cargarMenu();
});

function setProdID(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
}

function setCat(category) {
  localStorage.setItem("category", category);
  let id = JSON.parse(category).id;
  setCatID(id);
}

function setCatID(id) {
  localStorage.setItem("catID", id);
  window.location = "products.html";
}

function getCart() {
  let cart = localStorage.getItem("productsInCart");
  if(cart == null) {
    cart = [];
    setCart(cart);
    return cart;
  }
  else {
    return JSON.parse(cart);
  }
}

function setCart(carrito) {
  localStorage.setItem("productsInCart", JSON.stringify(carrito));
}

function vaciarCarrito() {
  localStorage.removeItem("productsInCart");
}

function returnHomePage() {
  window.location = "index1.html"
}