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
  { id: 5, nombre: "Garfield", descripcion: "Mango bañado con reducción de maracuyá y miel.", precio: 19.00, imagen: "/waffle_garfield.jpg", disponible: true, categoria: "Mini Waffles", macro_categoria: "Postre" },
  { id: 6, nombre: "Waffle Tiramisú", descripcion: "Glaseado de queso crema, helado de vainilla.", precio: 20.00, imagen: "/waffle_tiramisu.jpg", disponible: true, categoria: "Mini Waffles", macro_categoria: "Postre" }
];

function App() {
  const [pantallaActual, setPantallaActual] = useState('bienvenida');
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(item => item.id === producto.id);
      if (productoExistente) {
        return carritoActual.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...carritoActual, { ...producto, cantidad: 1 }];
      }
    });
  };
  
// --- 1. NUEVA FUNCIÓN: Restar 1 o eliminar si llega a 0 ---
  const disminuirCantidad = (id) => {
    setCarrito((carritoActual) => {
      const producto = carritoActual.find(item => item.id === id);
      if (producto.cantidad === 1) {
        // Si solo queda 1, lo eliminamos del carrito
        return carritoActual.filter(item => item.id !== id);
      } else {
        // Si hay más de 1, le restamos 1 a la cantidad
        return carritoActual.map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }
    });
  };

  // --- 2. NUEVA FUNCIÓN: Eliminar por completo ---
  const eliminarDelCarrito = (id) => {
    setCarrito((carritoActual) => carritoActual.filter(item => item.id !== id));
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