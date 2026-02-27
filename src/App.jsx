import { useState, useEffect } from 'react';
import { supabase } from './supabase'; // <-- Importamos nuestro puente
import Bienvenida from './pages/Bienvenida';
import Menu from './pages/Menu'; 
import Carrito from './pages/Carrito';
import Confirmacion from './pages/Confirmacion';

function App() {
  const [pantallaActual, setPantallaActual] = useState('bienvenida');
  const [carrito, setCarrito] = useState([]);
  
  // 1. NUEVOS ESTADOS PARA LA BASE DE DATOS REAL
  const [dbProductos, setDbProductos] = useState([]);
  const [dbToppings, setDbToppings] = useState([]);
  const [cargando, setCargando] = useState(true); // Para mostrar una pantalla de carga

  // 2. LA MAGIA: Descargamos los datos al iniciar la app
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // A. Traemos los productos de Supabase
        const { data: productos, error: errorProd } = await supabase
          .from('productos')
          .select('*');
        if (errorProd) throw errorProd;

        // B. Traemos los toppings de Supabase
        const { data: toppings, error: errorTop } = await supabase
          .from('categoria_toppings')
          .select('*');
        if (errorTop) throw errorTop;

        // C. Los guardamos en la memoria de React
        setDbProductos(productos);
        setDbToppings(toppings);
      } catch (error) {
        console.error("Error descargando datos:", error.message);
      } finally {
        setCargando(false); // Apagamos la pantalla de carga
      }
    };

    cargarDatos();
  }, []);

  // --- LAS FUNCIONES DEL CARRITO SE QUEDAN EXACTAMENTE IGUAL ---
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
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

  const aumentarCantidad = (idCarritoBusqueda) => {
    setCarrito((carritoActual) =>
      carritoActual.map(item =>
        item.idCarrito === idCarritoBusqueda ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const eliminarDelCarrito = (idCarritoBusqueda) => {
    setCarrito((carritoActual) => carritoActual.filter(item => item.idCarrito !== idCarritoBusqueda));
  };

  const irAlMenu = () => setPantallaActual('menu');
  const irAlCarrito = () => setPantallaActual('carrito');
  const irAConfirmacion = () => setPantallaActual('confirmacion');

  const finalizarPedidoYVolver = () => {
    setCarrito([]);
    setPantallaActual('menu');
  };

  // --- NUEVA PANTALLA DE CARGA MIENTRAS DESCARGA DE SUPABASE ---
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] flex flex-col items-center justify-center text-[#E95D34]">
        <div className="w-12 h-12 border-4 border-[#E95D34]/30 border-t-[#E95D34] rounded-full animate-spin mb-4"></div>
        <h2 className="font-['Fredoka'] text-xl font-bold animate-pulse">Cargando carta de 4 Gatos...</h2>
      </div>
    );
  }

  // --- EL RENDERIZADO PRINCIPAL QUEDA IGUAL (Pero ahora usa datos reales) ---
  return (
    <div>
      {pantallaActual === 'bienvenida' && <Bienvenida alHacerClic={irAlMenu} />}
      
      {pantallaActual === 'menu' && (
        <Menu 
          irAlCarrito={irAlCarrito} 
          carrito={carrito} 
          agregarAlCarrito={agregarAlCarrito} 
          productos={dbProductos} 
          toppings={dbToppings} /* ¡IMPORTANTE! Pasamos la tabla de toppings al Menu */
        />
      )}

      {pantallaActual === 'carrito' && (
        <Carrito 
          irAlMenu={irAlMenu} 
          carrito={carrito} 
          productosDB={dbProductos} 
          agregarAlCarrito={agregarAlCarrito} 
          disminuirCantidad={disminuirCantidad}
          aumentarCantidad={aumentarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
          irAConfirmacion={irAConfirmacion} 
        />
      )}

      {pantallaActual === 'confirmacion' && (
        <Confirmacion volverAlMenu={finalizarPedidoYVolver} />
      )}
    </div>
  );
}

export default App;