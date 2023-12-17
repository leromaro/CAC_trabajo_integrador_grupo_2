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
    const imagenBase64 = `data:img/jpeg;base64,${imagen}`;
    const imagenHtml = `<img src="${imagenBase64}" class="card-img-top" alt="foto plato" id="imagen">`;
    if (enFalta) {
        enFaltaP = `<p class="card-text">¡En falta!</p>`;
        colorEnFalta = "colorCartaEnFalta";
    } else {
        enFaltaP = "";
        colorEnFalta = "";
    }
    informacionPlato.innerHTML = `
        <div class="row">
           <div class="col-md-3 mb-4 ident">
               <div class="card h-100 ${colorEnFalta}">
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
           </div>
           <div class="col-md-6 mb-8 ident">
           <div class="clearfix text-center">
               ${imagenHtml}
           </div>
           </div>
       </div>
    `;
    const btnModal = document.getElementById('btnModal');
    btnModal.innerHTML = `
        <button type="button" class="btn btn-danger ident" id="borrarBtn" data-plato-id = ${id}>Baja</button>
        <button type="button" class="btn btn-warning ident mx-3 my-3" id="modificarBtn" data-plato-id = ${id}>Modificar</button>
        <button type="button" class="btn btn-secondary" id="cerrarBtn">Cerrar</button>
    `;

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
                    text: "Plato enviado a modificar.",
                    style: {
                        background: `linear-gradient(to right, ${color})`,
                    },
                    duration: 2000
                }).showToast();
                setTimeout(function () {
                    // Redirigir a la página
                    console.log(queryParams.toString())
                    window.location.href = `/app/pages/modificar_plato.html?${queryParams.toString()}`;
                    cerrarBtn.classList.remove('d-none');
                    borrarBtn.classList.remove('d-none');
                    modificarBtn.classList.remove('d-none');
                }, 2000);
            })
            .catch(error => {
                console.error('Error en la solicitut GET:', error.message);
            });
}
