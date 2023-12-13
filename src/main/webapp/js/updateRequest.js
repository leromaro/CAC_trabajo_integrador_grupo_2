document.addEventListener('DOMContentLoaded', function () {
// Obtener parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const platoDetailId = {
        id: queryParams.get("id")
    };

    //Imagen
    const imagenElement = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagenPreview');
    const imagenContainer = document.getElementById('imagenContainer');

    let plato = {
        id: 0,
        nombre: "",
        ingredientes: "",
        tipoPlato: "",
        precio: 0,
        imagen: "",
        alPlato: false,
        aptoCeliaco: false,
        aptoVegano: false
    };

    function loadPlato() {
        fetch(`/app/menu?action=getById&id=${platoDetailId.id}`)
                .then(response => response.json())
                .then(data => {
                    //Llenar los campos en la página de modificar
                    document.getElementById('nombre').value = data.nombre;
                    document.getElementById('ingredientes').value = data.ingredientes;

                    const tipoPlatoRadios = document.getElementsByName('tipoPlato');
                    for (const radio of tipoPlatoRadios) {
                        if (radio.value === data.tipoPlato) {
                            radio.checked = true;
                            break;
                        }
                    }

                    document.getElementById('precio').value = parseFloat(data.precio);
                    const alPlatoCheck = document.querySelector('#alPlato');
                    alPlatoCheck.checked = data.alPlato;
                    const aptoCeliacoCheck = document.querySelector('#aptoCeliaco');
                    aptoCeliacoCheck.checked = data.aptoCeliaco;
                    const aptoVeganoCheck = document.querySelector('#aptoVegano');
                    aptoVeganoCheck.checked = data.aptoVegano;

                    imagenPreview.src = `data:img/jpeg;base64,${data.imagenBase64}`;

                    plato.id = data.id;
                    plato.nombre = data.nombre;
                    plato.ingredientes = data.ingredientes;
                    plato.tipoPlato = data.tipoPlato;
                    plato.precio = data.precio;
                    plato.imagen = data.imagenBase64;
                    plato.alPlato = data.alPlato;
                    plato.aptoCeliaco = data.aptoCeliaco;
                    plato.aptoVegano = data.aptoVegano;
                });
    }

    loadPlato();

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
                limpiarFormulario();
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
            };
            reader.readAsDataURL(selectedImage);
        } else {
            imagenPreview.src = "";
        }
    });

    const modificarForm = document.getElementById('modificarFormBtn');

    //btn limpiar form
    const limpiarForm = document.getElementById('limpiarFormBtn');
    limpiarForm.addEventListener('click', function () {
        limpiarFormulario();
    });

    //enviar form
    const addForm = document.getElementById('addForm');
    addForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(addForm);
        formData.append('action', "update");
        formData.append('id', platoDetailId.id);

        // Obtener el valor del tipo de plato seleccionado y agregar al FormData
        const tipoPlatoRadioButtons = document.querySelectorAll('input[name="tipoPlato"]');
        let tipoPlatoSeleccionado;
        tipoPlatoRadioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                tipoPlatoSeleccionado = radioButton.value;
            }
        });
        formData.append('tipoPlato', tipoPlatoSeleccionado);

        //Obtener imagen
        const selectedImage = imagenElement.files[0];
        if (selectedImage) {
            formData.append('imagen', selectedImage);
        }
        try {
            const response = await fetch('/app/menu', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                limpiarForm.classList.add('d-none');
                modificarForm.classList.add('d-none');
                Toastify({
                    text: "Plato modificado exitosamente.",
                    style: {
                        background: "linear-gradient(to right, #28a745, #28a745)",
                    },
                    duration: 3000
                }).showToast();
                setTimeout(function () {
                    // Redirigir a la página
                    window.location.href = `/app/index.html`;
                }, 3000);

            } else {
                limpiarForm.classList.remove('d-none');
                modificarForm.classList.remove('d-none');

                Toastify({
                    text: "Error al modificar el plato.",
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

    //fx reset form
    function limpiarFormulario() {
        document.getElementById('nombre').value = plato.nombre;
        document.getElementById('ingredientes').value = plato.ingredientes;

        const tipoPlatoRadios = document.getElementsByName('tipoPlato');
        for (const radio of tipoPlatoRadios) {
            if (radio.value === plato.tipoPlato) {
                radio.checked = true;
                break;
            }
        }

        document.getElementById('precio').value = parseFloat(plato.precio);
        const alPlatoCheck = document.querySelector('#alPlato');
        alPlatoCheck.checked = plato.alPlato;
        const aptoCeliacoCheck = document.querySelector('#aptoCeliaco');
        aptoCeliacoCheck.checked = plato.aptoCeliaco;
        const aptoVeganoCheck = document.querySelector('#aptoVegano');
        aptoVeganoCheck.checked = plato.aptoVegano;

        imagenPreview.src = `data:img/jpeg;base64,${plato.imagen}`;
    }
});
