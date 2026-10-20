
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

        document.getElementById("perfil").style.display = "none";
        document.getElementById("juego").style.display = "block";

        document.getElementById("bienvenida").textContent =
            "Bienvenido, " + nombre.toUpperCase();

        document.getElementById("edad").textContent =
            "Tu edad es: " + edad;

        // Cambiar el fondo según la primera letra
        if (nombre.charAt(0).toLowerCase() < "n") {
            document.getElementById("juego").style.backgroundColor = "#d6f5d6";
        } else {
            document.getElementById("juego").style.backgroundColor = "#d6eaff";
        }

        // Cambiar el color del nombre según la edad
        if (edad >= 18) {
            document.getElementById("bienvenida").style.color = "darkblue";
        } else {
            document.getElementById("bienvenida").style.color = "darkgreen";
        }

    });
    document.getElementById("misiones").addEventListener("click", function (evento) {

        if (evento.target.tagName != "BUTTON") {
            return;
        }

        let indice = Number(evento.target.dataset.indice);

        // Comprobar si la misión ya está hecha
        if (misionesCompletadas.includes(indice)) {
            alert("Ya has completado esta misión");
            return;
        }

        // Conseguir entre 1 y 10 puntos aleatorios
        let recompensa = Math.round(Math.random() * 9) + 1;

        puntosJugador = puntosJugador + recompensa;

        // Guardar la misión completada
        misionesCompletadas.push(indice);

        evento.target.disabled = true;
        evento.target.textContent += " - Completada";

        document.getElementById("puntos").textContent =
            "Puntos: " + puntosJugador;

        alert("¡Misión completada! Has conseguido " + recompensa + " puntos");

    });
});
