var msg = "";

var subTotal = 0;
var totalAmount = 0;
var shippingCosts = 0;

//Ratios
var stdRatio = 0.05;
var expressRatio = 0.07;
var premiumRatio = 0.15;


//Get Inputs
var stdInput = document.getElementById('std-method');
var expressInput = document.getElementById('express-method');
var premiumInput = document.getElementById('premium-method');


function calculateTotalAmount(){
    totalAmount = subTotal + shippingCosts;
}

function updateTotalAmount(){
    document.getElementById("totalPrice").innerHTML = `$ `+ totalAmount;
}

function calculateShippingCosts(shippingRatio) {
    shippingCosts = shippingRatio * subTotal;
    return shippingCosts;
}

function submitEventHandler(evento){ 
    evento.preventDefault(); //evita el envio del form
    return true;//al final la info se envie al servidor
}


function redirect() {
    window.location.href = "index.html";
}

function paymentSelected() {
    sessionStorage.setItem('metodoPago', 'true');
    $('#payModal').modal('hide'); //Cierra el modal
}

function shippingSelected() {
    sessionStorage.setItem('shipping', 'true');
    $('#shippingData').modal('hide'); //Cierra el modal
}

function disableCardMethod() {
    document.getElementById("cvv").disabled = true;
    document.getElementById("cardNumber").disabled = true;
    document.getElementById("expDate").disabled = true;
}

function enableBankMethod() {
    document.getElementById("accountNumber").disabled = false;
    disableCardMethod();
}

function enableCardMethod() {
    document.getElementById("cvv").disabled = false;
    document.getElementById("cardNumber").disabled = false;
    document.getElementById("expDate").disabled = false;
    document.getElementById("accountNumber").disabled = true;

}


//Verifica que se hayan selecionado metodo de pago y de envío y redirecciona si corresponde
function verifyChecked() {
    let datosDeDireccion = sessionStorage.getItem("shipping");
    let datosPago = sessionStorage.getItem("metodoPago");
    
    if ((shippingCosts !== 0) && datosDeDireccion && datosPago) {
        htmlContentToAppend = "";
        htmlContentToAppend = `
        <div style="position:absolute; width: 50%;margin: 0 auto;text-align: center;background-color: LightGreen;" class="ibox-content">`+ msg + `</div>
        `
        document.getElementById("messagePlace").innerHTML = htmlContentToAppend;
        sessionStorage.removeItem("metodoPago");
        sessionStorage.removeItem("shipping");
        setTimeout("redirect()", 2000);
    } else{
        if (shippingCosts === 0){                //Controla que se haya selecionado metodo de envio
            document.getElementById("envioSelect").style.color = "#ff8080";
        } else { document.getElementById("envioSelect").style.color = "#000000";}

        if (datosPago !== "true") {
            document.getElementById("btnDatosPago").className="btn btn-outline-danger";
        } else {document.getElementById("btnDatosPago").className="btn btn-outline-primary"}
        if (datosDeDireccion !== "true") {
            document.getElementById("btnDatosEnvio").className="btn btn-outline-danger";
        } else {document.getElementById("btnDatosPago").className="btn btn-outline-primary"}
    }
    
}


function updateShippingCosts() {
    let stdCost = calculateShippingCosts(stdRatio);
    let expressCost = calculateShippingCosts(expressRatio);
    let premiumCost = calculateShippingCosts(premiumRatio);
    if (stdInput.checked) {
        shippingCosts = Math.round(stdCost);
    }
    if (expressInput.checked) {
        shippingCosts = Math.round(expressCost);
    }
    if (premiumInput.checked) {
        shippingCosts = Math.round(premiumCost);
    }
    document.getElementById("deliveryCost").innerHTML = `$ ` + shippingCosts;
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

        function changeSubTotal() {
            newSubTotal = 0;
            for (let i = 0; i < articulos.length; i++) {
                newSubTotal += parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
            }
            document.getElementById("subTotalPrice").innerHTML = `$` + newSubTotal;
            subTotal = newSubTotal;
        }


        for (let i = 0; i < articulos.length; i++) {


            document.getElementById("btnMinus" + i).addEventListener("click", function () {      //Implementa la funcionalidad del boton - (Min 1 producto)
                var value = document.getElementById("valueProd" + i).value;
                if (value > 1) {
                    value -= 1;
                    document.getElementById("valueProd" + i).value--;
                    tot = parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
                    document.getElementById("sumPrice" + i).innerHTML = "$" + tot;
                    changeSubTotal();
                    if (shippingCosts !== 0) {updateShippingCosts();}
                    calculateTotalAmount();
                    updateTotalAmount();
                }
            })

            document.getElementById("btnPlus" + i).addEventListener("click", function () {      //Implementa la funcionalidad del boton + 
                document.getElementById("valueProd" + i).value++;
                tot = parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
                document.getElementById("sumPrice" + i).innerHTML = "$" + tot;
                changeSubTotal();
                if (shippingCosts !== 0) {updateShippingCosts();}
                calculateTotalAmount();
                updateTotalAmount();

            })

            document.getElementById("valueProd" + i).addEventListener("keyup", function () {            //Implementa poder digitar la cant de articulos en tiempo real 
                if (parseInt(document.getElementById("valueProd" + i).value) < 1) { document.getElementById("valueProd" + i).value = 1 }
                tot = parseInt(document.getElementById("valueProd" + i).value) * articulos[i].unitCost;
                document.getElementById("sumPrice" + i).innerHTML = "$" + tot;
                changeSubTotal();
            })
        }

        stdInput.addEventListener("change", function (event) {
                shippingCosts = Math.round(calculateShippingCosts(stdRatio));                                    //Actualiza valores al selecionar distos metodos de envio
                document.getElementById("deliveryCost").innerHTML = `$ ` + shippingCosts;
                calculateTotalAmount();
                updateTotalAmount();
        });

        expressInput.addEventListener("change", function (event) {
                shippingCosts = Math.round(calculateShippingCosts(expressRatio));
                document.getElementById("deliveryCost").innerHTML = `$ ` + shippingCosts;
                calculateTotalAmount();
                updateTotalAmount();
        });

        premiumInput.addEventListener("change", function (event) {
                shippingCosts = Math.round(calculateShippingCosts(premiumRatio));
                document.getElementById("deliveryCost").innerHTML = `$ ` + shippingCosts;
                calculateTotalAmount();
                updateTotalAmount();
        });

        document.querySelector("body > nav ").remove();
        getJSONData(CART_BUY_URL).then(function (resultObj) {        //Borra el navBar
            if (resultObj.status === "ok") {
                msg = resultObj.data.msg;
            }
        });
    });

    document.getElementById("payment-form").addEventListener("submit",submitEventHandler);
    document.getElementById("shipp-form").addEventListener("submit",submitEventHandler);
});