import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Bienvenida from './pages/Bienvenida';
import Menu from './pages/Menu';
import Carrito from './pages/Carrito';
import Confirmacion from './pages/Confirmacion';

function App() {
  const [pantallaActual, setPantallaActual] = useState('bienvenida');
  const [carrito, setCarrito] = useState([]);

  const [dbProductos, setDbProductos] = useState([]);
  const [dbToppings, setDbToppings] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- 1. ESTADO GLOBAL DEL MODO OSCURO ---
  // Iniciamos en falso (Modo Claro por defecto)
  const [modoOscuro, setModoOscuro] = useState(false);

  // --- 2. INYECTAR LA CLASE AL HTML ---
  // Este useEffect vigila el botón. Si es true, pone 'dark' en todo tu proyecto.
  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modoOscuro]);

  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);
  // ----------------------------------------

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data: productos, error: errorProd } = await supabase.from('productos').select('*');
        if (errorProd) throw errorProd;

        const { data: toppings, error: errorTop } = await supabase.from('categoria_toppings').select('*');
        if (errorTop) throw errorTop;

        setDbProductos(productos);
        setDbToppings(toppings);
      } catch (error) {
        console.error("Error descargando datos:", error.message);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

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

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] dark:bg-background-dark flex flex-col items-center justify-center text-[#E95D34] transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-[#E95D34]/30 border-t-[#E95D34] rounded-full animate-spin mb-4"></div>
        <h2 className="font-['Fredoka'] text-xl font-bold animate-pulse dark:text-text-cream">Cargando carta de 4 Gatos...</h2>
      </div>
    );
  }

  return (
    <div>
      {pantallaActual === 'bienvenida' && (
        <Bienvenida
          alHacerClic={irAlMenu}
          modoOscuro={modoOscuro}
          toggleModoOscuro={toggleModoOscuro}
        />
      )}

      {pantallaActual === 'menu' && (
        <Menu
          irAlCarrito={irAlCarrito}
          carrito={carrito}
          agregarAlCarrito={agregarAlCarrito}
          productos={dbProductos}
          toppings={dbToppings}
          // --- 3. PASAMOS LAS PROPS AL MENÚ ---
          modoOscuro={modoOscuro}
          toggleModoOscuro={toggleModoOscuro}
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