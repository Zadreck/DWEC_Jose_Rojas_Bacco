
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("entrar").addEventListener("click", function () {

        let puntosJugador = 0;
        let misionesCompletadas = [];
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
        document.cookie = "jugador=" + encodeURIComponent(nombre) +
            "; max-age=86400; path=/";

        console.log("Cookies guardadas: " + document.cookie);

        // Recuperar los puntos de esta sesión
        let puntosGuardados = sessionStorage.getItem("puntos");

        if (puntosGuardados != null) {
            puntosJugador = Number(puntosGuardados);
        }
        document.getElementById("puntos").textContent =
            "Puntos: " + puntosJugador;
        document.getElementById("record").textContent =
            "Récord: " + (Number(localStorage.getItem("record")) || 0);
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

        let misiones = [
            "Buscar un tesoro",
            "Derrotar a un monstruo",
            "Encontrar una poción"
        ];

        let zonaMisiones = document.getElementById("misiones");

        zonaMisiones.innerHTML = "";

        for (let i = 0; i < misiones.length; i++) {
            let boton = document.createElement("button");

            boton.textContent = misiones[i];
            boton.dataset.indice = i;

            zonaMisiones.appendChild(boton);
        }

        document.getElementById("misiones").addEventListener("click", function (evento) {
            if (evento.target.tagName != "BUTTON") {
                return;
            }

            let indice = Number(evento.target.dataset.indice);

            if (misionesCompletadas.includes(indice)) {
                alert("Ya has completado esta misión");
                return;
            }

            let recompensa = Math.round(Math.random() * 9) + 1;
            let respuesta;
            let resultadoCorrecto;
            let descripcionOperacion;

            if (indice == 0) {
                let primerNumero = Math.round(Math.random() * 20) + 1;
                let segundoNumero = Math.round(Math.random() * 20) + 1;
                let esSuma = Math.random() < 0.5;

                if (esSuma) {
                    resultadoCorrecto = primerNumero + segundoNumero;
                    descripcionOperacion = primerNumero + " + " + segundoNumero;
                } else {
                    if (segundoNumero > primerNumero) {
                        let temporal = primerNumero;
                        primerNumero = segundoNumero;
                        segundoNumero = temporal;
                    }
                    resultadoCorrecto = primerNumero - segundoNumero;
                    descripcionOperacion = primerNumero + " - " + segundoNumero;
                }

                respuesta = prompt(
                    "Resuelve la operación para buscar el tesoro: " +
                    descripcionOperacion
                );
                if (respuesta !== null && respuesta.trim() !== "" &&
                    Number(respuesta) === resultadoCorrecto) {
                    puntosJugador += recompensa;
                    alert("¡Correcto! Has conseguido " + recompensa + " puntos.");
                } else {
                    alert("Respuesta incorrecta. No has conseguido puntos.");
                }
            } else if (indice == 1) {
                let esMultiplicacion = Math.random() < 0.5;
                let primerNumero = Math.round(Math.random() * 10) + 1;
                let segundoNumero = Math.round(Math.random() * 10) + 1;

                if (esMultiplicacion) {
                    resultadoCorrecto = primerNumero * segundoNumero;
                    descripcionOperacion = primerNumero + " × " + segundoNumero;
                } else {
                    resultadoCorrecto = primerNumero;
                    descripcionOperacion =
                        (primerNumero * segundoNumero) + " ÷ " + segundoNumero;
                }

                respuesta = prompt(
                    "Resuelve la operación para derrotar al monstruo: " +
                    descripcionOperacion
                );
                if (respuesta !== null && respuesta.trim() !== "" &&
                    Number(respuesta) === resultadoCorrecto) {
                    puntosJugador += recompensa;
                    alert("¡Correcto! Has conseguido " + recompensa + " puntos.");
                } else {
                    puntosJugador -= recompensa;
                    alert("Respuesta incorrecta. Has perdido " + recompensa + " puntos.");
                }
            } else {
                puntosJugador += recompensa;
                alert("Has conseguido " + recompensa + " puntos.");
            }

            misionesCompletadas.push(indice);
            evento.target.disabled = true;
            evento.target.textContent += " - Completada";

            sessionStorage.setItem("puntos", puntosJugador);

            let recordActual = Number(localStorage.getItem("record")) || 0;

            if (puntosJugador > recordActual) {
                localStorage.setItem("record", puntosJugador);
                document.getElementById("record").textContent =
                    "Récord: " + puntosJugador;
            }
            document.getElementById("puntos").textContent =
                "Puntos: " + puntosJugador;
        });

        
        document.getElementById("ayuda").addEventListener("click", function () {

            let nombreMostrado =
                document.getElementById("bienvenida").textContent;

            let edadMostrada =
                document.getElementById("edad").textContent;

            let puntosMostrados =
                document.getElementById("puntos").textContent;

            let texto = nombreMostrado + "\n";
            texto += edadMostrada + "\n";
            texto += puntosMostrados + "\n";
            texto += "Misiones completadas: " + misionesCompletadas.length;

            let ventana = window.open("", "ayuda", "width=400,height=300");

            if (ventana != null) {
                ventana.document.body.innerText = texto;
            } else {
                alert("El navegador ha bloqueado la ventana");
            }

        });
        document.getElementById("reiniciar").addEventListener("click", function () {

            sessionStorage.removeItem("puntos");

            window.location.reload();

        });

    });
});
