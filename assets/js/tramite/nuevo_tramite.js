/* document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const url = "";

        const formData = new FormData(form);
        const formObject = {}

        for (const [key, value] of formData) {
            formObject[key] = value;
        }

        console.log(JSON.stringify(formObject));

        await fetch(url, {
            method: "PUT",
            body: JSON.stringify(formObject),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            loadingDiv.close();

            divErrores.innerHTML = "";
            if (res.status === 200) {
                return res.json().then(respuesta => {
                    window.location.href = 'misTramites.html';
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

    })
})
 */
