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
  const [modoOscuro, setModoOscuro] = useState(false);

  const [numeroMesa, setNumeroMesa] = useState('Barra');

  // --- NUEVO ESTADO: Para mostrar un loading mientras se envía el pedido ---
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  useEffect(() => {
    const parametrosURL = new URLSearchParams(window.location.search);
    const mesaDesdeLink = parametrosURL.get('mesa');

    if (mesaDesdeLink) {
      setNumeroMesa(mesaDesdeLink);
    }
  }, []);

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modoOscuro]);

  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

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

  // =========================================================================
  // --- NUEVA MEGA-FUNCIÓN: ENVIAR EL PEDIDO A SUPABASE ---
  // =========================================================================
  const procesarPedidoFinal = async (observacionesGenerales) => {
    if (carrito.length === 0) return;

    setEnviandoPedido(true); // Bloqueamos el botón para que el usuario no dé doble clic

    try {
      let cuentaActivaId = null;

      // 1. BUSCAR SI LA MESA YA TIENE UNA CUENTA ABIERTA
      const { data: cuentaExistente, error: errorBusqueda } = await supabase
        .from('cuentas')
        .select('id')
        .eq('mesa_id', numeroMesa)
        .eq('estado', 'abierta')
        .maybeSingle(); // maybeSingle: puede devolver 1 o ninguno sin dar error crítico

      if (errorBusqueda) throw errorBusqueda;

      if (cuentaExistente) {
        cuentaActivaId = cuentaExistente.id;
      } else {
        // 2. SI NO HAY CUENTA ABIERTA, CREAMOS UNA NUEVA
        const { data: nuevaCuenta, error: errorCuenta } = await supabase
          .from('cuentas')
          .insert([{ mesa_id: numeroMesa, estado: 'abierta' }])
          .select('id')
          .single();

        if (errorCuenta) throw errorCuenta;
        cuentaActivaId = nuevaCuenta.id;
      }

      // 3. CREAR EL PEDIDO (LA COMANDA) VINCULADO A LA CUENTA
      const { data: nuevoPedido, error: errorPedido } = await supabase
        .from('pedidos')
        .insert([{
          cuenta_id: cuentaActivaId,
          estado: 'pendiente',
          observaciones_generales: observacionesGenerales
        }])
        .select('id')
        .single();

      if (errorPedido) throw errorPedido;

      // 4. MAPEAR EL CARRITO PARA INSERTARLO EN PEDIDO_ITEMS
      // Transformamos nuestro formato de React al formato exacto de SQL
      const itemsParaInsertar = carrito.map(item => ({
        pedido_id: nuevoPedido.id,
        producto_id: item.id, // Conectamos con el catálogo original
        nombre_snapshot: item.nombre,
        precio_unitario: item.precio, // El precio final ya calculado con extras
        cantidad: item.cantidad,
        extras: item.extras || null // JSON de extras si los hay
      }));

      // Inserción masiva de todos los items de un solo golpe
      const { error: errorItems } = await supabase
        .from('pedido_items')
        .insert(itemsParaInsertar);

      if (errorItems) throw errorItems;

      // 5. ¡ÉXITO! LIMPIAMOS Y MANDAMOS A CONFIRMACIÓN
      setCarrito([]);
      setPantallaActual('confirmacion');

    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un problema al enviar tu pedido a la cocina. Por favor, intenta nuevamente o avisa al mesero.");
    } finally {
      setEnviandoPedido(false); // Desbloqueamos el botón
    }
  };
  // =========================================================================

  const finalizarPedidoYVolver = () => {
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

  // --- PANTALLA DE CARGA MIENTRAS SE ENVÍA EL PEDIDO (Opcional pero recomendado para UX) ---
  if (enviandoPedido) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-background-dark flex flex-col items-center justify-center text-[#E65E3A] transition-colors duration-300 z-50">
        <div className="w-16 h-16 border-4 border-[#E65E3A]/20 border-t-[#E65E3A] rounded-full animate-spin mb-6"></div>
        <h2 className="font-['Fredoka'] text-2xl font-bold animate-pulse dark:text-text-cream">Enviando a cocina...</h2>
        <p className="text-gray-500 dark:text-text-muted mt-2 font-medium">Por favor no cierres la aplicación</p>
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
          numeroMesa={numeroMesa}
        />
      )}

      {pantallaActual === 'menu' && (
        <Menu
          irAlCarrito={irAlCarrito}
          carrito={carrito}
          agregarAlCarrito={agregarAlCarrito}
          productos={dbProductos}
          toppings={dbToppings}
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
          irAConfirmacion={procesarPedidoFinal} /* <-- ¡CONECTAMOS LA NUEVA MEGA-FUNCIÓN AQUÍ! */
          numeroMesa={numeroMesa}
        />
      )}

      {pantallaActual === 'confirmacion' && (
        <Confirmacion
          volverAlMenu={finalizarPedidoYVolver}
          numeroMesa={numeroMesa}
        />
      )}
    </div>
  );
}

export default App;