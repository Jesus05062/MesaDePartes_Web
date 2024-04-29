
const form = document.querySelector("form");

const loadingDiv = document.querySelector("#loading");

const createErrors = (e) => {
    const msgError = document.createElement("p");
    const space = document.createElement("br");
    msgError.textContent = e;
    divErrores.append(e);
    divErrores.append(space);
};

/* ---------------Funcionalidad del modal Errores--------------- */
const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
const modal = document.querySelector("#modal-error");
const divErrores = document.querySelector("#div-msg-error");

btnCerrarModal.addEventListener("click", () => {
    modal.close();
});
/* ---------------Formulario--------------- */
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = "http://munisayan.gob.pe/tramite/api/user/auth";

    const formData = new FormData(form);
    const formObject = {};

    for (const [key, value] of formData) {
        formObject[key] = value;
    }

    //console.log(JSON.stringify(formObject));

    loadingDiv.showModal();

    await fetch(url, {
        method: "POST",
        body: JSON.stringify(formObject),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        loadingDiv.close();

        divErrores.innerHTML = "";
        if (res.status === 200) {
            return res.json().then(respuesta => {
                if (respuesta.usuario.Nombres) {
                    localStorage.setItem("Nombres", `${respuesta.usuario.Nombres} ${respuesta.usuario.ApellidoPaterno} ${respuesta.usuario.ApellidoMaterno}`);
                }
                if (respuesta.usuario.razonsociaal) {
                    localStorage.setItem("rasonzocial", respuesta.usuario.razonsocial);
                }
                localStorage.setItem("documento", respuesta.usuario.documento);
                localStorage.setItem("email", respuesta.usuario.email);
                window.location.href = 'misTramites.html';

            });
        } else if (res.status === 400) {
            return res.json().then(respuesta => {
                console.error(`Mensaje: ${respuesta.msg}`);
                const msgerr = "• " + respuesta.msg;
                createErrors(msgerr);
                modal.showModal();
            });
        } else {
            // Otro código de estado
            console.log("Error en la petición. Estado: ", res.status);
        }
    }).catch(error => {
        loadingDiv.close();
        divErrores.innerHTML = "";
        createErrors(`Problemas en el sitio web, Sea paciente.\n Descripcion del error: ${error}`);
        modal.showModal();
        console.error(error);
    });

});