
function setDominio(entornoLocal) {
  if(entornoLocal) {
    localStorage.setItem("dominio", 'http://localhost:4000/');
  }
  else {
    localStorage.setItem("dominio", 'https://japceibal.github.io/emercado-api/');
  }
}

function getDOMINIO() {
  return localStorage.getItem("dominio");
}

function entornoLocal() {
  return localStorage.getItem("dominio") === 'http://localhost:4000/';
}