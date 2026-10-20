
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("entrar").addEventListener("click", function () {

        let nombre = document.getElementById("nombre").value.trim();
        let fecha = document.getElementById("fecha").value;
        let mensaje = document.getElementById("mensaje");

        if (nombre == "" || fecha == "") {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        let nacimiento = new Date(fecha);
        let hoy = new Date();

        if (isNaN(nacimiento.getTime()) || nacimiento >= hoy) {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        let edad = hoy.getFullYear() - nacimiento.getFullYear();

        let mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes == 0 &&
            hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        if (edad < 12) {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        mensaje.textContent = "Datos correctos. Bienvenido, " + nombre;

    });

});
