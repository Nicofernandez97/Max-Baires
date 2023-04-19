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
        const paqueteRepetido = paquetes.find(paquete => paquete.id == idPaquete)       //Se busca cual es el paquete repetido. Al tenerlo, se le cambia la cantidad de su propiedad personas en 1 y se actualizan los subtotales.
        const cantidadRepetido = document.getElementById(`personas${paqueteRepetido.id}`)
        paqueteRepetido.personas++
        cantidadRepetido.innerHTML = ` <p>Estas reservando para: ${paqueteRepetido.personas} personas </p>
        <p><strong> Subtotal ${paqueteRepetido.nombre}</strong>: ${paqueteRepetido.personas * paqueteRepetido.precio} Pesos argentinos </p>

        `
        carritoLive(carrito)
    }
}
const agregarAlContenedorModal = (paquetes) => {                    //Creación y adición elementos Div con descripciones de paquetes post validación repetido. 
    const contenedorModal = document.getElementById("contenido-modal")
    const divModal = document.createElement("div")
    divModal.classList.add("col-xl-6")
    divModal.innerHTML = ` 
    <button type="button" class="eliminar-modal btn-close" value = "${paquetes.id}"></button> 
    <p><strong>${paquetes.nombre}</strong></p>
    <p><strong> Descripción</strong>: <br>${paquetes.detalles} </p>
    <p><strong> Precio:</strong> ${paquetes.precio} pesos por persona </p>
    <p id=personas${paquetes.id}><strong> Estas reservando para: </strong>${paquetes.personas} personas</p>    
    
`
    contenedorModal.appendChild(divModal)
    carritoLive(carrito)
}
const carritoLive = (carrito) => {
    const contadorMontoCarrito = carrito.reduce((acc, paq) => acc + paq.personas, 0)
    const sumaMontoTotal = carrito.reduce((acc, paq) => acc + (paq.precio * paq.personas), 0)
    pintarTotalesCarrito(contadorMontoCarrito, sumaMontoTotal)
    guardarEnLocalStorage(carrito)
}
const pintarTotalesCarrito = (contadorMontoCarrito, sumaMontoTotal) => {
    const contadorVacio = document.getElementById("carrito-mostrar-cantidad")
    const sumaPrecioVacio = document.getElementById("sumaPrecioAModificar")
    if (contadorMontoCarrito == 1) {
        contadorVacio.innerText = ` ${carrito.length} Paquete en carrito`
    }
    else if (contadorMontoCarrito == 0) {
        contadorVacio.innerText = ` Carrito Vacío`
    }
    else {
        contadorVacio.innerText = ` ${carrito.length} Paquetes en carrito`
    }
    sumaPrecioVacio.innerText = `$ ${sumaMontoTotal} Pesos argentinos`
}

const encontrarBotonEliminado = document.querySelector(".modal-caja")
encontrarBotonEliminado.addEventListener("click", (e) => {
    e.stopPropagation()
    if (e.target.classList.contains("eliminar-modal")) {
        eliminarPaqueteCarrito(e.target.value)
    }
})
const eliminarPaqueteCarrito = (paqueteID) => { //Esta función busca al paquete a eliminar por su ID y lo splicea, ejecutando el reseteo tanto de la escritura de carrito en el DOM (vía reseteoDomPostQuite) y la actualización de valores subtotales y de cantidad de productos en el carrito (vía carritoLive)   
    const paquetePorId = carrito.findIndex(paquete => paquete.id == paqueteID) // ATENCION: NO USAR === 
    carrito.splice(paquetePorId, 1)
    reseteoDomPostQuite(carrito)
    carritoLive(carrito)
}

const reseteoDomPostQuite = (carrito) => {  //Esta función limpa los valores que se crearon antes vía dom (vía .innerHTML = "") y los recrea. Su función es actualizar los valores de Carrito en el DOM.
    const contenedorModal = document.getElementById("contenido-modal")
    contenedorModal.innerHTML = ""   //Reseteo del DOM del modal
    carrito.forEach(paquetes => {
        const divModal = document.createElement("div")
        divModal.classList.add("col-xl-6")
        divModal.innerHTML = ` 
    <button type="button" class="eliminar-modal btn-close"  value="${paquetes.id}"></button> 
    <p><strong>${paquetes.nombre}</strong></p>
    <p><strong> Descripción</strong>: <br>${paquetes.detalles} </p>
    <p><strong> Precio:</strong> ${paquetes.precio} pesos por persona </p>
    <p id=personas${paquetes.id}><strong> Estas reservando para: </strong>${paquetes.personas} personas</p>    
`
        contenedorModal.appendChild(divModal)
    });
}

const guardarEnLocalStorage = (carrito) => {   //Utilizada en carritoLive, cada vez que se realiza un cambio se actualiza el localStorage para incluír los cambios.
    const carritoString = JSON.stringify(carrito)
    localStorage.setItem("carrito", carritoString)
}
const obtenerDelLocalStorage = () => {
    let recuperarCarrito = localStorage.getItem("carrito")
    recuperarCarrito = JSON.parse(recuperarCarrito)
    return recuperarCarrito
}


if (localStorage.getItem("carrito")) {
    carrito = obtenerDelLocalStorage()
    carritoLive(carrito)
    reseteoDomPostQuite(carrito)
}


const limpiarLocalStorage = document.querySelector("#vaciarLocalStorage")
limpiarLocalStorage.addEventListener("click", () => {
    localStorage.clear()
    console.log(localStorage)
    refresh()
})
