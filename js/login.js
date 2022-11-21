
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formLogin").addEventListener('submit', validarFormulario); 
});

function validarFormulario(evento) {
 
  let mail= document.getElementById('mi-email').value;
  let password= document.getElementById('mi-contraseña').value;
  let error= document.getElementById('error')
  let errorMail = 'No has escrito nada en el email'
  let errorPass = 'La contraseña no es válida'
  let mensajesDeError= [];
  evento.preventDefault();

  if(mail === "") {
    mensajesDeError.push(errorMail);
  }

  if (password.length < 6) {
    mensajesDeError.push(errorPass);
  }

  if (mensajesDeError.length > 0) {
    error.style.color = 'red';
    error.innerHTML = '<p>' + mensajesDeError.join(' , ') + '</p>'
  }
  else {
    localStorage.setItem("usuario", mail);
    if(recuperarUsuario(mail) === undefined)
    {
      let nuevoUsuario = {
        documento : '',
        primerNombre : '',
        segundoNombre : '',
        primerApellido : '',
        segundoApellido : '',
        telefono : '',
        avatar : '',
        email : mail,
        ig_account : '',
        in_account : ''
      }
      agregarUsuario(nuevoUsuario)
    }
    window.location.href = 'index1.html';
  }
}

function handleCredentialResponse(respuesta) {
  // respuesta es un json que hay que procesarlo
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  
  const responsePayload = JSON.parse(decodeJwtResponse(respuesta.credential));
  //console.log(responsePayload)

  localStorage.setItem("usuario", responsePayload.email);
  if(recuperarUsuario(responsePayload.email) === undefined)
  {
    let nuevoUsuario = {
      documento : '',
      primerNombre : responsePayload.given_name,
      segundoNombre : '',
      primerApellido : responsePayload.family_name,
      segundoApellido : '',
      telefono : '',
      avatar : responsePayload.picture,
      email : responsePayload.email,
      ig_account : '@' + responsePayload.family_name + '.' + responsePayload.given_name,
      in_account : responsePayload.family_name + '-' + responsePayload.given_name
    }
    agregarUsuario(nuevoUsuario)
  }
  window.location.href = 'index1.html';
}

function decodeJwtResponse(credencial) {
  let payload = atob(credencial.split('.')[1]);
  return payload;
}