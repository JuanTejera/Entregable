var allProducts = [];

function replaceUrl(url) {
    return url.replace(/%20|\+/g, "&");; //Para cambiar el '%20' por &
}


function getQueryVariable(variable) {
    let nombre = "";
    var query = replaceUrl(window.location.search).substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            nombre += pair[1] + " ";
        } else {
            nombre += pair[0] + " ";
        }
    }
    return nombre;
}

function showImagesGallery(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        if (i == 0) {                             //Si es la primera imagen crea un div con class "active"
            htmlContentToAppend += ` 
            <div class="carousel-item active">
                <img class="d-block w-100" src="` + array[i] + `" > 
            </div> 
            `
        } else {                                 
            htmlContentToAppend += `
            <div class="carousel-item">
                <img class="d-block w-100" src="` + array[i] + `">
            </div>
            `
        }
    }
    document.getElementById("Caruzel").innerHTML = htmlContentToAppend;
}


function showInfo(producto) {
    let htmlContentToAppend = "";
    let nombreProducto = getQueryVariable("name");

    htmlContentToAppend += `
    <div class="card">
	    <div class="row">
		    <aside class="col-sm-5 border-right">
                <article class="gallery-wrap">
                    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner" id="Caruzel">
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                </article> <!-- gallery-wrap .end// -->
            </aside>
            <aside class="col-sm-7">
                <article class="card-body p-5">
                    <h3 class="title mb-3">`+ nombreProducto + `</h3>
                    <p class="price-detail-wrap"> 
                        <span class="price h3 text-warning"> 
                            <span class="currency">`+ producto.currency + ` $</span><span class="num">` + producto.cost + `</span>
                        </span> 
                    </p> <!-- price-detail-wrap .// -->
                    <dl class="item-property">
                        <dt>Descripción: </dt>
                        <dd><p>`+ producto.description + `</p></dd>
                    </dl>
                    <a href="#" class="btn btn-lg btn-primary text-uppercase"> Comprar </a>
                    <small>`+ producto.soldCount + ` vendidos</small>
                </article> <!-- card-body.// -->
            </aside> <!-- col.// -->
        </div> <!-- row.// -->
    </div> <!-- card.// -->
    <br><br><br>
    `
    document.getElementById("containerPrincipal").innerHTML = htmlContentToAppend;
}

function showRelatedProducts(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let indexRelatedProduct = array[i]; //Devuelve el indice que le corresponde al producto en el array
        let producto = allProducts[indexRelatedProduct];
        htmlContentToAppend += `
        <div class="col-md-4 mb-4">
        <a id="prodRelA" href="product-info.html?name=`+ producto.name + `" >
            <div class="card h-100 border-0">
                <div class="card-img-top">
                    <img src="`+ producto.imgSrc + `" class="img-fluid mx-auto d-block" alt="` + producto.name + `">
                </div>
                <div class="card-body text-center">
                    <h4 class="card-title">
                        <p class=" font-weight-bold text-dark text-uppercase small"> `+ producto.name + `</p>
                    </h4>
                    <h5 class="card-price small text-warning">
                        <i>`+ producto.cost + ` ` + producto.currency + `</i>
                    </h5>
                    <p> `+ producto.description + `</p>
                </div>
            </div>
        </a>
        </div>
        `
    }
    document.getElementById("prodRel").innerHTML = htmlContentToAppend;
}

function showStars(rate) {
    let htmlContentToAppend = "";
    for (let i = 1; i <= rate; i++) {
        htmlContentToAppend += ` <span class="fa fa-star checked"></span> `
    }
    while (rate < 5) {
        htmlContentToAppend += ` <span class="fa fa-star"></span> `
        rate++;
    }
}

function showUserComent() {
    nombreUsuario = JSON.parse(sessionStorage.getItem("usuarioActual"));
    let htmlContentToAppend = "";
    htmlContentToAppend += `
    <h6 class="font-medium">`+ nombreUsuario.email + `</h6>
    `
    document.getElementById("nombreComentador").innerHTML = htmlContentToAppend;
}

function showComments(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        comentario = array[i];
        htmlContentToAppend += `
        <div class="d-flex flex-row comment-row m-t-0">
            <div class="p-2"><img src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="user" width="50" class="rounded-circle"></div>
                <div class="comment-text w-100">
                    <h6 class="font-medium">`+ comentario.user + `</h6> <span class="m-b-15 d-block">` + comentario.description + `</span>
                    <div class="comment-footer"><span id="estrellas" class="text-muted float-left">Puntuación:  `+ comentario.score + `/5</span> <span class="text-muted float-right">` + comentario.dateTime + `</span></div>
                </div>
            </div>
        `

    }
    document.getElementById("ComBox").innerHTML = htmlContentToAppend;
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    showSpinner();
    getJSONData(PRODUCTS_URL).then(function (resultObj) { //Asigna el objeto con todos los productos a allProducts 
        if (resultObj.status === "ok") {
            allProducts = resultObj.data;
        }
        getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                showInfo(resultObj.data);
                showImagesGallery(resultObj.data.images);
                showRelatedProducts(resultObj.data.relatedProducts);
            }
        });
        getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                showComments(resultObj.data);
                showUserComent();
                hideSpinner();
            }
        });
    });
});