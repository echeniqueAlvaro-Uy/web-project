let apiCart = []
let completeCart = []
let idUsuario = localStorage.getItem("usuario")
// como el usuario actual no se carga en la base de datos, no puede obtenerse desde la API, por lo tanto se usa el ID provisto en la entrega.
idUsuario = 25801;

document.addEventListener("DOMContentLoaded", function(e) {

    // Obtengo los datos del carrito desde la API
    getJSONData(CART_INFO_URL + idUsuario + '.json').then(function(resultObj){
        if (resultObj.status === "ok"){
            apiCart = resultObj.data.articles
        }
        addProductsUserCart(apiCart);
    })
});

function addProductsUserCart(carro) {

    // Obtengo los productos que el usuario haya agregado a su carrito, independientemente de los que se traigan desde la API
    let productsInUserCart = getCart();
    
    // Agrago los productos del carrito del usuario a los traídos desde la API
    completeCart = carro.concat(productsInUserCart);
    mostrarCarrito(completeCart);
}

function mostrarCarrito(carrito) {

    let htmlContentToAppend = `
        
        <div class="row">
            <h3 class="fc-gray fs-1 mb-3">Carrito de Compras</h3>
        </div>
        <div class="row">
            <h3 class="fc-black fs-2 mt-2">Articulos a Comprar</h3>
        </div>
    `;

    for(let i = 0; i < carrito.length; i++) {

        let productInCart = carrito[i]
        htmlContentToAppend += `
        <div class="mt-4 mb-5">
            <div class="row">
                <div class="col left pe-3">
                </div>
                <div class="col left">
                    <h4 class="mb-1 nombre fw-bold">Nombre</h4>
                </div>
                <div class="col ms-5 left">
                    <h4 class="mb-1 fw-bold">Costo</h4>
                </div>
                <div class="col left">
                    <h4 class="mb-1 fw-bold">Cantidad</h4>
                </div>
                <div class="col left">
                    <h4 class="mb-1 fw-bold">Subtotal</h4>
                </div>
            </div>
            <div class="row itemCarrito">
                <div onclick="setProdID(${productInCart.id})" class="col left cursor-active me-3">
                    <img src="${productInCart.image != undefined ? productInCart.image : productInCart.images[0]}" alt="${productInCart.description}" class="img-thumbnail">
                </div>
                <div class="col left">
                    <h4 class="mb-1">${productInCart.name}</h4>
                </div>
                <div class="col ms-5 left">
                    <h4 id="amount${i+1}" value="${productInCart.unitCost != undefined ? productInCart.unitCost : productInCart.cost}">${productInCart.currency} ${productInCart.unitCost != undefined ? productInCart.unitCost : productInCart.cost}</h4>
                </div>
                <div class="col left">
                    <input id="quantity${i+1}" onchange="changeQuantity(${i+1})" class="quantity" type="number" value="1"/>
                </div>
                <div class="col left">
                    <h4 id="total${i+1}" class="mb-1 fw-bold">${productInCart.currency} ${productInCart.unitCost != undefined ? productInCart.unitCost : productInCart.cost}</h4>
                </div>
            </div>
        </div>
        `
        document.getElementById("container-cart").innerHTML = htmlContentToAppend;
    }
}

function changeQuantity(index) {

    console.log('index: ' + index);
    let amount = document.getElementById('amount'+index).value;
    console.log('amount: ' + amount);
    let quantity = parseInt(document.getElementById('quantity'+index).value);
    console.log('quantity: ' + quantity);
    let total = amount * quantity;
    console.log('total: ' + total);

    document.getElementById('total'+index).value = total;
    document.getElementById('total'+index).text = total;
}

