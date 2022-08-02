let carrito = [];
const moneda = "$";
const productosCarrito = document.getElementById("productos");
const carritoDeCompras = document.getElementById("carrito");
const total = document.getElementById("total");
const btnVaciar = document.getElementById("boton-vaciar");
const carritoGuardado = window.localStorage;
const mensajeEnvio = document.getElementById("mensajeEnvio");

// Funciones
// agrega/muestra visualmente al DOM los productos disponibles
// obtenemos los productos de json
const obtenerProductos = async () => {
    const respuesta = await fetch("productos.json");
    const productos = await respuesta.json();

    productos.forEach((producto) => {
        // Estructura de la card con la informacion de imagen, nombre, precio y botón
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.classList.add("card", "col-sm-4");
        // Body
        const bodyCard = document.createElement("div");
        bodyCard.classList.add("card-body");
        const nombreProducto = document.createElement("h5");
        nombreProducto.classList.add("card-title");
        nombreProducto.textContent = producto.nombre;
        const imagenProducto = document.createElement("img");
        imagenProducto.classList.add("img-fluid");
        imagenProducto.setAttribute("src", producto.imagen);
        const precioProducto = document.createElement("p");
        precioProducto.classList.add("card-text");
        precioProducto.textContent = `${moneda} ${producto.precio}.00 mxn`;
        const botonAgregar = document.createElement("button");
        botonAgregar.classList.add("btn", "btn-primary");
        botonAgregar.textContent = "Agregar al Carrito";
        botonAgregar.setAttribute("marcador", producto.id);
        botonAgregar.addEventListener("click", agregaProductos);
        // Insertamos los nodos al DOM
        bodyCard.appendChild(imagenProducto);
        bodyCard.appendChild(nombreProducto);
        bodyCard.appendChild(precioProducto);
        bodyCard.appendChild(botonAgregar);
        tarjetaProducto.appendChild(bodyCard);
        productosCarrito.appendChild(tarjetaProducto);
    });

    //Funcion para agregar productos al carrito
    function agregaProductos(evento) {
        // Pusheamos el producto al carrito
        carrito.push(evento.target.getAttribute("marcador"));
        actualizarCarrito();
        guardaCarrito();
    }

    // funcion paara actualizar los productos que se agregaron al carrito
    function actualizarCarrito() {
        carritoDeCompras.textContent = ""; // se inicia con el carrito vacío
        const sinProductosRepetidos = [...new Set(carrito)]; // unimos los elementos repetidos
        sinProductosRepetidos.forEach((item) => {
            // Obtenemos el item o producto del array de objetos "productos"
            const miItem = productos.filter((itemProductos) => {
                return itemProductos.id === parseInt(item); //
            });
            const cantidadItem = carrito.reduce((total, itemId) => {
                return itemId === item ? (total += 1) : total;
            }, 0);
            // nodo del carrito
            const miNodo = document.createElement("li");
            miNodo.classList.add("list-group-item", "text-right", "mx-2");
            miNodo.textContent = `${cantidadItem} x ${miItem[0].nombre} precio/u: ${moneda} ${miItem[0].precio}.00`;
            // dibijamos el boton de eliminar el producto del carrito
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-outline-danger", "mx-2");
            btnEliminar.textContent = "eliminar";
            btnEliminar.style.marginLeft = "1rem";
            btnEliminar.dataset.item = item;
            btnEliminar.addEventListener("click", borrarPCarrito);
            miNodo.appendChild(btnEliminar);
            carritoDeCompras.appendChild(miNodo);
        });
        // Actualizamos el precio total de los productos agregados al carrito de compras
        total.textContent = sumaTotal();
        mensajeEnvio.textContent = envioGratis();
    }

    //funcion para borrar productos del carrito
    function borrarPCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        actualizarCarrito();
        guardaCarrito();
    }

    // funcion para obtener la suma total de los precios de los productos
    function sumaTotal() {
        // Recorremos primero el array del carrito
        return carrito
            .reduce((total, item) => {
                const miItem = productos.filter((itemProductos) => {
                    return itemProductos.id === parseInt(item);
                });
                return total + miItem[0].precio;
            }, 0)
            .toFixed(2);
    }

    //funcion para saber si hay envío gratis

    function envioGratis() {
        // Recorremos primero el array del carrito
        const total = carrito.reduce((total, item) => {
            const miItem = productos.filter((itemProductos) => {
                return itemProductos.id === parseInt(item);
            });
            return (total += miItem[0].precio);
        }, 0);
        return total > 4000 ? "¡Envío GRATIS!" : "aún no aplica para envío gratis";
    }

    //funcion para localStorage
    function guardaCarrito() {
        carritoGuardado.setItem("carrito", JSON.stringify(carrito));
    }

    //funcion para cargar el carrito si es que hay alguno en localstorage, primero se evalua si hay un carrito guardado
    function cargarCarritoGuardado() {
        if (carritoGuardado.getItem("carrito") !== null) {
            carrito = JSON.parse(carritoGuardado.getItem("carrito"));
        }
    }

    // Vaciar carrito usando también sweet alert
    btnVaciar.addEventListener("click", () => {
        Swal.fire({
            title: "¿Estás seguro que quieres vaciar tu carrito de compras?",
            icon: "warning",
            color: "#716add",
            backdrop: `rgba(0,0,123,0.4)
        url("src/imagenes/nyan-cat.gif")
        left top
        no-repeat
        `,
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                actualizarCarrito();
                localStorage.clear();
                Swal.fire({
                    title: "Has vaciado tu carrito.",
                    icon: "success",
                    text: "Regresa a comprar pronto.",
                    color: "#716add",
                    backdrop: `rgba(0,0,123,0.4)
                url("src/imagenes/nyan-cat.gif")
                left top
                no-repeat
                `,
                });
            }
        });
    });
};
// inicializamos las funciones
obtenerProductos();