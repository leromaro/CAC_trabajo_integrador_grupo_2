document.addEventListener('DOMContentLoaded', function () {
    const menuCards = document.getElementById('menu');
    const buscarPlatoBtn = document.getElementById('buscarPlato');
    const menu = [];

    buscarPlatoBtn.addEventListener('click', function ()
    {
        buscarPlato();
    });

    function buscarPlato() {
        var input, filter, cards, card, title, i;
        input = document.getElementById("buscador");
        filter = input.value.toUpperCase();
        cards = document.getElementById("menu").getElementsByClassName("card");
        for (i = 0; i < cards.length; i++) {
            card = cards[i];
            title = card.querySelector(".card-title");

            if (title && title.innerText && title.innerText.toUpperCase().indexOf(filter) > -1) {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        }
    }

    function loadMenu() {
        //envía petición al server
        fetch("/app/menu?action=getAll")
                .then(response => response.json())
                .then(data => {
                    putPlatos(data);
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
