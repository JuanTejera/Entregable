function submitEventHandler(evento){ //Redirige y almacena el email en la sesión
    evento.preventDefault(); //evita el envio del form
    sessionStorage.setItem('visitado','true');
    var usuarioActual = {
        email: (document.getElementById("inputEmail").value)
    }
    sessionStorage.setItem("usuarioActual",JSON.stringify(usuarioActual))
    window.location.href = "index.html"; //redirige al index
    return true;//al final la info se envie al servidor
}

document.getElementById('form-evento').addEventListener('submit',submitEventHandler);//agrega el event cuando se haga el submit


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    
});