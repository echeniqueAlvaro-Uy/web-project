/*
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

});
*/

let categoriesArray = [];

document.addEventListener("DOMContentLoaded", function() {

    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            categoriesArray = resultObj.data
            showTop3Categories()
        }
    });

});

function showTop3Categories(){

    let htmlContentToAppend = "";
    for(let i = 0; i <= 2; i++){
        let category = categoriesArray[i];

        htmlContentToAppend += `
        <div class="col-md-4">
            <div id="itemCategory${category.id}" class="card mb-4 shadow-sm custom-card cursor-active">
                <img class="bd-placeholder-img card-img-top" src="${category.imgSrc}"
                alt="Imagen representativa de la categoría '${category.name}'">
                <h3 class="m-3">${category.name}</h3>
                <div class="card-body">
                <p class="card-text">${category.description}</p>
                </div>
            </div>
        </div>
        `    

        document.getElementById("panelCategories").innerHTML = htmlContentToAppend;
    }

    for(let i = 0; i <= 2; i++) {
        let category = categoriesArray[i];
        document.getElementById("itemCategory"+category.id).addEventListener('click', () => setCat(JSON.stringify(category)));
    }
}