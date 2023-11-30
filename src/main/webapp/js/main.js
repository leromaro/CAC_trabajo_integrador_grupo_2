
function buscarPlato() {
    var input, filter, cards, card, title, i;
    input = document.getElementById("buscador");
    filter = input.value.toUpperCase();
    cards = document.getElementById("menu").getElementsByClassName("card");

    for (i = 0; i < cards.length; i++) {
        card = cards[i];
        title = card.querySelector(".card-title");
        if (title.innerText.toUpperCase().indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

    function limpiarFormulario() {
        // Obtener el formulario por su ID
        var formulario = document.getElementById('miFormulario');
        
        // Resetear el formulario para borrar los campos
        formulario.reset();

        // Desmarcar los checkboxes
        var checkboxes = formulario.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
