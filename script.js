
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("entrar").addEventListener("click", function () {

        let nombre = document.getElementById("nombre").value;

        if (nombre == "") {
            document.getElementById("mensaje").textContent =
                "Introduce tu nombre";
        } else {
            document.getElementById("mensaje").textContent =
                "Hola, " + nombre;
        }

    });

});
