//Ejecutar función en el evento click
document.getElementById("btn_open").addEventListener("click", open_close_menu);

//Declaramos variables
let side_menu = document.getElementById("menu_side");
let btn_open = document.getElementById("btn_open");
let body = document.getElementById("body");

//Evento para mostrar y ocultar menú
function open_close_menu() {
    body.classList.toggle("body_move");
    side_menu.classList.toggle("menu__side_move");
}

//Si el ancho de la página es menor a 760px, ocultará el menú al recargar la página

if (window.innerWidth < 760) {

    body.classList.add("body_move");
    side_menu.classList.add("menu__side_move");
}

//Haciendo el menú responsive(adaptable)

window.addEventListener("resize", function () {

    if (window.innerWidth > 760) {
        body.classList.remove("body_move");
        side_menu.classList.remove("menu__side_move");
    }

    if (window.innerWidth < 760) {
        body.classList.add("body_move");
        side_menu.classList.add("menu__side_move");
    }
});

/* OPCINOES DE EMISION */
/* 
let opcEmision = ["----------------", "Personal", "Institucional"];

let selectElementEmision = document.getElementById('modoEmisionSelect');

opcEmision.forEach((opcion )=>{
    let optionElement = document.createElement("option");
    optionElement.value = opcion;
    optionElement.textContent= opcion;
    selectElementEmision.appendChild(optionElement);

}); */

/* Opciones Tipo de Documento */

/* let opcDocumento = ["              ","Memorandum","Memorandum Multiple","Adenda", "Carta Notarial", "Carta"]

let selectElementDocumento = document.getElementById('tipoDocumentoSelect');

opcDocumento.forEach( (opcion) => {
    let optionElement = document.createElement("option");

    optionElement.value = opcion;
    optionElement.textContent = opcion;
    selectElementDocumento.appendChild(optionElement);
});
 */

const btnAbrirModal = document.querySelector("#btn-abrir-modal");
const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
const modal = document.querySelector("#modal");

btnAbrirModal.addEventListener("click", () => {
    modal.showModal();
});
btnCerrarModal.addEventListener("click", () => {
    modal.close();
});

