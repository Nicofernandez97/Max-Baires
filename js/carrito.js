let carrito = []
async function valorDolarOficial() {
    const traerDolarOficial = await fetch("https://criptoya.com/api/dolar")
    let valorDolarOficialConvertido = await traerDolarOficial.json()
    const dolarAMostrar = valorDolarOficialConvertido.oficial
    const dolarTurista = dolarAMostrar + ((dolarAMostrar * 0.3) + (dolarAMostrar * 0.45))
    return dolarTurista
}
console.log(valorDolarOficial())

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
        <p class="text-center"><strong> Subtotal ${paqueteRepetido.nombre}</strong>: ${paqueteRepetido.personas * paqueteRepetido.precio} USD </p>
        `
        carritoLive(carrito)
    }
}
const agregarAlContenedorModal = async (paquetes) => {                    //Creación y adición elementos Div con descripciones de paquetes post validación repetido. 
    const contenedorModal = document.getElementById("contenido-modal")
    const divModal = document.createElement("div")
    divModal.classList.add("col-xl-6")
    divModal.innerHTML = ` 
    <button type="button" class="eliminar-modal btn-close" value = "${paquetes.id}"></button> 
    <p><strong>${paquetes.nombre}</strong></p>
    <p><strong> Descripción</strong>: <br>${paquetes.detalles} </p>
    <p><strong> Precio:</strong> ${paquetes.precio} USD por persona </p>
    <p id=personas${paquetes.id}><strong> Estas reservando para: </strong>${paquetes.personas} persona</p>    

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
const pintarTotalesCarrito = async (contadorMontoCarrito, sumaMontoTotal) => {
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
    sumaPrecioVacio.innerText = ` Su subtotal es ${sumaMontoTotal} Dolares. \n Pagando en pesos su subtotal sería $${sumaMontoTotal * await valorDolarOficial()} Pesos argentinos.   `
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
    const cambiarNumeroPersonas = carrito.find(paquete => paquete.id == paqueteID)
    cambiarNumeroPersonas.personas = 1   //Esto lo coloqué para que cuando saque algo del carrito y lo vuelva a agregar la cantidad de personas indicadas se resetee.
    carrito.splice(paquetePorId, 1)
    reseteoDomPostQuite(carrito)
    carritoLive(carrito)
}


const valorDolarOficialEnDom = async () => {
    const dolarEnDom = document.getElementById("contenido-dolar")
    dolarEnDom.innerHTML = `Le informamos que el valor del dolar turista es de ${await valorDolarOficial()} pesos por dolar, ${fechaCompleta()}`
}
valorDolarOficialEnDom();
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
    <p><strong> Precio:</strong> ${paquetes.precio} USD por persona </p>
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
    console.log(`En el localStorage quedaron ${localStorage.length} articulos.`)
    carrito = []
    paquetes.forEach(paquete => {
        paquete.personas = 1
    })
    carritoLive(carrito)
    reseteoDomPostQuite(carrito)
})
const fechaCompleta = () => {
    const DateTime = luxon.DateTime
    let dt = DateTime.now();
    let fechaLocal = dt.toLocaleString(DateTime.DATE_SHORT)
    let horaLocal = dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS)
    return `el día ${fechaLocal} a las ${horaLocal}.`
}
