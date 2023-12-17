document.addEventListener('DOMContentLoaded', function () {

    const imagenElement = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagenPreview');
    const imagenContainer = document.getElementById('imagenContainer');

    imagenElement.addEventListener('change', function () {
        const selectedImage = imagenElement.files[0];
        if (selectedImage) {
            // Verificar si el archivo es una imagen
            if (!/^image\//.test(selectedImage.type)) {
                Toastify({
                    text: "Por favor, selecciona un archivo de imagen válido.",
                    style: {
                        background: "linear-gradient(to right, #dc3545, #dc3545)",
                    },
                    duration: 3000
                }).showToast();
<<<<<<< HEAD
                limpiarFormulario();
=======
>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
                return;
            }
            //if (selectedImage.size > 65535) {
            //  Toastify({
            //    text: "El archivo seleccionado supera el tamaño máximo permitido de 65535 bytes.",
            //  style: {
            //    background: "linear-gradient(to right, #dc3545, #dc3545)",
            //},
            //duration: 3000
            //}).showToast();
            //return;
            //}
            //
            //muestro preview
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenPreview.src = e.target.result;
                imagenContainer.classList.remove("d-none");
            };
            reader.readAsDataURL(selectedImage);
        } else {
            imagenPreview.src = "";
        }
    });

    //btn limpiar form
    const limpiarFormBtn = document.getElementById('limpiarFormBtn');
    limpiarFormBtn.addEventListener('click', function () {
        limpiarFormulario();
    });

    //enviar form
    const addForm = document.getElementById('addForm');

    addForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(addForm);

        formData.append('action', "add");

        // Obtener el valor del tipo de plato seleccionado y agregar al FormData
        const tipoPlatoRadioButtons = document.querySelectorAll('input[name="tipoPlato"]');
        let tipoPlatoSeleccionado;

        tipoPlatoRadioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                tipoPlatoSeleccionado = radioButton.value;
            }
        });

        formData.append('tipoPlato', tipoPlatoSeleccionado);

        try { // si respondo con un json puedo enviar directamente el mensaje
            const response = await fetch('/app/menu', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                limpiarFormulario();
                Toastify({
                    text: "Plato guardado exitosamente.",
                    style: {
                        background: "linear-gradient(to right, #28a745, #28a745)",
                    },
                    duration: 3000
                }).showToast();
            } else {
                Toastify({
                    text: "Error al guardar el archivo.",
                    style: {
                        background: "linear-gradient(to right, #dc3545, #dc3545)",
                    },
                    duration: 3000
                }).showToast();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Toastify({
                text: "Error en la solicitud, para más información consulte el log.",
                style: {
                    background: "linear-gradient(to right, #dc3545, #dc3545)",
                },
                duration: 3000
            }).showToast();
        }
    });
    
    //fx limpiar form
    function limpiarFormulario() {
        var formulario = document.getElementById('addForm');
        formulario.reset();
        var checkboxes = formulario.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
        imagenContainer.classList.add("d-none");
    }
});



