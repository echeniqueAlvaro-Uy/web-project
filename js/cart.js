let cargoCarritoAPI = false
let apiCart = []
let completeCart = []
let idUsuario = localStorage.getItem("usuario")
let subtotalCompra = 0;

let objDatosTarjeta = undefined;
let objDatosTransBancaria = undefined;

// como el usuario actual no se carga en la base de datos, no puede obtenerse desde la API, por lo tanto se usa el ID provisto en la entrega.
idUsuario = 25801;

document.addEventListener("DOMContentLoaded", function(e) {

    if (cargoCarritoAPI) {
        // Obtengo los datos del carrito desde la API
        getJSONData(CART_INFO_URL + idUsuario + EXT_TYPE).then(function(resultObj){
            if (resultObj.status === "ok"){
                apiCart = resultObj.data.articles
            }
            addProductsUserCart(apiCart);
        }) 
    }
    else {
        completeCart = getCart();
        mostrarCarrito(completeCart);
    }
});

function cargarEventos() {

    cargarValidacionForm('formShippingInfo');
    cargarFormaPago();

    for (let radio of document.getElementsByName("shipmentType")) {
        radio.onchange = function() {
            calcularResumenCompra();
        }
    }
}

function cargarFormaPago() {
    document.getElementById('paymentType').innerText = localStorage.getItem('formaPago');
}

function cargarValidacionForm(formName) {
   
    let form = document.getElementById(formName);
    form.addEventListener('submit', function(event) {       
        event.preventDefault();
        if (!form.checkValidity()) {            
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated')
    }, false)
}

function mostrarMensaje(mensaje, permiteCerrar, estilo) {
    let htmlMensaje = '';

    if(permiteCerrar) {
        htmlMensaje = `
            <div class="alert ${estilo} alert-dismissible fade show" role="alert">
                <button id='btnCierreModal' type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <p></p>
                <h4 class="alert-heading">${mensaje}</h4>
                <p></p>
                <p class="mb-0"></p>
            </div>
        `;
    }
    else {
        htmlMensaje = `
            <div class="alert ${estilo} alert-dismissible fade show" role="alert">
                <p></p>
                <h4 class="alert-heading">${mensaje}</h4>
                <p></p>
                <p class="mb-0"></p>
            </div>
        `;
    }
    
    document.getElementById("container-message").innerHTML = htmlMensaje;
    if (permiteCerrar) {
        document.getElementById("btnCierreModal").addEventListener('click', returnHomePage); 
    }
}

function obtenerTipoPagoSeleccionado() {
    // Obtener el tipo de pago desde el value de los controles con name = paymentType
    let formaPagoSeleccionada;
    let seleccion = '';
    let radioChecked = Array.from(
        document.getElementsByName("paymentType")
    ).filter((radio) => radio.checked == true)[0];

    if (radioChecked !== undefined) {
        seleccion = radioChecked.value;
    }

    if (seleccion === PAGO_TARJETA) {
        formaPagoSeleccionada = 'Tarjeta de crédito';
    }
    else if (seleccion === PAGO_BANCO){
        formaPagoSeleccionada = 'Transferencia bancaria';
    }
    else {
        formaPagoSeleccionada = 'No has seleccionado';
    }
    localStorage.setItem('formaPago', formaPagoSeleccionada);
    return seleccion;
}

function desplegarModal() {
    cargarValidacionForm('formPayment');
    cargarDatosFormaPago();
    habilitacionControlesPopUp();
}

function cargarDatosFormaPago() {
    let formaPago = localStorage.getItem('formaPago');
    console.log(formaPago)
    if (formaPago === FORMA_PAGO_TARJETA) {
        document.getElementById('cardRadio').checked = true;
        let datosTarjeta = JSON.parse(localStorage.getItem('objDatosTarjeta'));
        if(datosTarjeta !== null) {
            document.getElementById("cardNumber").value = datosTarjeta.nroTarjetaCredito;
            document.getElementById("secureCode").value = datosTarjeta.codSeg;
            document.getElementById("expireCard").value = datosTarjeta.fechaVenc;
            document.getElementById("numBankAccount").value = '';
        }
    }
    else if (formaPago === FORMA_PAGO_BANCO){
        document.getElementById('bankRadio').checked = true;
        let datosBanco = JSON.parse(localStorage.getItem('objDatosTransBancaria'));
        if(datosBanco !== null) {
            document.getElementById("cardNumber").value = '';
            document.getElementById("secureCode").value = '';
            document.getElementById("expireCard").value = '';
            document.getElementById("numBankAccount").value = datosBanco.nroCuentaBancaria;
        }
    }
}

function habilitacionControlesPopUp() {
    let formaPago = obtenerTipoPagoSeleccionado();
    if (formaPago === PAGO_TARJETA) {
        // Habilito los controles para la carga de datos de la tarjeta de crédito y deshabilito los de transferencia bancaria
        Array.from(
            document.getElementsByClassName("paymentControl")
        ).forEach(function(control) {
            if(control.name === 'creditCard') {
                control.disabled = false;
            }
            else {
                control.disabled = true;
            }
        });
    }
    else if (formaPago === PAGO_BANCO) {
        // Habilito los controles para la carga de datos de transferencia bancaria y deshabilito los de tarjeta de crédito
        Array.from(
            document.getElementsByClassName("paymentControl")
        ).forEach(function(control) {
            if(control.name === 'bankTransfer') {
                control.disabled = false;
            }
            else {
                control.disabled = true;
            }
        });
    }
}

function validaNumericos(event) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
}

function validarFormularioFormaPago() {
    
    let formModal = document.getElementById('formPayment');
    let btnGuardar = document.getElementById('btnGuardarDatosModal');
    
    if (formModal.checkValidity()) {            
        let formaPago = localStorage.getItem('formaPago');
        if (formaPago === FORMA_PAGO_TARJETA) {
            objDatosTarjeta = {
                nroTarjetaCredito : document.getElementById("cardNumber").value,
                codSeg : document.getElementById("secureCode").value,
                fechaVenc : document.getElementById("expireCard").value
            }
            localStorage.setItem('objDatosTarjeta', JSON.stringify(objDatosTarjeta));
        }
        else if (formaPago === FORMA_PAGO_BANCO){
            objDatosTransBancaria = {
                nroCuentaBancaria : document.getElementById("numBankAccount").value
            }
            localStorage.setItem('objDatosTransBancaria', JSON.stringify(objDatosTransBancaria));
        }
        document.getElementById('paymentType').innerText = formaPago;
        const att = document.createAttribute("data-bs-dismiss");
        att.value = "modal";
        btnGuardar.setAttributeNode(att);
    }
    else {
        const attr = btnGuardar.getAttributeNode("data-bs-dismiss");
        if (attr !== null) {
            btnGuardar.removeAttributeNode(attr);
        }
    }
    btnGuardar.dispatchEvent(new Event('onsubmit'));
}

function confirmarCompra() {

    let formPrincipal = document.getElementById('formShippingInfo')
    let mensaje = "Felicitaciones!!!"
    if (validarMetodoPago() && formPrincipal.checkValidity()) {
        // Como la compra fue confirmada vacío el carrito y oculto los controles del form
        vaciarCarrito();
        ocultarControlesForm();
        // Debe llamar a la API al endpoint CART_BUY_URL para obtener la respuesta del intento de compra
        getJSONData(CART_BUY_URL).then(function(resultObj){
            if (resultObj.status === "ok"){
                mensaje += '<br>' + '<hr class="mb-4">' + '<br>' + resultObj.data.msg;
                mostrarMensaje(mensaje, true, 'alert-success');
            }
        })
    }
}

function addProductsUserCart(carro) {

    // Obtengo los productos que el usuario haya agregado a su carrito, independientemente de los que se traigan desde la API
    completeCart = getCart();

    // Controlar que los productos traídos desde la API ya no estén cargados en el carrito almacenado en el local storage
    for(let producto of carro) {
        let prodEncontradoEnCarro = completeCart.find(prod => prod.id == producto.id);
        if(prodEncontradoEnCarro === undefined) {
            let productoNormalizado = {
                id: producto.id,
                name: producto.name,
                count: producto.count,
                image: producto.image,
                currency: producto.currency,
                unitCost: producto.unitCost,
                totalAmount: producto.unitCost * producto.count,
            };
            completeCart.push(productoNormalizado)
        }
    }

    mostrarCarrito(completeCart);
}

function ocultarControlesForm() {
    document.getElementById("container-cart").innerHTML = '';
    document.getElementById("container-summary").innerHTML = '';
    document.getElementById("container-form").innerHTML = '';
}

function mostrarCarrito(carrito) {

    if (carrito === undefined || carrito.length == 0) {
        ocultarControlesForm();
        mostrarMensaje('No hay productos en su carrito', false, 'alert-danger');
    }
    else {
        let htmlContentToAppend = `     
            <div class="row">
                <h3 class="fc-gray fs-1 mb-5">Carrito de Compras</h3>
            </div>
            <div class="row">
                <h3 class="fc-black fs-2 mt-2 mb-3">Articulos a Comprar</h3>
            </div>
        `;

        for(let i = 0; i < carrito.length; i++) {

            let productInCart = carrito[i];

            htmlContentToAppend += `
                <div class="mt-4 mb-2">
                    <div class="row">
                        <div class="col ms-3 left">
                        </div>
                        <div class="col left">
                            <h4 class="mb-1 nombre fw-bold">Nombre</h4>
                        </div>
                        <div class="col right">
                            <h4 class="mb-1 fw-bold">Costo</h4>
                        </div>
                        <div class="col right">
                            <h4 class="mb-1 fw-bold">Cantidad</h4>
                        </div>
                        <div class="col right">
                            <h4 class="mb-1 fw-bold">Subtotal</h4>
                        </div>
                        <div class="col w-25 center">
                        </div>
                    </div>
                    <div class="row itemCarrito">
                        <div onclick="setProdID(${productInCart.id})" class="col left cursor-active ms-3">
                            <img src="${productInCart.image}" alt="${productInCart.description}" class="img-thumbnail">
                        </div>
                        <div class="col left">
                            <h4 class="mb-1 nombre">${productInCart.name}</h4>
                        </div>
                        <div class="col right fontCalibri">
                            <h4 id="amount${productInCart.id}" value="${productInCart.unitCost}">${productInCart.currency} ${formatearMonto(productInCart.unitCost)}</h4>
                        </div>
                        <div class="col right">
                            <input id="quantity${productInCart.id}" onchange="cambiarCantidad(${productInCart.id})" class="quantity" type="number" value="${productInCart.count}" min="1" placeholder="" required=""/>
                        </div>
                        <div class="col right fontCalibri">
                            <h4 id="total${productInCart.id}" class="mb-1 fw-bold">${productInCart.currency} ${formatearMonto(productInCart.totalAmount)}</h4>
                        </div>
                        <div class="col w-25 center">
                            <button id="btnBorrarItemCarrito" onclick='deleteProdInCart(${productInCart.id})' type="button" class="btn btn-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                            </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `

            document.getElementById("container-cart").innerHTML = htmlContentToAppend;
        }

        let htmlSummary = `
            <div class="list-group-item producto">
                <div class="row">
                    <div class="col-2">
                        <div class="d-flex w-100 justify-content-between left">
                            <h4 class="mb-1 fs-5">Subtotal</h4>
                        </div>
                    </div>
                    <div class="col-9 right">
                        <h4 id="monedaCompra" class="mb-1">USD</h4>
                    </div>
                    <div class="col right fontCalibri">
                        <h4 id="subtotalCompra" class="mb-1"></h4>
                    </div>
                </div>
            </div>
            <div class="list-group-item producto">
                <div class="row">
                    <div class="col-2">
                        <div class="d-flex w-100 justify-content-between left">
                            <h4 class="mb-1 fs-5">Costo de envío</h4>
                        </div>
                    </div>
                    <div class="col-9 right">
                        <h4 id="monedaCompra" class="mb-1">USD</h4>
                    </div>
                    <div class="col right fontCalibri">
                        <h4 id="costoEnvio" class="mb-1"></h4>
                    </div>
                </div>
            </div>
            <div class="mb-5 list-group-item producto">
                <div class="row">
                    <div class="col-2">
                        <div class="d-flex w-100 justify-content-between left text-success">
                            <h4 class="mb-1 fs-5 fw-bold">Total (USD)</h4>
                        </div>
                    </div>
                    <div class="col-9 text-success right">
                        <h4 id="monedaCompra" class="mb-1 fw-bold">USD</h4>
                    </div>
                    <div class="col text-success right fontCalibri">
                        <h4 id="totalCompra" class="mb-1 fw-bold"></h4>
                    </div>
                </div>
            </div>
        `;
        document.getElementById("container-summary").innerHTML = htmlSummary;
        cargarEventos();
        calcularResumenCompra();
    }
}

function formatearMonto(monto) {
    return new Intl.NumberFormat('en-IN').format(monto);
}

function deleteProdInCart(idProducto) {
    let prod = completeCart.find(p => p.id == idProducto);
    let index = completeCart.indexOf(prod);
    if (completeCart.length > 1) {
        completeCart.splice(index, 1);
    }
    else {
        completeCart = [];
    }
    
    setCart(completeCart);
    mostrarCarrito(completeCart);
}

function cambiarCantidad(prodId) {

    let cantidad = parseInt(document.getElementById('quantity'+prodId).value);
    let productInCart = completeCart.find(p => p.id == prodId);
    if(productInCart !== undefined) {
        productInCart.count = cantidad
        let moneda = productInCart.currency
        let monto = productInCart.unitCost
        productInCart.totalAmount = cantidad * monto;
        let importeTotal = productInCart.totalAmount;
        document.getElementById('total'+prodId).innerHTML = moneda + ' ' + formatearMonto(importeTotal);
        setCart(completeCart);
    }
    calcularResumenCompra();
}

function calcularResumenCompra() {

    subtotalCompra = 0;
    completeCart.forEach(function(producto) {
        if(producto.currency === 'UYU') {
            subtotalCompra += parseInt(producto.totalAmount / DOLLAR_PRICE);
        }
        else {
            subtotalCompra += producto.totalAmount;
        }
    });

    let tasaEnvio = Array.from(
        document.getElementsByName("shipmentType")
    ).filter((radio) => radio.checked == true)[0].value;

    let costoEnvio = parseInt(subtotalCompra * tasaEnvio/100);
    let totalCompra = subtotalCompra + costoEnvio;
    document.getElementById('subtotalCompra').innerHTML = formatearMonto(subtotalCompra);
    document.getElementById('costoEnvio').innerHTML = formatearMonto(costoEnvio);
    document.getElementById('totalCompra').innerHTML = formatearMonto(totalCompra);
}

function validarMetodoPago() {

    let panel = document.getElementById('container-payment');
    let eleccionDePago = document.getElementById('paymentType').innerText
    let errorMedioDePago = 'Debe seleccionar una forma de pago'
    let error = document.getElementById('mgsError')

    if(eleccionDePago === "No has seleccionado") {
        error.style.color = 'red';
        panel.style.borderColor = 'red';
        error.innerHTML = errorMedioDePago
        return false;
    }
    else {
        panel.style.borderColor = 'gray';
        error.innerHTML = ''
        return true;
    }
}