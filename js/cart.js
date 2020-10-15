var msg = "";
var subTotal = 0;


function redirect() {
    window.location.href = "index.html";
}


//Verifica que se hayan selecionado metodo de pago y de envío y redirecciona si corresponde
function verifyChecked() {
    let payMethodSelected = false;
    let deliveryMethodSelected = false;
    payMethodSelected = (document.getElementById("credit-card").checked || document.getElementById("transfer").checked);
    deliveryMethodSelected = (document.getElementById("std-method").checked || document.getElementById("premium-method").checked || document.getElementById("express-method").checked);

    if (payMethodSelected && deliveryMethodSelected) {
        htmlContentToAppend = "";
        htmlContentToAppend = `
        <div style="position:absolute; width: 50%;margin: 0 auto;text-align: center;background-color: LightGreen;" class="ibox-content">`+ msg + `</div>
        `
        document.getElementById("messagePlace").innerHTML = htmlContentToAppend;
        setTimeout("redirect()", 2000);
    } else {

        if (!payMethodSelected) {
            document.getElementById("pagoSelect").style.color = "#ff8080";
        } else { document.getElementById("pagoSelect").style.color = "#000000"; }

        if (!deliveryMethodSelected) {
            document.getElementById("envioSelect").style.color = "#ff8080";
        } else { document.getElementById("envioSelect").style.color = "#000000"; }
    }

}

function showItems(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        subTotal += array[i].count * array[i].unitCost;
        htmlContentToAppend += `
        <div class="ibox-content">
                    <div class="table-responsive">
                        <table class="table shoping-cart-table">
                            <tbody>
                            <tr>
                                <td width="90">
                                        <img src="`+ array[i].src + `">
                                    </div>
                                </td>
                                <td class="desc" width="auto">
                                    <h3> `+ array[i].name + `</h3>
                                </td>
                                <td id="priceUnit`+ i + `">
                                    $`+ array[i].unitCost + ` <span class="text-muted">` + array[i].currency + ` c/u.</span>
                                </td>
                                <td width="auto">
                                <div class="m-t-sm">
                                    <div class="qty mt-5" style="display: inline">
                                        <span>Cantidad: </span>
                                        <span  class="minus bg-dark" id="btnMinus`+ i + `">-</span>
                                        <input id="valueProd`+ i + `"type="number" class="count" name="qty"  value="` + array[i].count + `">
                                        <span  class="plus bg-dark" id="btnPlus`+ i + `">+</span>
                                    </div>
                                </div>
                                </td>
                                <td>
                                    <h4 id="sumPriceUnit">
                                        <span class="text-muted" id="sumPrice`+ i + `">$` + array[i].count * array[i].unitCost + `</span>
                                    </h4>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        `

    }
    document.getElementById("cartArticles").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL).then(function (resultObj) {
        let articulos = resultObj.data.articles;
        if (resultObj.status === "ok") {
            showItems(articulos);
            document.getElementById("subTotalPrice").innerHTML = `$` + subTotal;
        }

        function changeSubTotal(){
            newSubTotal = 0;
            for (let i = 0; i < articulos.length; i++) {
                newSubTotal += parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
            }
            document.getElementById("subTotalPrice").innerHTML = `$` + newSubTotal;
        }

        for (let i = 0; i < articulos.length; i++) {


            document.getElementById("btnMinus" + i).addEventListener("click", function () {      //Implementa la funcionalidad del boton - (Min 1 producto)
                var value = document.getElementById("valueProd" + i).value;
                if (value > 1) {
                    value -= 1;
                    document.getElementById("valueProd" + i).value--;
                    tot = parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
                    document.getElementById("sumPrice" + i).innerHTML = "$" + tot;
                    changeSubTotal()
                }
            })

            document.getElementById("btnPlus" + i).addEventListener("click", function () {      //Implementa la funcionalidad del boton + 
                document.getElementById("valueProd" + i).value++;
                tot = parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
                document.getElementById("sumPrice" + i).innerHTML = "$" + tot;
                changeSubTotal();

            })

            document.getElementById("valueProd" + i).addEventListener("keyup", function () {            //Implementa poder digitar la cant de articulos en tiempo real 
                if (parseInt(document.getElementById("valueProd" + i).value) < 1){ document.getElementById("valueProd" + i).value = 1 }
                tot = parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
                document.getElementById("sumPrice" + i).innerHTML = "$" + tot;
                changeSubTotal();
            })
        }


        document.querySelector("body > nav ").remove();
        getJSONData(CART_BUY_URL).then(function (resultObj) {        //Borra el navBar
            if (resultObj.status === "ok") {
                msg = resultObj.data.msg;
            }
        });
    });

});