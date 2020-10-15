var categoriesArray = [];
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_PROD_BY_COUNT = "Cant.";
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;



function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_PROD_BY_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showCategoriesList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let category = array[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(category.cost) >= minPrice)) && //Implementa el rango de precios
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(category.cost) <= maxPrice))){
        htmlContentToAppend += `
        <a class="list-group-item list-group-item-action" href="product-info.html?name=`+ category.name +`">
            <div class="row">
                <div class="col-3">
                    <img src="` + category.imgSrc + `" alt="` + category.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <h4 class="mb-1">`+ category.name +`</h4>
                    <div class="unidVend"><p id="noVendidos">` + category.soldCount + ` unidades vendidas!</p></div>
                    <p>` + category.description + `</p>
                    <h2 class="col-lg-4 col-md-6 plata">` + category.cost + `<span>` + category.currency + `</span></h2>
                </div>
            </div>
        </a>
        `
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }
    categoriesArray = sortCategories(currentSortCriteria, categoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList(categoriesArray);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    showSpinner();
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
            hideSpinner();
        }
        document.getElementById("sortAsc").addEventListener("click", function(){ //Implementa el orden ascendente por precios
            sortAndShowCategories(ORDER_ASC_BY_NAME,resultObj.data);
        });

        document.getElementById("sortDesc").addEventListener("click", function(){ //Implementa el orden descendente por precios
            sortAndShowCategories(ORDER_DESC_BY_NAME,resultObj.data);
        });

        document.getElementById("sortByRelevance").addEventListener("click", function(){
            sortAndShowCategories(ORDER_PROD_BY_COUNT,resultObj.data);
        });

        document.getElementById("clearRangeFilter").addEventListener("click", function(){ //Implementa el boton "limpiar".
            document.getElementById("rangeFilterCountMin").value = "";
            document.getElementById("rangeFilterCountMax").value = "";

            minPrice = undefined;
            maxPrice = undefined;

            showCategoriesList(resultObj.data);
        });

        document.getElementById("rangeFilterCount").addEventListener("click", function(){ //Implementa el rango de precio
            //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
            minPrice = document.getElementById("rangeFilterCountMin").value;
            maxPrice = document.getElementById("rangeFilterCountMax").value;

            if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
                minPrice = parseInt(minPrice);
            }
            else{
                minPrice = undefined;
            }

            if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
                maxPrice = parseInt(maxPrice);
            }
            else{
                maxPrice = undefined;
            }
            showCategoriesList(resultObj.data);
        });
});
});