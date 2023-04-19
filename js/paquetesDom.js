const llamadoProductos = () => { //Agrega productos del array paquetes (Creado en paquetes.js) al HTML de sectorcompras.

  const contenedorDom = document.getElementById("contenedor-dom")

  paquetes.forEach(paquete => {
    const div = document.createElement("div")
    div.className = "col-sm-12 col-xl-6"
    div.innerHTML = `
        <div class="card text-center border-warning card">
              <img src="${paquete.imagen}" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${paquete.nombre}</h5>
                <p class="card-text">${paquete.detalles} </p>
                <p class="card-text"> Precio: $ ${paquete.precio} Por persona </p>
                <a id=${paquete.id} class="btn btn-primary transformacion modalAdd">Reserva!</a>
              </div >
              </div >
  `
    contenedorDom.appendChild(div)
  })
}
llamadoProductos()

