function updateDataProfileForm(){
    let nombrePreCargado = document.getElementById("previousName").innerHTML;
    let emailPreCargado = document.getElementById("previousEmail").innerHTML;
    let edadPreCargado = document.getElementById("previousAge").innerHTML;
    let telefonoPreCargado = document.getElementById("previousPhone").innerHTML;
    let paisPreCargado = document.getElementById("previousCountry").innerHTML;
    document.getElementById("nYa").value = nombrePreCargado;
    document.getElementById("changeEmail").value = emailPreCargado;
    document.getElementById("changeAge").value = edadPreCargado;
    document.getElementById("changePhone").value = telefonoPreCargado;
    document.getElementById("country").value = paisPreCargado;
}

function updateDataProfile(){  //Actualiza la info que se muestra en el perfil
    let parsedDatos = JSON.parse(localStorage.getItem("datosPerfil"));
    let nombre = parsedDatos.nombreYapellido;
    let email = parsedDatos.email;
    let edad = parsedDatos.edad;
    let telefono = parsedDatos.telefono;
    let pais = parsedDatos.pais;
    document.getElementById("previousName").innerHTML = nombre;
    document.getElementById("previousEmail").innerHTML = email;
    document.getElementById("previousAge").innerHTML = edad;
    document.getElementById("previousPhone").innerHTML = telefono;
    document.getElementById("previousCountry").innerHTML = pais;
}

function submitEventHandler(evento){ //Almacena y actualiza datos de perfil
    evento.preventDefault(); //evita el envio del form
    var datosPerfil = {
        nombreYapellido: (document.getElementById("nYa").value),
        email: (document.getElementById("changeEmail").value),
        edad: (document.getElementById("changeAge").value),
        telefono:(document.getElementById("changePhone").value),
        pais: (document.getElementById("country").value)
    }
    localStorage.setItem("datosPerfil",JSON.stringify(datosPerfil))
    $('#modalChangeInfo').modal('hide'); //Cierra el modal
    updateDataProfile();
    return true;//al final la info se envie al servidor
}



//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    //Obtiene nombre de usuario y lo muestra debajo la foto
    let nombrePerfil = document.getElementById("nombreUsuarioPerfil");
    let nombreUsuario = JSON.parse(sessionStorage.getItem("usuarioActual")).email;
    nombrePerfil.innerHTML = nombreUsuario;

    //Actualiza el form de cambio de datos
    updateDataProfile();
    updateDataProfileForm();

    //Agrega el event cuando se haga el submit
    document.getElementById("formChangesInfo").addEventListener("submit",submitEventHandler);
});