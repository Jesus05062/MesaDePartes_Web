document.addEventListener("DOMContentLoaded", async () => {

    const misTramites = document.querySelector("#id_misTramites");
    const loading = document.querySelector("#id_loading");

    const createErrors = (e) => {
        const msgError = document.createElement("p");
        const space = document.createElement("br");
        msgError.textContent = e;
        divErrores.append(msgError);
        divErrores.append(space);
    };

    const crearDivColoreado = (color = "", estado, celda) => {
        const div = document.createElement("div");
        div.style.backgroundColor = color;
        div.style.color = "white";
        div.style.borderRadius = "5px";
        div.style.padding = "5px";
        div.textContent = estado;
        celda.appendChild(div);
    };

    const applyEstadoColor = (estado) => {
        if (estado === "Por Recibir") return "#787543";
        if (estado === "En Proceso") return "#e0d41f";
        if (estado === "Recibido") return "green";
        if (estado === "Completado") return "#2a91d6";
        if (estado === "Rechazado") return "red";
        return "";
    };

    /* ---------------Funcionalidad del modal Errores--------------- */
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal-error");
    const modal = document.querySelector("#modal-error");
    const divErrores = document.querySelector("#div-msg-error");

    btnCerrarModal.addEventListener("click", () => {
        modal.close();
        divErrores.innerHTML = "";
    });

    loading.style.display = "block";
    misTramites.style.display = "none";

    const documentUser = localStorage.getItem("documento");
    const btnRefresh = document.querySelector("#btn_refresh");
    const filterDate = document.querySelector("#filterDate");
    const searchSolicitud = document.querySelector("#searchSolicitud");
    const dateRangeInputs = document.querySelector("#dateRangeInputs");
    const startDate = document.querySelector("#startDate");
    const endDate = document.querySelector("#endDate");

    const url = `http://munisayan.gob.pe/tramite/api/TdListadoByUser/${documentUser}`;

    let tramitesData = [];

    const fetchData = async () => {
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 200) {
                tramitesData = await res.json();
                applyFilters();
            } else {
                console.log("Error en la petición. Estado: ", res.status);
                const msgerr = `• Error en la petición. Estado: ${res.status}`;
                createErrors(msgerr);
                modal.showModal();
            }
        } catch (error) {
            const msgerr = "• No se pudo obtener la lista de expedientes registrados - Error del Sistema, sea paciente.";
            createErrors(msgerr);
            modal.showModal();
            console.error("No se pudo obtener la lista de expedientes registrados - Error del Sistema, sea paciente.", error);
        }
    };

    const renderTable = (data) => {
        // Limpiar la tabla antes de insertar nuevos datos
        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = "";

        // Verificar si hay datos
        if (data.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.setAttribute("colspan", "8");
            cell.textContent = "No se encontraron documentos";
            row.appendChild(cell);
            tbody.appendChild(row);

            loading.style.display = "none";
            misTramites.style.display = "block";
        } else {
            // Insertar datos en la tabla
            data.forEach(element => {

                const row = document.createElement("tr");
                row.classList.add("align-middle");
                row.style.fontSize = "14px";

                const crearFilaExpediente = (element, campo, opciones = {}) => {
                    const celda = document.createElement("td");

                    if (opciones.documento) {
                        celda.style.color = "blue";
                    }

                    if (opciones.div) {
                        const expediente = element[campo];
                        crearDivColoreado("black", expediente, celda);
                    }

                    if (opciones.colores) {
                        const estado = element[campo];

                        if (estado === "registrado") {
                            crearDivColoreado("#787543", estado, celda);
                        } else if (estado === "En Proceso") {
                            crearDivColoreado("#e0d41f", estado, celda);
                        } else if (estado === "Recibido") {
                            crearDivColoreado("green", estado, celda);
                        } else if (estado === "Completado") {
                            crearDivColoreado("#2a91d6", estado, celda);
                        } else if (estado === "Rechazado") {
                            crearDivColoreado("red", estado, celda);
                        } else {
                            celda.textContent = element[campo];
                        }
                    } else {
                        celda.textContent = element[campo];
                    }
                    row.appendChild(celda);
                };

                // Campo de "Solicitud" con icono
                const solicitudCell = document.createElement("td");

                const div = document.createElement("div");
                div.style.cursor = "pointer";
                div.title = "Seguimiento de expediente";

                const boton = document.createElement("button");
                boton.classList.add("text-primary");
                boton.setAttribute("style", "background-color: white; border: none;");

                const solicitudIcon = document.createElement("span");
                solicitudIcon.textContent = "📄";

                boton.appendChild(solicitudIcon);
                boton.appendChild(document.createTextNode(` ${element.id}`));
                div.appendChild(boton);
                solicitudCell.appendChild(div);
                row.appendChild(solicitudCell);

                // Agregar evento click al botón de solicitud
                boton.addEventListener("click", () => {
                    insertarNumSeguimiento(element);
                    mostrarDetalles(element.detalle);
                });

                crearFilaExpediente(element, "Documento", { documento: true });
                crearFilaExpediente(element, "Asunto");
                crearFilaExpediente(element, "Fecha");
                crearFilaExpediente(element, "Unidades");
                crearFilaExpediente(element, "Expediente", { div: true });
                crearFilaExpediente(element, "EstadoTramite", { colores: true });
                crearFilaExpediente(element, "FechaModificacion");

                // Campo de "url" con icono de descarga
                const docCell = document.createElement("td");
                const docLink = document.createElement("a");
                if (element.archivo && element.archivo.length > 0) {
                    docLink.href = element.archivo[0].url;
                    const downloadIcon = document.createElement("span");
                    downloadIcon.textContent = "⬇️";
                    downloadIcon.title = "Descargar archivo adjunto";
                    docLink.appendChild(downloadIcon);
                } else {
                    docLink.textContent = "No disponible";
                }
                docCell.appendChild(docLink);
                row.appendChild(docCell);

                tbody.appendChild(row);
            });
            
            loading.style.display = "none";
            misTramites.style.display = "block";
        }
    };

    const insertarNumSeguimiento = (data)=>{
        const numSolicitud = document.querySelector("#id_num_solicitud");
        numSolicitud.textContent = `${data.id}`;
    }

    const mostrarDetalles = (detalles) => {
        const tbodyDetalles = document.querySelector("#tabla-seguimiento-one tbody");

        tbodyDetalles.innerHTML = "";

        const numSolicitud = document.getElementById("id_num_solicitud");
        numSolicitud.textContent = detalles.id;

        detalles.forEach(detalle => {
            const row = document.createElement("tr");

            const celdaRemitente = document.createElement("td");
            celdaRemitente.textContent = detalle.IdUnidRem;
            row.appendChild(celdaRemitente);

            const celdaAsunto = document.createElement("td");
            celdaAsunto.textContent = detalle.Asunto;
            row.appendChild(celdaAsunto);

            const celdaDestino = document.createElement("td");
            celdaDestino.textContent = detalle.IdUnidDes;
            row.appendChild(celdaDestino);

            const celdaRespuesta = document.createElement("td");
            celdaRespuesta.textContent = detalle.Respuesta;
            row.appendChild(celdaRespuesta);

            const celdaEstado = document.createElement("td");
            const colorEstado = applyEstadoColor(detalle.Estado);
            crearDivColoreado(colorEstado, detalle.Estado, celdaEstado);
            row.appendChild(celdaEstado);

            const celdaObservacion = document.createElement("td");
            celdaObservacion.textContent = detalle.Observacion;
            row.appendChild(celdaObservacion);

            tbodyDetalles.appendChild(row);
        });

        const modalSeguimiento = document.querySelector("#tabla-seguimiento-one");
        modalSeguimiento.showModal();
    };

    const btnCerrarTablaSeguimiento = document.querySelector("#btn-cerrar-tabla-seguimiento-one");
    btnCerrarTablaSeguimiento.addEventListener("click", () => {
        const modalSeguimiento = document.querySelector("#tabla-seguimiento-one");
        modalSeguimiento.close();
    });

    const filterData = (data) => {
        const filterValue = filterDate.value;
        const searchValue = searchSolicitud.value.toLowerCase();
        let filteredData = data;

        if (filterValue === "7" || filterValue === "30") {
            const days = parseInt(filterValue);
            const now = new Date();
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                const diffTime = Math.abs(now - itemDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= days;
            });
        } else if (filterValue === "month") {
            const now = new Date();
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
            });
        } else if (filterValue === "range") {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                return itemDate >= start && itemDate <= end;
            });
        }

        if (searchValue) {
            filteredData = filteredData.filter(item => {
                const solicitud = item.id.toString().toLowerCase();
                const expediente = item.Expediente ? item.Expediente.toLowerCase() : "";
                return solicitud.includes(searchValue) || expediente.includes(searchValue);
            });
        }

        return filteredData;
    };

    const applyFilters = () => {
        const filteredData = filterData(tramitesData);
        renderTable(filteredData);
    };

    btnRefresh.addEventListener("click", () => {
        fetchData();
    });

    filterDate.addEventListener("change", () => {
        const filterValue = filterDate.value;
        if (filterValue === "range") {
            dateRangeInputs.style.display = "block";
        } else {
            dateRangeInputs.style.display = "none";
        }
        applyFilters();
    });

    searchSolicitud.addEventListener("input", () => {
        applyFilters();
    });

    startDate.addEventListener("change", () => {
        applyFilters();
    });

    endDate.addEventListener("change", () => {
        applyFilters();
    });

    loading.style.display = "block";
    misTramites.style.display = "none";

    await fetchData();
    applyFilters();
});
