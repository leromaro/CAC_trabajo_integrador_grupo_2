
//fx mostrar modal
window.mostrarInformacion = function (idS, nombre, ingredientes, tipoPlato, imagen, precio, alPlatoS, aptoCeliacoS, aptoVeganoS, enFaltaS) {
    //vienen como string
    const id = parseInt(idS);
    const alPlato = JSON.parse(alPlatoS);
    const aptoCeliaco = JSON.parse(aptoCeliacoS);
    const aptoVegano = JSON.parse(aptoVeganoS);
    const enFalta = JSON.parse(enFaltaS);
    const clickedBookId = 0;

    //cargo info en el modal
    const informacionPlato = document.getElementById('informacionPlato');
    if (enFalta) {
        enFaltaP = `<p class="card-text">¡En falta!</p>`;
    } else {
        enFaltaP = "";
    }
    informacionPlato.innerHTML = `
        <div class="col-md-3 mb-4 ident">
            <div class="card h-100>
                <div class="card-body">
                    <h4 class="card-title text-center my-3" id="nombre">${idS} - ${nombre}</h5>
                    <p class="card-text mx-3" id="ingredientes">Ingredientes: ${ingredientes}</p>
                    <p class="card-text mx-3" id="tipoPlato">Tipo de Plato: ${tipoPlato}</p>
                    <p class="card-text mx-3" id="precio">Precio: ${precio}</p>
                    <p class="card-text mx-3" id="alPlato">Al plato: ${alPlato ? 'Sí' : 'No'}</p>
                    <p class="card-text mx-3" id="aptoCeliaco">Apto celiaco: ${aptoCeliaco ? 'Sí' : 'No'}</p>
                    <p class="card-text mx-3" id="aptoVegano">Apto vegano: ${aptoVegano ? 'Sí' : 'No'}</p>
                    <div class="card-text mx-3 mb-3" style="background-color: red; color: yellow; width: 85%; text-align: center;  border-radius: 10px;">
                    ${enFaltaP}
                </div>
            </div>
        </div>
        <div class="col-md-6 mb-8 ident">
            <div class="clearfix text-center">
                <img src="data:img/jpeg;base64,${imagen}" class="card-img-top h-50" alt="foto plato" id="imagen">               
            </div>
        </div>
    `;
    const btnModal = document.getElementById('btnModal');
    btnModal.innerHTML = `
        <button type="button" class="btn btn-danger ident" id="borrarBtn" data-plato-id = ${id}>Baja</button>
        <button type="button" class="btn btn-warning ident" id="modificarBtn" data-plato-id = ${id}>Modificar</button>
        <button type="button" class="btn btn-secondary" id="cerrarBtn">Cerrar</button>
    `

    //diseño modal no me funciona
    const modal = document.getElementById('modal');

    modal.style.display = 'block';

    const borrarBtn = document.getElementById("borrarBtn");
    const modificarBtn = document.getElementById("modificarBtn");
    const cerrarBtn = document.getElementById("cerrarBtn");
    mensaje = "";
    color = "#28a745, #28a745";

    //doy información de botones y mensajes
    if (enFalta) {
        borrarBtn.innerText = 'Alta';
        borrarBtn.classList.replace('btn-danger', 'btn-success');
        mensaje = "Plato dado de alta.";
    } else {
        borrarBtn.innerText = 'Baja';
        borrarBtn.classList.replace('btn-success', 'btn-danger');
        mensaje = "Plato dado de baja.";
    }

    //evento cerrar
    document.getElementById('cerrarBtn').addEventListener('click', function () {
        cerrarModal();
    });
    function cerrarModal() {
        const modal = document.getElementById('modal');
        const informacionPlato = document.getElementById('informacionPlato');
        informacionPlato.innerHTML = "";
        document.getElementById('borrarBtn').removeEventListener('click', borrarPlato);
        document.getElementById('modificarBtn').removeEventListener('click', modificarPlato);
        document.getElementById('cerrarBtn').removeEventListener('click', cerrarModal);
        modal.style.display = 'none';
    }
    //evento altaBaja
    document.getElementById('borrarBtn').addEventListener('click', function () {
        event.stopPropagation();
        var clickedPlatoId = this.dataset.platoId;
        borrarPlato(clickedPlatoId);
    });

    //evento modificar
    document.getElementById('modificarBtn').addEventListener('click', function () {
        event.stopPropagation();
        var clickedPlatoId = this.dataset.platoId;
        modificarPlato(clickedPlatoId);
    });

};

function cerrarModal() {
    const modal = document.getElementById('modal');
    const informacionPlato = document.getElementById('informacionPlato');
    informacionPlato.innerHTML = "";
    document.getElementById('borrarBtn').removeEventListener('click', borrarPlato);
    document.getElementById('modificarBtn').removeEventListener('click', modificarPlato);
    document.getElementById('cerrarBtn').removeEventListener('click', cerrarModal);
    modal.style.display = 'none';
}

function borrarPlato(id) {
    cerrarBtn.classList.add('d-none');
    borrarBtn.classList.add('d-none');
    modificarBtn.classList.add('d-none');

    const formData = new FormData();
    formData.append('action', "delete");
    formData.append('id', id);

    fetch(`/app/menu`, {
        method: 'POST',
        body: formData
    })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al borrar el plato. Código de estado: ${response.status}`);
                }
            })
            .then(data => {
                Toastify({
                    text: mensaje,
                    style: {
                        background: `linear-gradient(to right, ${color})`,
                    },
                    duration: 2000
                }).showToast();
                setTimeout(function () {
                    // Recargar la página
                    location.reload();
                }, 3000);
            })
            .catch(error => {
                console.error('Error al intentar borrar el plato:', error.message);
            });
}
function modificarPlato(id) {
    cerrarBtn.classList.add('d-none');
    borrarBtn.classList.add('d-none');
    modificarBtn.classList.add('d-none');

    fetch(`/app/menu?action=getDetails&id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al envíar el plato. Código de estado: ${response.status}`);
                }
                return response.json(); // Parsear la respuesta como JSON
            })
            .then(data => {
                const queryParams = new URLSearchParams({
                    id: data.platoId
                });
                Toastify({
                    text: "Enviado a modificar",
                    style: {
                        background: `linear-gradient(to right, ${color})`,
                    },
                    duration: 2000
                }).showToast();
                setTimeout(function () {
                    // Redirigir a la página
                    window.location.href = `/app/pages/modificar_plato.html?${queryParams.toString()}`;
                }, 2000);
            })
            .catch(error => {
                console.error('Error en la solicitut GET:', error.message);
            });
}

document.addEventListener('DOMContentLoaded', function () {
    const menuCards = document.getElementById('menu');
    const menu = [];

    //buscador
    const searchForm = document.querySelector("form[role='search']");
    const mostrarTodoCheck = document.getElementById("mostrarTodo");
    const buscador = document.getElementById("buscador");
    const buscarPlatoBtn = document.getElementById('buscarPlato');

<<<<<<< HEAD
    buscador.addEventListener("search", function () {
        console.log("pasa");
        buscarPlatoBtn.click();
    });

    //cambio check
    mostrarTodoCheck.addEventListener("change", function () {
        const searchTerm = searchForm.querySelector("input[type='search']").value;
        const mostrarTodo = mostrarTodoCheck.checked;
        filterPlato(searchTerm, mostrarTodo);
    });

    //presiono botón buscar
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const searchTerm = searchForm.querySelector("input[type='search']").value;
        const mostrarTodo = mostrarTodoCheck.checked;
        filterPlato(searchTerm, mostrarTodo);
    });

=======
    //al borrar contenido -> search
    buscador.addEventListener("search", searchEvent);

    //cambio check -> search
    mostrarTodoCheck.addEventListener("change", searchEvent);

    //click botón buscar -> search
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchEvent();
    });

    function searchEvent() {
        const searchTerm = searchForm.querySelector("input[type='search']").value;
        const mostrarTodo = mostrarTodoCheck.checked;
        filterPlato(searchTerm, mostrarTodo);
    }

>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
    function filterPlato(palabra, mostrarTodo) {
        const platosFiltrados = menu.filter(plato => {
            //filtro (nombre o ingredientes) y !enFalta
            const nombreIncluyePalabra = plato.nombre.toLowerCase().includes(palabra.toLowerCase());
            const ingredientesIncluyenPalabra = plato.ingredientes.toLowerCase().includes(palabra.toLowerCase());
            const enFaltaCumpleCondicion = mostrarTodo ? true : !plato.enFalta;
            return (nombreIncluyePalabra || ingredientesIncluyenPalabra) && enFaltaCumpleCondicion;
        });
<<<<<<< HEAD
=======
        //ordeno platos en platosFiltrados              deja igual      al final    principio
        platosFiltrados.sort((a, b) => (a.enFalta === b.enFalta) ? 0 : a.enFalta ? 1 : -1);
        
>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
        //elimino duplicados
        const platosFiltradosSinDuplicados = Array.from(new Set(platosFiltrados));
        menuCards.innerHTML = "";
        platosFiltradosSinDuplicados.forEach(plato => {

            const card = document.createElement("div");
            card.className = "col-md-3 mb-4 ident";
            card.setAttribute("data-plato-id", plato.platoId);
            //agrego evento a las card filtradas
            card.addEventListener("click", function () {
                mostrarInformacion(plato.platoId, plato.nombre, plato.ingredientes, plato.tipoPlato, plato.imagenBase64, plato.precio, plato.alPlato, plato.aptoCeliaco, plato.aptoVegano, plato.enFalta);
            });
            if (plato.enFalta) {
                enFaltaP = `<p class="card-text">¡En falta!</p>`;
<<<<<<< HEAD
            } else {
                enFaltaP = "";
=======
                colorEnFalta = "colorCartaEnFalta";
            } else {
                enFaltaP = "";
                colorEnFalta = "";
>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
            }
            card.innerHTML = `
                <div class="card h-100 animate-hover-card ${colorEnFalta}">
                    <img src="data:img/jpeg;base64,${plato.imagenBase64}" class="card-img-top h-75" alt="foto plato">
                    <div class="card-body">
                        <h5 class="card-title">${plato.nombre}</h5>
                        <p class="card-text">${plato.ingredientes}</p>
                        <div class="card-text" style="background-color: red; color: yellow; width: 100%; text-align: center;  border-radius: 10px;">
                        ${enFaltaP}
                    </div>
                </div>
            `;
            menuCards.append(card);
        });// ver si puedo mandar a la funcion y porque se deforma la imagen
    }

    //carga info cards
    function loadMenu() {
        //envía petición al server
        fetch("/app/menu?action=getAll")
                .then(response => response.json())
                .then(data => {
<<<<<<< HEAD
                    //control no hay platos
                    if (data.length === 0) {
                        divTitulo.classList.replace('bg-secondary', 'bg-danger');
                        menuCards.innerHTML += `
                            <div class="col-md-3 mb-4 ident">
                               <div class="card h-100 animate-hover-card">
                                   <img src="media/sinPlatos.avif" class="card-img-top h-75" alt="sin plato">
                                   <div class="card-body">
                                       <h5 class="card-title">Sin platos</h5>
                                   </div>
                               </div>
                           </div> 
                        `;
                    } else {
                        divTitulo.classList.replace('bg-danger', 'bg-secondary');
                        data.forEach(plato => {
                            menu.push(plato);
                            //control en falta
                            if (plato.enFalta) {
                                enFaltaP = `<p class="card-text">¡En falta!</p>`;
                            } else {
                                enFaltaP = "";
                            }
                            menuCards.innerHTML += `
                                <div class="col-md-3 mb-4 ident" data-plato-id = ${plato.platoId} 
                                    onclick="mostrarInformacion('${plato.platoId}', '${plato.nombre}', '${plato.ingredientes}', '${plato.tipoPlato}', '${plato.imagenBase64}', '${plato.precio}', '${plato.alPlato}', '${plato.aptoCeliaco}', '${plato.aptoVegano}', '${plato.enFalta}')">
                                    <div class="card h-100 animate-hover-card">
                                        <img src="data:img/jpeg;base64,${plato.imagenBase64}" class="card-img-top h-75" alt="foto plato">
                                        <div class="card-body">
                                            <h5 class="card-title">${plato.nombre}</h5>
                                            <p class="card-text">${plato.ingredientes}</p>
                                            <div class="card-text" style="background-color: red; color: yellow; width: 100%; text-align: center;  border-radius: 10px;">
                                            ${enFaltaP}
                                        </div>
                                    </div>
                                </div> 
                            `;
                        });
                    }
                });
    }
=======
                    mostrarCards(data);
                });
    }

    function mostrarCards(data) {
        var divTitulo = document.getElementById('titulo');
        //control no hay platos
        if (data.length === 0) {
            divTitulo.classList.replace('bg-secondary', 'bg-danger');
            menuCards.innerHTML += `
                <div class="col-md-3 mb-4">
                   <div class="card h-100">
                       <img src="media/sinPlatos.png" class="card-img-top h-75" alt="sin plato">
                       <div class="card-body">
                           <h5 class="card-title">Sin platos</h5>
                       </div>
                   </div>
               </div> 
            `;
        } else {
            //ordeno platos en data                 deja igual      al final    principio
            data.sort((a, b) => (a.enFalta === b.enFalta) ? 0 : a.enFalta ? 1 : -1);
            divTitulo.classList.replace('bg-danger', 'bg-secondary');
            data.forEach(plato => {
                menu.push(plato);
                //control en falta
                if (plato.enFalta) {
                    enFaltaP = `<p class="card-text">¡En falta!</p>`;
                    colorEnFalta = "colorCartaEnFalta";
                } else {
                    enFaltaP = "";
                    colorEnFalta = "";
                }
                menuCards.innerHTML += `
                    <div class="col-md-3 mb-4 ident" data-plato-id = ${plato.platoId} 
                        onclick="mostrarInformacion('${plato.platoId}', '${plato.nombre}', '${plato.ingredientes}', '${plato.tipoPlato}', '${plato.imagenBase64}', '${plato.precio}', '${plato.alPlato}', '${plato.aptoCeliaco}', '${plato.aptoVegano}', '${plato.enFalta}')">
                        <div class="card h-100 animate-hover-card ${colorEnFalta}">
                            <img src="data:img/jpeg;base64,${plato.imagenBase64}" class="card-img-top h-75" alt="foto plato">
                            <div class="card-body">
                                <h5 class="card-title">${plato.nombre}</h5>
                                <p class="card-text">${plato.ingredientes}</p>
                                <div class="card-text" style="background-color: red; color: yellow; width: 100%; text-align: center;  border-radius: 10px;">
                                ${enFaltaP}
                            </div>
                        </div>
                    </div> 
                `;
            });
        }
    }

>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
    //click en la card guarda Id y llama a window.mostrarInformación qu está en el div de cada card
    menuCards.addEventListener('click', function (e) {
        const clickedCard = e.target.closest(".ident");
        if (!clickedCard) {
            return;
        } else {
            clickedBookId = clickedCard.dataset.platoId;
        }
    });
    loadMenu();
});