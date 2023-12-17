document.addEventListener('DOMContentLoaded', function () {
    const menuCards = document.getElementById('menu');
    const menu = [];

    //buscador
    const searchForm = document.querySelector("form[role='search']");
    const mostrarTodoCheck = document.getElementById("mostrarTodo");
    const buscador = document.getElementById("buscador");
    const buscarPlatoBtn = document.getElementById('buscarPlato');

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

    function filterPlato(palabra, mostrarTodo) {
        const platosFiltrados = menu.filter(plato => {
            //filtro (nombre o ingredientes) y !enFalta
            const nombreIncluyePalabra = plato.nombre.toLowerCase().includes(palabra.toLowerCase());
            const ingredientesIncluyenPalabra = plato.ingredientes.toLowerCase().includes(palabra.toLowerCase());
            const enFaltaCumpleCondicion = mostrarTodo ? true : !plato.enFalta;
            return (nombreIncluyePalabra || ingredientesIncluyenPalabra) && enFaltaCumpleCondicion;
        });

        //ordeno platos en platosFiltrados              deja igual      al final    principio
        platosFiltrados.sort((a, b) => (a.enFalta === b.enFalta) ? 0 : a.enFalta ? 1 : -1);
        
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
                colorEnFalta = "colorCartaEnFalta";
            } else {
                enFaltaP = "";
                colorEnFalta = "";
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