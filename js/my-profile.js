let dataUser = undefined

document.addEventListener("DOMContentLoaded", function(e){
    let usuario = localStorage.getItem("usuario")

    // Traer info del usuario
    /*
    getJSONData(USER_PROFILE + usuario + '.json').then(function(resultObj){
        if (resultObj.status === "ok"){
            dataUser = resultObj.data
            mostrarPerfilUsuario(dataUser)
        }
    });
    */
    dataUser = {
        name: 'Juan',
        surname: 'Lopez',
        age: 38,
        email: usuario,
        bio: '"Juan Lopez is a creator of minimalistic x bold graphics and digital artwork."',
        image: 'img/profile1.jpg',
        ig_account: '@jlopez58',
        in_account: 'j-lopez58'
    }
    mostrarPerfilUsuario(dataUser);
});

function mostrarPerfilUsuario(user) {
    let htmlContentToAppend = `
        <div class="col cardProduct center bg-dark">
            <img src="${user.image}" width="150" class="rounded-circle mt-4">
            <div class="cardProduct-info">
                <p class="cardProduct-title text-white">${user.name} ${user.surname}</p>
                <p class="cardProduct-body text-white-50">${user.email}</p>
                <p class="cardProduct-bio mt-4 mb-4">${user.bio}</p>
            </div>
            <button class="btn btn-light mt-2 mb-4">Editar Perfil</button>
            <div class="cardProduct-footer mb-4 center">
                <div class="row d-flex w-100 justify-content-between">
                    <div class="col left bg-dark">
                        <i class="fa fa-instagram instagram"></i>
                    </div>
                    <div class="col right"> 
                        <i class="fa fa-linkedin linkedin"></i>
                    </div>
                </div>             
                <div class="row d-flex w-100 justify-content-between">
                    <div class="col left bg-dark">
                        <span class="socialNetwork">${user.ig_account}</span>
                    </div>
                    <div class="col right"> 
                        <span class="socialNetwork">${user.in_account}</span>
                    </div>
                </div> 
            </div>
        </div>
    `;
    document.getElementById("profile").innerHTML = htmlContentToAppend; 
}