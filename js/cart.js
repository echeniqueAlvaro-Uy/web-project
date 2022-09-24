
document.addEventListener("DOMContentLoaded", function(e) {

    let productsInCart = getCart();
    let htmlContentToAppend = '<h3 class="fc-gray">Carrito de Compras</h3>';
    
    for(let i = 0; i < productsInCart.length; i++) {
        let product = productsInCart[i];
        htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="w-100 left mb-5">
                <div class="row">
                    <div class="w-100 left">
                        <img src="${product.images[0]}" alt="${product.name}" class="img-thumbnail w-50 mt-4 me-3">
                    </div>
                </div>
                <div class="row">
                    <div class="mt-1">
                        <h4 class="mb-1 me-4 name">${product.name}</h4>
                    </div>
                </div>
            </div>
        `
    }
    document.getElementById("dataCart").innerHTML += htmlContentToAppend;

});