
// Genera un ejercicio aleatorio adaptado a la misión actual.
// La primera misión usa sumas y restas con números algo más altos,
// mientras que las siguientes usan multiplicaciones o divisiones más sencillas.
function crearDesafio(indiceMision) {
    // El rango del número cambia para ajustar la dificultad según la misión.
    let limiteNumero = indiceMision === 0 ? 21 : 11;
    let primerNumero = Math.floor(Math.random() * limiteNumero) + 1;
    let segundoNumero = Math.floor(Math.random() * limiteNumero) + 1;
    let simbolo;
    let resultado;

    if (indiceMision === 0) {
        // En la misión inicial se permite sumar o restar para que el reto sea más variado.
        simbolo = Math.random() < 0.5 ? "+" : "-";

        // Si la resta dejaría un resultado negativo, se intercambian los valores
        // para que el cálculo sea siempre válido y el jugador responda un número positivo.
        if (simbolo === "-" && segundoNumero > primerNumero) {
            let temporal = primerNumero;
            primerNumero = segundoNumero;
            segundoNumero = temporal;
        }

        resultado = simbolo === "+"
            ? primerNumero + segundoNumero
            : primerNumero - segundoNumero;
    } else if (Math.random() < 0.5) {
        // Las misiones avanzadas suelen usar multiplicación para aumentar el ritmo del juego.
        simbolo = "×";
        resultado = primerNumero * segundoNumero;
    } else {
        // La división se representa con el dividendo y el divisor invertidos en la cadena,
        // de manera que el resultado final del ejercicio sea coherente con la operación mostrada.
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

        // Se valida primero que el jugador haya rellenado todos los campos,
        // porque sin nombre y fecha no tiene sentido iniciar la partida.
        if (nombre === "" || fecha === "") {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        // La fecha de nacimiento se convierte a un objeto Date para poder
        // comparar la edad real con la fecha actual del sistema.
        let nacimiento = new Date(fecha + "T00:00:00Z");
        let hoy = new Date();

        // Se formatea la fecha actual en formato ISO para poder rechazar
        // entradas inválidas o fechas futuras antes de permitir el acceso.
        let fechaHoy = hoy.getFullYear() + "-" +
            ("0" + (hoy.getMonth() + 1)).slice(-2) + "-" +
            ("0" + hoy.getDate()).slice(-2);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
            Number.isNaN(nacimiento.getTime()) ||
            nacimiento.toISOString().slice(0, 10) !== fecha ||
            fecha >= fechaHoy) {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        // Se calcula la edad atendiendo al mes y al día, para no contar
        // como mayor de edad a alguien que todavía no cumple años en este año.
        let edad = hoy.getFullYear() - nacimiento.getUTCFullYear();

        let mes = hoy.getMonth() - nacimiento.getUTCMonth();

        if (mes < 0 || (mes === 0 &&
            hoy.getDate() < nacimiento.getUTCDate())) {
            edad--;
        }

        if (edad < 12) {
            mensaje.textContent = "Acceso denegado";
            return;
        }

        // Se guarda la identidad del jugador en la cookie para que el navegador
        // recuerde su nombre durante la sesión y podamos mostrarlo después.
        document.cookie = "jugador=" + encodeURIComponent(nombre) +
            "; max-age=86400; path=/";

        console.log("Cookies guardadas: " + document.cookie);

        // Cargamos la puntuación actual de la sesión para continuar el juego sin perder progreso.
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

        // El color de fondo cambia según la inicial del nombre para darle
        // un pequeño toque visual personalizado y distinguir partidas rápidas.
        if (nombre.charAt(0).toLowerCase() < "n") {
            document.getElementById("juego").style.backgroundColor = "#d6f5d6";
        } else {
            document.getElementById("juego").style.backgroundColor = "#d6eaff";
        }

        // La línea del borde se ajusta según la edad para que el aspecto del juego
        // evolucione con la madurez del jugador y el diseño siga mostrando un estado visual.
        let nivelEstilo = Math.round(edad / 10);
        document.getElementById("juego").style.border = "3px solid " +
            (nivelEstilo >= 2 ? "#1b4f72" : "#2e7d32");

        // El color del texto de bienvenida cambia según si el jugador es adulto
        // o aún está en la etapa adolescente, para reforzar la identidad del perfil.
        if (edad >= 18) {
            document.getElementById("bienvenida").style.color = "darkblue";
        } else {
            document.getElementById("bienvenida").style.color = "darkgreen";
        }

        // Se generan los botones de cada misión y se deshabilitan las que ya fueron completadas,
        // para recordar el progreso que quedó guardado en sessionStorage.
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

            // Evita repetir una misión ya superada para que el progreso no se duplique.
            if (misionesCompletadas.includes(indice)) {
                return;
            }

            // Cada misión aporta una recompensa aleatoria y el cálculo varia según su tipo.
            let recompensa = Math.round((Math.random() * 9) + 1);
            if (indice < 2) {
                // Las dos primeras misiones requieren resolver un problema matemático antes de sumar puntos.
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
                // La última misión es directa y recompensa al jugador sin cuestionario adicional.
                puntosJugador += recompensa;
                alert("Has conseguido " + recompensa + " puntos.");
            }

            // Se graba la misión como completada y se actualiza el marcador de la sesión.
            misionesCompletadas.push(indice);
            evento.target.disabled = true;
            evento.target.textContent += " - Completada";

            sessionStorage.setItem("puntos", puntosJugador);
            sessionStorage.setItem(
                "misionesCompletadas",
                misionesCompletadas.join(",")
            );

            // Se comprueba si la puntuación actual supera el récord guardado y se actualiza la UI.
            let recordActual = Number(localStorage.getItem("record")) || 0;
            if (puntosJugador > recordActual) {
                localStorage.setItem("record", puntosJugador);
                document.getElementById("record").textContent =
                    "Récord: " + puntosJugador;
            }
            document.getElementById("puntos").textContent =
                "Puntos: " + puntosJugador;
        });

        // Se abre una pequeña ventana con el resumen del perfil para revisar la partida sin salir del juego.
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

        // Reinicia la sesión borrando todo el progreso para volver a empezar desde cero.
        document.getElementById("reiniciar").addEventListener("click", function () {

            sessionStorage.removeItem("puntos");
            sessionStorage.removeItem("misionesCompletadas");

            window.location.reload();

        });

    });
});
