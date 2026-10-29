
// Prepara una operación para las misiones que incluyen un reto matemático.
function crearDesafio(indiceMision) {
    let limiteNumero = indiceMision === 0 ? 21 : 11;
    let primerNumero = Math.floor(Math.random() * limiteNumero) + 1;
    let segundoNumero = Math.floor(Math.random() * limiteNumero) + 1;
    let simbolo;
    let resultado;

    if (indiceMision === 0) {
        simbolo = Math.random() < 0.5 ? "+" : "-";

        if (simbolo === "-" && segundoNumero > primerNumero) {
            let temporal = primerNumero;
            primerNumero = segundoNumero;
            segundoNumero = temporal;
        }

        resultado = simbolo === "+"
            ? primerNumero + segundoNumero
            : primerNumero - segundoNumero;
    } else if (Math.random() < 0.5) {
        simbolo = "×";
        resultado = primerNumero * segundoNumero;
    } else {
        simbolo = "÷";
        resultado = primerNumero;
        primerNumero *= segundoNumero;
    }

    return {
        operacion: `${primerNumero} ${simbolo} ${segundoNumero}`,
        resultado: resultado
    };
}

document.addEventListener("DOMContentLoaded", function () {

    // Inicia la partida cuando el jugador introduce sus datos.
    document.getElementById("entrar").addEventListener("click", function () {

        let puntosJugador = 0;
        let misiones = [
            "Buscar un tesoro",
            "Derrotar a un monstruo",
            "Encontrar una poción"
        ];
        let misionesGuardadas = sessionStorage.getItem("misionesCompletadas") || "";
        let misionesCompletadas = misionesGuardadas
            .split(",")
            .filter(indice => indice !== "")
            .map(Number)
            .filter(indice => Number.isInteger(indice) &&
                indice >= 0 && indice < misiones.length);
        let nombre = document.getElementById("nombre").value.trim();
        let fecha = document.getElementById("fecha").value;
        let mensaje = document.getElementById("mensaje");

        // Comprueba los datos y la edad mínima antes de abrir el juego.
        if (nombre === "" || fecha === "") {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        let nacimiento = new Date(fecha);
        let hoy = new Date();

        if (Number.isNaN(nacimiento.getTime()) || nacimiento >= hoy) {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        let edad = hoy.getFullYear() - nacimiento.getFullYear();

        let mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 &&
            hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        if (edad < 12) {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        // Recupera el progreso guardado y muestra los datos del jugador.
        document.cookie = "jugador=" + encodeURIComponent(nombre) +
            "; max-age=86400; path=/";

        console.log("Cookies guardadas: " + document.cookie);

        // Recupera los puntos guardados en esta sesión.
        puntosJugador = Number(sessionStorage.getItem("puntos")) || 0;
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

        // Crea los botones de misión y marca las que ya se hicieron.
        let zonaMisiones = document.getElementById("misiones");
        zonaMisiones.innerHTML = "";
        for (let i = 0; i < misiones.length; i++) {
            let boton = document.createElement("button");

            boton.textContent = misiones[i];
            boton.dataset.indice = i;
            if (misionesCompletadas.includes(i)) {
                boton.disabled = true;
                boton.textContent += " - Completada";
            }

            zonaMisiones.appendChild(boton);
        }

        zonaMisiones.addEventListener("click", function (evento) {
            if (evento.target.tagName !== "BUTTON") {
                return;
            }

            let indice = Number(evento.target.dataset.indice);

            if (misionesCompletadas.includes(indice)) {
                return;
            }

            let recompensa = Math.floor(Math.random() * 10) + 1;
            if (indice < 2) {
                let desafio = crearDesafio(indice);
                let mensaje = indice === 0
                    ? "Resuelve la operación para buscar el tesoro: "
                    : "Resuelve la operación para derrotar al monstruo: ";
                let respuesta = prompt(mensaje + desafio.operacion);
                let respuestaCorrecta = respuesta !== null &&
                    respuesta.trim() !== "" &&
                    Number(respuesta) === desafio.resultado;

                if (respuestaCorrecta) {
                    puntosJugador += recompensa;
                    alert("¡Correcto! Has conseguido " + recompensa + " puntos.");
                } else if (indice === 0) {
                    alert("Respuesta incorrecta. No has conseguido puntos.");
                } else {
                    puntosJugador -= recompensa;
                    alert("Respuesta incorrecta. Has perdido " + recompensa + " puntos.");
                }
            } else {
                puntosJugador += recompensa;
                alert("Has conseguido " + recompensa + " puntos.");
            }

            // Guarda el resultado, actualiza la pantalla y el récord.
            misionesCompletadas.push(indice);
            evento.target.disabled = true;
            evento.target.textContent += " - Completada";

            sessionStorage.setItem("puntos", puntosJugador);
            sessionStorage.setItem(
                "misionesCompletadas",
                misionesCompletadas.join(",")
            );

            let recordActual = Number(localStorage.getItem("record")) || 0;
            if (puntosJugador > recordActual) {
                localStorage.setItem("record", puntosJugador);
                document.getElementById("record").textContent =
                    "Récord: " + puntosJugador;
            }
            document.getElementById("puntos").textContent =
                "Puntos: " + puntosJugador;
        });

        // Muestra un resumen de la partida en una ventana aparte.
        document.getElementById("ayuda").addEventListener("click", function () {
            let texto = [
                document.getElementById("bienvenida").textContent,
                document.getElementById("edad").textContent,
                document.getElementById("puntos").textContent,
                "Misiones completadas: " + misionesCompletadas.length
            ].join("\n");
            let ventana = window.open("", "ayuda", "width=400,height=300");

            if (ventana != null) {
                ventana.document.body.innerText = texto;
            } else {
                alert("El navegador ha bloqueado la ventana");
            }

        });

        // Borra el progreso de esta sesión para empezar de nuevo.
        document.getElementById("reiniciar").addEventListener("click", function () {

            sessionStorage.removeItem("puntos");
            sessionStorage.removeItem("misionesCompletadas");

            window.location.reload();

        });

    });
});
