document.addEventListener('DOMContentLoaded', function () {
    const menuCards = document.getElementById('menu');
    const buscarPlatoBtn = document.getElementById('buscarPlato');
    const menu = [];

    const searchForm = document.querySelector("form[role='search']");
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const searchTerm = searchForm.querySelector("input[type='search']").value;
        filterPlato(searchTerm);
    });

    function filterPlato(palabra) {
        const platosFiltrados = menu.filter(plato => {
            return plato.nombre.toLowerCase().includes(palabra.toLowerCase());
        });
        menuCards.innerHTML = "";
        platosFiltrados.forEach(plato => {
            const card = document.createElement("div");
            card.className = "col-md-3 mb-4 ident";
            card.setAttribute("data-plato-id", plato.platoId);
            card.innerHTML = `
                <div class="card h-100 animate-hover-card">
                    <img src="data:img/jpeg;base64,${plato.imagenBase64}" class="card-img-top h-75" alt="foto plato">
                    <div class="card-body">
                        <h5 class="card-title">${plato.nombre}</h5>
                        <p class="card-text">${plato.ingredientes}</p>
                    </div>
                </div>
            `;
            menuCards.append(card);
        });
    }

    function loadMenu() {
        //envía petición al server
        var divTitulo = document.getElementById('titulo');
        fetch("/app/menu?action=getAll")
                .then(response => response.json())
                .then(data => {
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
                        putPlatos(data);
                    }
                });
    }
    loadMenu();

    function putPlatos(data) {
        data.forEach(plato => {
            menu.push(plato);
            menuCards.innerHTML += `
                            <div class="col-md-3 mb-4 ident" data-plato-id = ${plato.platoId}>
                               <div class="card h-100 animate-hover-card">
                                   <img src="data:img/jpeg;base64,${plato.imagenBase64}" class="card-img-top h-75" alt="foto plato">
                                   <div class="card-body">
                                       <h5 class="card-title">${plato.nombre}</h5>
                                       <p class="card-text">${plato.ingredientes}</p>
                                   </div>
                               </div>
                           </div> 
                       `;
        });
    }
});
