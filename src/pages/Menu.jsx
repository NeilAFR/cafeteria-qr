import { useState, useEffect } from 'react';
import { IoMdSnow } from "react-icons/io";
import { MdLocalCafe, MdLunchDining, MdCookie, MdLocalBar, MdIcecream, MdAdd, MdBrightnessMedium, MdOutlineLightMode, MdRestaurantMenu, MdCheck, MdList } from "react-icons/md";
import ModalProducto from './ModalProductos';

const iconosPorMacroCategoria = {
  "Todos": <MdList className="text-xl" />,
  "Salados": <MdLunchDining className="text-lg" />,
  "Dulces": <MdCookie className="text-lg" />,
  "Bebidas calientes": <MdLocalCafe className="text-lg" />,
  "Bebidas frías": <IoMdSnow className="text-lg" />,
  "Bebidas con alcohol": <MdLocalBar className="text-lg" />
};

const ordenMacroCategorias = [
  "Salados",
  "Dulces",
  "Bebidas frías",
  "Bebidas calientes",
  "Bebidas con alcohol"
];

// --- NUEVO: DICCIONARIO DE ORDEN PARA SUBCATEGORÍAS -
const ordenSubCategorias = {
  "Salados": ["Smash Burgers", "Papas / Salchipapas", "Mini Waffles Salados"],

};

function Menu({ irAlCarrito, carrito, agregarAlCarrito, productos, toppings, modoOscuro, toggleModoOscuro }) {

  const macroCategoriasUnicas = ordenMacroCategorias.filter(macro =>
    productos.some(p => p.macro_categoria === macro)
  );

  const pestanasNavbar = ['Todos', ...macroCategoriasUnicas];

  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [subCategoriaActiva, setSubCategoriaActiva] = useState('Todos');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [categoriaActiva]);

  // --- LÓGICA DEL CARRUSEL ---
  const promociones = [
    { imagen: "/cheesecake_fresa.jpg", etiqueta: "Especial del día", titulo: "Cheesecake\nde Fresa", textoBoton: "Ver Promo" },
    { imagen: "/escape_room4.jpg", etiqueta: "Diversión", titulo: "ESCAPE ROOM", textoBoton: "Reserva ya!" },
    { imagen: "/waffles_banner.jpg", etiqueta: "Promo Miércoles", titulo: "3x2 en\nWaffles", textoBoton: "Disfrútalo!" }
  ];

  const [promoActual, setPromoActual] = useState(0);
  const siguientePromo = () => setPromoActual(prev => (prev === promociones.length - 1 ? 0 : prev + 1));
  const anteriorPromo = () => setPromoActual(prev => (prev === 0 ? promociones.length - 1 : prev - 1));

  useEffect(() => {
    const intervalo = setInterval(siguientePromo, 5000);
    return () => clearInterval(intervalo);
  }, [promoActual]);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const manejarTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const manejarTouchMove = (e) => setTouchEndX(e.targetTouches[0].clientX);
  const manejarTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distancia = touchStartX - touchEndX;
    if (distancia > 50) siguientePromo();
    else if (distancia < -50) anteriorPromo();
  };

  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalPrecio = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

  const cambiarPestana = (pestana) => {
    setCategoriaActiva(pestana);
    setSubCategoriaActiva('Todos');
  };

  const manejarClickAgregar = (producto) => {
    const categoriaConExtras = toppings?.find(t => t.categoria === producto.categoria);
    if (categoriaConExtras && categoriaConExtras.extras && categoriaConExtras.extras.length > 0) {
      setProductoSeleccionado({ ...producto, extras_disponibles: categoriaConExtras.extras });
    } else {
      agregarAlCarrito({ ...producto, idCarrito: producto.id.toString(), cantidad: 1 });
    }
  };

  const renderizarTarjeta = (producto, esCompacta) => {
    if (esCompacta) {
      return (
        <article key={producto.id} className={`bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm dark:shadow-dark-elevated border border-gray-100 dark:border-white/5 flex flex-col items-center text-center transition-all active:scale-[0.99] relative overflow-hidden ${!producto.disponible ? 'opacity-70 grayscale' : ''}`}>
          {!producto.disponible && <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm uppercase tracking-wider">Agotado</div>}

          <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-black/20 shadow-sm">
            <img alt={producto.nombre} className={`w-full h-full object-cover ${modoOscuro ? 'opacity-90' : ''}`} src={producto.imagen_url} />
          </div>

          <h3 className="font-['Fredoka'] font-bold text-[15px] text-gray-800 dark:text-text-cream leading-tight mb-2 line-clamp-2 min-h-[38px] flex items-center justify-center">{producto.nombre}</h3>

          <div className="w-full flex justify-between items-center mt-auto pt-2 border-t border-gray-50 dark:border-white/5">
            <span className={`font-bold text-sm ${producto.disponible ? 'text-[#E95D34] dark:text-primary' : 'text-gray-500 dark:text-text-muted'}`}>S/ {producto.precio.toFixed(2)}</span>

            <button onClick={() => manejarClickAgregar(producto)} disabled={!producto.disponible} className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors ${producto.disponible ? 'bg-white/10 text-[#E95D34] dark:text-primary hover:bg-[#E95D34] hover:text-white dark:hover:bg-primary dark:hover:text-white' : 'bg-gray-300 dark:bg-white/5 text-gray-500 dark:text-text-muted cursor-not-allowed'}`}>
              <MdAdd className="text-base" />
            </button>
          </div>
        </article>
      );
    }

    return (
      <article key={producto.id} className={`bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm dark:shadow-dark-elevated border border-gray-100 dark:border-white/5 flex gap-4 transition-all active:scale-[0.99] relative overflow-hidden ${!producto.disponible ? 'opacity-70 grayscale' : ''}`}>
        {!producto.disponible && <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm uppercase tracking-wider">Agotado</div>}

        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-black/20">
          <img alt={producto.nombre} className={`w-full h-full object-cover ${modoOscuro ? 'opacity-90' : ''}`} src={producto.imagen_url} />
          {producto.popular && producto.disponible && <span className="absolute top-1 left-1 bg-yellow-400 dark:bg-yellow-500/90 text-yellow-900 dark:text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">Popular</span>}
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-['Fredoka'] font-bold text-lg text-gray-800 dark:text-text-cream leading-tight pr-2">{producto.nombre}</h3>
            </div>
            <p className="text-gray-500 dark:text-text-muted text-xs mt-1 line-clamp-2">{producto.descripcion}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className={`font-bold text-lg ${producto.disponible ? 'text-[#E95D34] dark:text-primary' : 'text-gray-500 dark:text-text-muted'}`}>S/ {producto.precio.toFixed(2)}</span>

            <button onClick={() => manejarClickAgregar(producto)} disabled={!producto.disponible} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${producto.disponible ? 'bg-[#E95D34] dark:bg-primary text-white hover:bg-[#C8411B] dark:hover:bg-primary-dark' : 'bg-gray-300 dark:bg-white/5 text-gray-500 dark:text-text-muted cursor-not-allowed'}`}>
              <MdAdd className="text-lg" />
            </button>
          </div>
        </div>
      </article>
    );
  };

  const macrosAMostrar = categoriaActiva === 'Todos' ? macroCategoriasUnicas : [categoriaActiva];

  return (
    <div className="bg-[#FFFBF2] dark:bg-background-dark font-['Nunito'] text-[#4A3B32] dark:text-text-cream min-h-screen pb-24 selection:bg-[#E95D34] dark:selection:bg-primary selection:text-white transition-colors duration-300">

      <header className="sticky top-0 z-40 bg-[#FFFBF2]/95 dark:bg-background-dark/90 backdrop-blur-md border-b border-[#E95D34]/10 dark:border-white/5 pb-2 shadow-sm transition-colors duration-300">
        <div className="px-5 pt-6 pb-2 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="font-['Fredoka'] font-semibold text-2xl text-[#E95D34] dark:text-primary tracking-wide">4 Gatos</h1>
            <span className="text-xs uppercase tracking-widest font-bold opacity-70 dark:text-text-muted">Café Lúdico</span>
          </div>

          <button
            onClick={toggleModoOscuro}
            className="p-2 rounded-full bg-white dark:bg-surface-dark shadow-sm dark:shadow-dark-elevated text-[#E95D34] dark:text-primary hover:bg-orange-50 dark:hover:bg-white/5 transition-colors"
          >
            {modoOscuro ? <MdOutlineLightMode className="text-xl" /> : <MdBrightnessMedium className="text-xl" />}
          </button>
        </div>

        <nav className="mt-2 w-full overflow-x-auto pl-5 pr-2" style={{ scrollbarWidth: 'none' }}>
          <div className="flex space-x-3 pb-2 min-w-max">
            {pestanasNavbar.map((pestana) => {
              const estaActivo = categoriaActiva === pestana;
              return (
                <button
                  key={pestana}
                  onClick={() => cambiarPestana(pestana)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 ${estaActivo ? 'bg-[#E95D34] dark:bg-primary text-white shadow-[0_4px_15px_-3px_rgba(233,93,52,0.4)] dark:shadow-soft font-bold' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 text-gray-500 dark:text-text-muted hover:bg-orange-50 dark:hover:text-text-cream font-medium'}`}
                >
                  <span className={estaActivo ? 'text-white' : 'text-gray-400 dark:text-text-muted'}>
                    {iconosPorMacroCategoria[pestana] || <MdRestaurantMenu className="text-lg" />}
                  </span>
                  <span className="font-['Fredoka']">{pestana}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="px-5 py-6 space-y-6">

        <div
          className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg dark:shadow-dark-elevated group bg-gray-800 dark:border dark:border-white/5 touch-pan-y"
          onTouchStart={manejarTouchStart}
          onTouchMove={manejarTouchMove}
          onTouchEnd={manejarTouchEnd}
        >
          {promociones.map((promo, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === promoActual ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img src={promo.imagen} alt={`Promoción ${index + 1}`} className={`absolute inset-0 w-full h-full object-cover ${modoOscuro ? 'opacity-80' : ''}`} />
              <div className={`absolute inset-0 bg-gradient-to-r ${modoOscuro ? 'from-background-dark via-background-dark/60' : 'from-black/70 via-black/40'} to-transparent flex flex-col justify-center px-6`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${modoOscuro ? 'text-primary' : 'text-white/90'}`}>{promo.etiqueta}</span>
                <h2 className="text-white font-['Fredoka'] text-2xl font-bold leading-tight whitespace-pre-line drop-shadow-md">{promo.titulo}</h2>
                <button className={`mt-3 text-white text-xs font-bold px-4 py-2 rounded-lg w-max shadow-md transition-colors ${modoOscuro ? 'bg-primary hover:bg-primary-dark shadow-orange-900/20' : 'bg-[#E95D34] hover:bg-[#C8411B]'}`}>{promo.textoBoton}</button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {promociones.map((_, index) => (
              <button key={index} onClick={() => setPromoActual(index)} className={`w-2 h-2 rounded-full transition-colors ${index === promoActual ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>

        <div className="pt-2">
          {macrosAMostrar.map(macro => {
            const productosDeLaMacro = productos.filter(p => p.macro_categoria === macro);

            // 1. OBTENEMOS LAS SUBCATEGORÍAS ÚNICAS
            let subCatsDeLaMacro = [...new Set(productosDeLaMacro.map(p => p.categoria))];

            // 2. APLICAMOS EL ORDENAMIENTO ESTRICTO SI EXISTE
            if (ordenSubCategorias[macro]) {
              subCatsDeLaMacro.sort((a, b) => {
                let posA = ordenSubCategorias[macro].indexOf(a);
                let posB = ordenSubCategorias[macro].indexOf(b);

                // Si encontramos un producto que no está en la lista de orden, lo mandamos al final (99)
                if (posA === -1) posA = 99;
                if (posB === -1) posB = 99;

                return posA - posB;
              });
            }

            const mostrarPildoras = categoriaActiva !== 'Todos' && subCatsDeLaMacro.length > 1;

            const subCatsAMostrar = (categoriaActiva !== 'Todos' && subCategoriaActiva !== 'Todos')
              ? [subCategoriaActiva]
              : subCatsDeLaMacro;

            return (
              <section key={macro} className={`${categoriaActiva === 'Todos' ? 'mb-10' : 'mb-4'}`}>

                {categoriaActiva === 'Todos' ? (
                  <h2 className="font-['Fredoka'] text-3xl font-extrabold text-[#E95D34] dark:text-primary mb-6 uppercase tracking-wider border-b-2 border-[#E95D34]/20 dark:border-white/5 pb-2">
                    {macro}
                  </h2>
                ) : (
                  <h2 className="font-['Fredoka'] text-2xl font-extrabold text-gray-800 dark:text-text-cream tracking-tight mb-4">
                    {macro}
                  </h2>
                )}

                {mostrarPildoras && (
                  <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
                    {["Todos", ...subCatsDeLaMacro].map(subCat => {
                      const esPildoraActiva = subCategoriaActiva === subCat;
                      return (
                        <button
                          key={subCat}
                          onClick={() => setSubCategoriaActiva(subCat)}
                          className={`flex items-center px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${esPildoraActiva ? 'bg-gray-800 dark:bg-white/10 text-white shadow-md' : 'bg-white dark:bg-surface-dark text-gray-500 dark:text-text-muted border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 dark:hover:text-text-cream'}`}
                        >
                          {esPildoraActiva && <MdCheck className="mr-1 text-base" />}
                          {subCat}
                        </button>
                      );
                    })}
                  </div>
                )}

                {subCatsAMostrar.map(subCat => {
                  const items = productosDeLaMacro.filter(p => p.categoria === subCat);
                  const esCompacta = ['Bebidas de Café', 'Bebidas de Café Frías', 'Cervezas', 'Jugos Clásicos', 'Teteras 1.8L', 'Macerados', 'Otras Bebidas', 'Postres'].includes(subCat);

                  return (
                    <div key={subCat} className="mb-8">
                      {(subCatsAMostrar.length > 1 || categoriaActiva === 'Todos') && (
                        <h3 className="font-['Fredoka'] text-xl font-bold text-gray-800 dark:text-text-cream mb-4 opacity-90">
                          {subCat}
                        </h3>
                      )}

                      <div className={`grid gap-4 ${esCompacta ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {items.map(producto => renderizarTarjeta(producto, esCompacta))}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-5 z-40">
        <button onClick={irAlCarrito} className="w-full bg-[#1F1B1A] dark:bg-primary text-white p-4 rounded-xl shadow-2xl dark:shadow-orange-900/40 flex justify-between items-center hover:scale-[1.02] transition-transform duration-200 border border-transparent dark:border-white/10">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 dark:bg-black/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">{totalItems}</div>
            <span className="font-['Fredoka'] font-medium">Ver tu pedido</span>
          </div>
          <div className="font-bold text-lg">S/ {totalPrecio.toFixed(2)}</div>
        </button>
      </div>

      {productoSeleccionado && (
        <ModalProducto producto={productoSeleccionado} cerrarModal={() => setProductoSeleccionado(null)} confirmarAgregado={(prod) => { agregarAlCarrito(prod); setProductoSeleccionado(null); }} />
      )}
    </div>
  );
}

export default Menu;