document.addEventListener('DOMContentLoaded', function () {
    const limpiarFormBtn = document.getElementById('limpiarFormBtn');
    limpiarFormBtn.addEventListener('click', function () {
        limpiarFormulario();
    });

    const guardarFormBtn = document.getElementById('guardarFormBtn');
    document.getElementById('addForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const addForm = document.getElementById('addForm');
        const formData = new FormData(addForm);

        console.log("Imagen antes de enviar:");
        for (const entry of formData.entries()) {
            console.log(entry[0], entry[1]);
        }

        try {
            const response = await fetch('/app/menu', {
                method: 'POST',
                body: formData,
            });

            console.log(response.status);
            console.log(await response.text());

            if (response.ok) {
                limpiarFormulario();
                alert('Plato guardado exitosamente');
            } else {
                alert('Error al guardar el plato');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud, consulta la consola para más detalles.');
        }
    });
});

function limpiarFormulario() {
    var formulario = document.getElementById('addForm');
    formulario.reset();
    var checkboxes = formulario.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
}

