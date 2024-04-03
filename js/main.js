document.addEventListener("DOMContentLoaded", function() {
    let carrito = [];

    // Cargar datos de cafes desde el archivo JSON
    fetch("./json/data.json")
        .then(response => response.json())
        .then(data => {
            mostrarCafes(data);
        });

    // Mostrar los cafes en el DOM
    function mostrarCafes(cafes) {
        const deliciasContainer = document.getElementById("delicias");
                
        cafes.delicias.forEach(v => {
            const cafeDiv = crearCafeDiv(v);
            deliciasContainer.appendChild(cafeDiv);
        });

        // Cargar el carrito guardado en el almacenamiento local
        cargarCarritoLocalStorage();
    }

    // Crear elemento de cafe en el DOM
    function crearCafeDiv(cafe) {
        const cafeDiv = document.createElement("div");
        cafeDiv.classList.add("cafe");
        cafeDiv.innerHTML = `
            <img src="${cafe.imagen}" alt="${cafe.nombre}">
            <h3>${cafe.nombre}</h3>
            <p>$${cafe.precio}</p>
            <button class="agregar" data-id="${cafe.id}">Agregar al Carrito</button>
        `;
    
        cafeDiv.querySelector('.agregar').addEventListener("click", () => {
            agregarAlCarrito(cafe);
        });
            
        return cafeDiv;
    }

    // Agregar cafes seleccionados al carrito
    function agregarAlCarrito(cafe) {
        const index = carrito.findIndex(item => item.id === cafe.id);
        if (index !== -1) {
            carrito[index].cantidad++;
        } else {
            carrito.push({ ...cafe, cantidad: 1 });
        }
        mostrarCarrito();
        guardarCarritoLocalStorage();
    }
    // Mostrar el contenido del carrito en el DOM
    function mostrarCarrito() {
        const resumenDiv = document.getElementById("resumen");
        resumenDiv.innerHTML = "";

        carrito.forEach(cafe => {
            const cafeDiv = document.createElement("div");
            cafeDiv.innerHTML = `
                <span>${cafe.nombre} - $${cafe.precio}</span>
                <button class="agregar" data-id="${cafe.id}">+</button>
                <span>${cafe.cantidad}</span>
                <button class="quitar" data-id="${cafe.id}">-</button>
            `;
            resumenDiv.appendChild(cafeDiv);

            // Agregar evento para agregar una unidad al artículo
            cafeDiv.querySelector('.agregar').addEventListener('click', () => {
                aumentarCantidad(cafe.id);
            });

            // Agregar evento para quitar una unidad al artículo
            cafeDiv.querySelector('.quitar').addEventListener('click', () => {
                disminuirCantidad(cafe.id);
            });
        });

        mostrarTotalCompra(); // Mostrar el total de la compra
    }

    // Calcular el total de la compra
    function calcularTotalCompra() {
        let total = 0;
        carrito.forEach(cafe => {
            total += cafe.precio * cafe.cantidad;
        });
        return total;
    }

    // Mostrar el total de la compra en el DOM
    function mostrarTotalCompra() {
        const totalCompraDiv = document.getElementById("total-compra");
        const total = calcularTotalCompra();
        totalCompraDiv.textContent = `Su compra es: $${total}`;
    }

    // Aumentar la cantidad de cafes en el carrito
    function aumentarCantidad(id) {
        const index = carrito.findIndex(item => item.id === id);
        if (index !== -1) {
            carrito[index].cantidad++;
            mostrarCarrito();
        }
    }

    // Disminuir la cantidad de cafes en el carrito
    function disminuirCantidad(id) {
        const index = carrito.findIndex(item => item.id === id);
        if (index !== -1) {
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            } else {
                carrito.splice(index, 1); // Si la cantidad es 1, eliminar el artículo del carrito
            }
            mostrarCarrito();
        }
    }

     // Guardar el carrito en el almacenamiento local
     function guardarCarritoLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Cargar el carrito desde el almacenamiento local
    function cargarCarritoLocalStorage() {
        if (localStorage.getItem('carrito')) {
            carrito = JSON.parse(localStorage.getItem('carrito'));
            mostrarCarrito(); // Mostrar el carrito guardado al cargar la página
        }
    }
     // Limpiar el carrito
     document.getElementById("limpiar-carrito").addEventListener("click", () => {
        carrito.splice(0, carrito.length);
        mostrarCarrito();
        guardarCarritoLocalStorage(); // Guardar el carrito vacío
    });

 // Finalizar la compra 
    document.getElementById("finalizar-compra").addEventListener("click", () => {
    Swal.fire({
        title: '¡Gracias por su compra!',
        text: '¡Vuelva pronto!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        resetearCarrito(); // Llama a la función para restablecer el carrito
    });
});

     // Función para restablecer el carrito a cero
     function resetearCarrito() {
        carrito = [];
        mostrarCarrito();
        guardarCarritoLocalStorage(); 
    }
});

