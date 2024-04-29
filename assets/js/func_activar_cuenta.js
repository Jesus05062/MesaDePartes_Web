document.addEventListener("DOMContentLoaded", async() => {

    const createOption = (e, c, nc) => {
        const option = document.createElement("option");
        //option.classList.add(nc);
        option.setAttribute("id", nc); 
        option.value = e.id;
        option.textContent = e.Descripcion;
        c.append(option);
    };

    /* ---------------------CARGAR DEPARTAMENTOS--------------------- */
    const urlDepartamento = "http://munisayan.gob.pe/tramite/api/departamento";
    const departamentoSelect = document.getElementById("id_departamento");

    await fetch(urlDepartamento, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {

            data.dpto.forEach(departamento => createOption(departamento, departamentoSelect, "departamento"));

        })
        .catch(error => {
            console.error("Error al obtener la lista de departamentos:", error);
        });


    /* ---------------------CARGAR PROVINCIAS--------------------- */
    const provinciaSelect = document.getElementById("id_provincia");

    departamentoSelect.addEventListener("change", async() => {
        const selectDepartamentoId = departamentoSelect.value;

        const urlProvincia = `http://munisayan.gob.pe/tramite/api/provincia/${selectDepartamentoId}`;

        await fetch(urlProvincia, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                provinciaSelect.innerHTML = "";
                distritoSelect.innerHTML = "";
                /* const seleccionar = document.createElement("option");
                seleccionar.value = null;
                seleccionar.textContent = "Seleccionar...";
                provinciaSelect.append(seleccionar); */

                data.forEach(provincia => createOption(provincia, provinciaSelect,"provincia"));
            })
            .catch(error => {
                console.error("Error al obtener la lista de provincias:", error);
            });
    });

    /* ---------------------CARGAR DISTRITOS--------------------- */
    const distritoSelect = document.getElementById("id_distrito");

    provinciaSelect.addEventListener("change", async() => {

        const selectProvinciaId = provinciaSelect.value;
        const urlDistrito = `http://munisayan.gob.pe/tramite/api/distrito/${selectProvinciaId}`;

        await fetch(urlDistrito, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                distritoSelect.innerHTML = "";

                data.forEach(distrito => createOption(distrito, distritoSelect,"distrito"));
            })
            .catch(error => {
                console.error("Error al obtener la lista de distritos:", error);
            });

    });
});

