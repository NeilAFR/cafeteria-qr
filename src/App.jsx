import { useState } from 'react';
import Bienvenida from './pages/Bienvenida';
import Menu from './pages/Menu'; 
import Carrito from './pages/Carrito';

// NUESTRA BASE DE DATOS CENTRAL FINGIENDO SER SUPABASE
// Fíjate que es una lista plana y cada producto tiene su 'macro_categoria' y 'categoria'
const dbProductos = [
  // --- BEBIDAS ---
  { id: 1, nombre: "Capuccino", descripcion: "Clásico con espuma de leche.", precio: 10.00, imagen: "/capuccino.jpeg", disponible: true, categoria: "Bebidas de Café", macro_categoria: "Bebida" },
  { id: 2, nombre: "Mocaccino", descripcion: "Chocolate belga derretido con espresso y espuma.", precio: 11.00, imagen: "/mocaccino.jpg", disponible: false, categoria: "Bebidas de Café", macro_categoria: "Bebida" },
  
  // --- COMIDAS ---
  { id: 3, nombre: "Tokio Smash", descripcion: "120g carne, salsa oriental, pepinillos, queso cheddar.", precio: 21.00, imagen: "/smash_tokyo.jpg", disponible: true, popular: true, categoria: "Smash Burgers", macro_categoria: "Comida" },
  { id: 4, nombre: "La Kansas", descripcion: "Doble hamburguesa, salsa BBQ, cebolla caramelizada, queso cheddar y Tocino.", precio: 22.00, imagen: "/burger_kansas.jpg", disponible: true, categoria: "Smash Burgers", macro_categoria: "Comida" },
  
  // --- POSTRES (O Dulces) ---
{ 
    id: 5, 
    nombre: "Garfield", 
    precio: 19.00, 
    categoria: "Mini Waffles", 
    descripcion: "Mango bañado con reducción de maracuyá y miel de maple.",
    macro_categoria: "Dulces",
    imagen: "/waffle_garfield.jpg",
    disponible: true,
    // ¡NUEVA COLUMNA DE EXTRAS!
    extras_disponibles: [
      { id_extra: "ext1", nombre: "Nutella", precio: 3.00 },
      { id_extra: "ext2", nombre: "Fresas", precio: 5.00 },
      { id_extra: "ext3", nombre: "Arándanos", precio: 4.00 },
      { id_extra: "ext4", nombre: "Frambuesas", precio: 6.00 }
    ]
  },
  { id: 6, nombre: "Waffle Tiramisú", descripcion: "Glaseado de queso crema, helado de vainilla.", precio: 20.00, imagen: "/waffle_tiramisu.jpg", disponible: true, categoria: "Mini Waffles", macro_categoria: "Postre" },
  { 
    id: 7, 
    nombre: "Manzana del Bósforo", 
    precio: 10.00, 
    categoria: "Infusiones del Bósforo", 
    descripcion: "Flor de jamaica, manzana y canela",
    macro_categoria: "Bebidas calientes",
    imagen: "/manzana_bosforo.jpg",
    disponible: true,
    // EXTRAS PARA INFUSIONES
    extras_disponibles: [
      { id_extra: "ext3", nombre: "Piteada (Con pisco)", precio: 3.00 }
    ]
  },
  { 
    id: 8, 
    nombre: "Sinh TÓ Mango", 
    precio: 13.00, 
    categoria: "Sinh TÓ / Batidos", 
    macro_categoria: "Bebidas frías",
    imagen: "/mango.jpg",
    disponible: true,
    // EXTRAS PARA BATIDOS
    extras_disponibles: [
      { id_extra: "ext4", nombre: "Hazlo Bubble (Tapioca)", precio: 3.00 }
    ]
  }
];


function App() {
  const [pantallaActual, setPantallaActual] = useState('bienvenida');
  const [carrito, setCarrito] = useState([]);

const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      // Ahora buscamos por idCarrito
      const productoExistente = carritoActual.find(item => item.idCarrito === producto.idCarrito);
      if (productoExistente) {
        return carritoActual.map(item => 
          item.idCarrito === producto.idCarrito 
            ? { ...item, cantidad: item.cantidad + (producto.cantidad || 1) } 
            : item
        );
      } else {
        return [...carritoActual, producto];
      }
    });
  };

  const disminuirCantidad = (idCarritoBusqueda) => {
    setCarrito((carritoActual) => {
      const producto = carritoActual.find(item => item.idCarrito === idCarritoBusqueda);
      if (producto.cantidad === 1) {
        return carritoActual.filter(item => item.idCarrito !== idCarritoBusqueda);
      } else {
        return carritoActual.map(item =>
          item.idCarrito === idCarritoBusqueda ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }
    });
  };

  const eliminarDelCarrito = (idCarritoBusqueda) => {
    setCarrito((carritoActual) => carritoActual.filter(item => item.idCarrito !== idCarritoBusqueda));
  };

  const irAlMenu = () => setPantallaActual('menu');
  const irAlCarrito = () => setPantallaActual('carrito');

  return (
    <div>
      {pantallaActual === 'bienvenida' && <Bienvenida alHacerClic={irAlMenu} />}
      
      {pantallaActual === 'menu' && (
        <Menu 
          irAlCarrito={irAlCarrito} 
          carrito={carrito} 
          agregarAlCarrito={agregarAlCarrito} 
          productos={dbProductos} 
        />
      )}

      {pantallaActual === 'carrito' && (
        <Carrito 
          irAlMenu={irAlMenu} 
          carrito={carrito} 
          productosDB={dbProductos} 
          agregarAlCarrito={agregarAlCarrito} 
          disminuirCantidad={disminuirCantidad} /* PASAMOS LAS NUEVAS FUNCIONES */
          eliminarDelCarrito={eliminarDelCarrito}
        />
      )}
    </div>
  );
}

export default App;