let carrito = []

const paquetesContenedor = document.getElementById("container-paquetes")
paquetesContenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("modalAdd")) {          //Validación ID botones.
        validacionRepetido(e.target.id)

    }
})

const validacionRepetido = (idPaquete) => {
    const booleanoRepetido = carrito.some(paquete => paquete.id == idPaquete)          //Se busca el id del paquete en el carrito. Si se repite, booleanerepetido será true
    if (!booleanoRepetido) {
        const buscadorPaquetes = paquetes.find(paquete => paquete.id == idPaquete)
        carrito.push(buscadorPaquetes)
        agregarAlContenedorModal(buscadorPaquetes)
    }
    else {
        const paqueteRepetido = paquetes.find(paquete => paquete.id == idPaquete)
    }
}
const agregarAlContenedorModal = (paquetes) => {
    const contenedorModal = document.getElementById("contenido-modal")
    const divModal = document.createElement("div")
    divModal.classList.add("col-xl-6")
    divModal.innerHTML = ` 
    <button type="button" class="btn-close eliminar-modal " data-bs-dismiss="moda" aria-label="Close"></button>
    <p><strong>${paquetes.nombre}</strong></p>
    <p><strong> Descripción</strong>: <br>${paquetes.detalles} </p>
    <p><strong> Precio:</strong> ${paquetes.precio} pesos por persona </p>
    <p><strong> Estas reservando para: </strong>${paquetes.personas} personas</p>

`
    contenedorModal.appendChild(divModal)
}