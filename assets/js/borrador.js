document.addEventListener("DOMContentLoaded", function () {

    /* ---------------Funcionalidad del modal Errores--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");
    const divErrores = document.getElementById("div-msg-error");

    const loadingDiv = document.querySelector("#loading");


    btnCerrarModal.addEventListener("click", () => {
        modal.close();
    });

    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(e);
        divErrores.append(space);
    };

    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        submitForm();
    });

    const submitForm = async() => {
        const formData = new FormData();

        const selectDepartamento = document.querySelector("#id_departamento");
        const selectProvincia = document.querySelector("#id_provincia");
        const selectDistrito = document.querySelector("#id_distrito");
        const selectDependencia = document.querySelector("#id_dependencia");

        const seltedDepartamento = selectDepartamento.options[selectDepartamento.selectedIndex].text;
        const seltedProvincia = selectProvincia.options[selectProvincia.selectedIndex].text;
        const seltedDistrito = selectDistrito.options[selectDistrito.selectedIndex].text;
        const seltedtDependencia = selectDependencia.options[selectDependencia.selectedIndex].text;


        // Archivo
        const archivoInput = document.querySelector("#id_archivocorto");
        const archivo = archivoInput.files[0];
        formData.append("archivo", archivo);

        // Cuerpo del mensaje
        const body = [
            {
                IdUsuario: 115,
                ModoEmision: document.querySelector("#id_modoEmision").value,
                Ruc: document.querySelector("#id_ruc").value,
                TipoDocumento: document.querySelector("#id_tipoDocumento").value,
                Documento: document.querySelector("#id_documento").value,
                Folios: document.querySelector("#id_folios").value,
                /* Siglas: "Siglas 1", */
                Fecha: document.querySelector("#id_fecha").value,
                DocumentoFirmante: document.querySelector("#id_dniFirmante").value,
                NombreFirmante: document.querySelector("#id_nombreFirmante").value,
                CargoFirmante: document.querySelector("#id_cargoFirmante").value,

                Departamento: seltedDepartamento,
                Provincia: seltedProvincia,
                Distrito: seltedDistrito,

                Direccion: document.querySelector("#id_direccion").value,
                Telefono: document.querySelector("#id_telefono").value,
                CorreoElectronico: document.querySelector("#id_email").value,
                Asunto: document.querySelector("#id_asunto").value,
                Unidades: seltedtDependencia,
                Estado: true,
                EstadoTramite: "registrado",
                UrlAnexo: document.querySelector("#id_anexo").value,
                archivo: [
                    {
                        Archivo: "Contenido del archivo 1",
                        NombreArchivo: archivo.name
                    }
                ]
            }
        ];

        console.log(JSON.stringify(body));

        formData.append("body", JSON.stringify(body));

        const url= "https://munisayan.gob.pe/tramite/api/tds";

        loadingDiv.showModal();

        await fetch(url, {
            method: "POST",
            body: formData,
            /* headers: {
                "Content-Type": "application/json"
            } */
        }).then(res => {
            loadingDiv.close();

            divErrores.innerHTML = "";
            if (res.status === 200) {
                return res.json().then(respuesta => {
                    /* window.location.href = "misTramites.html"; */
                    console.log("Todo bien");
                });
            } else if (res.status === 400) {
                return res.json().then(respuesta => {
                    console.error(`Mensaje: ${respuesta.msg}`);
                    const msgerr = "• " + respuesta.msg;
                    createErrors(msgerr);
                    modal.showModal();
                });
            } else if (res.status === 404) {
                return res.json().then(respuesta => {
                    console.error(`Mensaje: ${respuesta.errors.msg}`);
                    const msgerr = "• " + respuesta.errors.msg;
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


    }
});
